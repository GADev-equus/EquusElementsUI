import { Sandbox } from "@deno/sandbox";
import fs from "node:fs/promises";
import { exec } from "node:child_process";
import readline from "node:readline";

const doNotCopy = [
	"dist",
	"node_modules",
	"sandbox/.env",
	"storybook-static",
	"package-lock.json",
	"*.patch",
];

await using sandbox = await Sandbox.create({
	token: process.env.TOKEN,
	org: process.env.ORG,
});

const { hostname, username } = await sandbox.exposeSsh();

await sandbox.sh`npm i -g opencode-ai`;

await sandbox.sh`mkdir equuselementsui`;
// let username = "test";
// let hostname = "test";
let tarCmd = "";
function buildTarCmd() {
	tarCmd += "tar ";
	for (let path of doNotCopy) {
		tarCmd += `--exclude='${path}' `;
	}
	tarCmd += `-cz . | ssh ${username}@${hostname} tar -C /home/app/equuselementsui -xz`;
}
buildTarCmd();

console.log(`Running... ${tarCmd}`);
await new Promise((resolve) => {
	exec(tarCmd, (err, _, stderr) => {
		console.log(`tar err: ${err}\n${stderr}`);
		resolve();
	});
});

await sandbox.fs.upload(
	"./sandbox/opencode.jsonc",
	"./equuselementsui/opencode.jsonc",
);
// await sandbox.sh`export OPENCODE_CONFIG=/home/app/equuselementsui/opencode.json`; // doesn't work. must do in ssh session (or 'switch model' in opencode)

/*
step 1: start ollama
	ssh root@<>
	./bin/ollama serve

step 2: start sandbox
	npm run sandbox

step 3: setup vs code
	sshfs /home/tom/Pictures/sshfstest <>@ssh.deno.net:/home/app/equuselementsui
	open sshfstest in vs code

step 4: start opencode
	ssh <>@ssh.deno.net
	cd equuselementsui && opencode
*/

console.log(
	`sshfs /home/tom/Pictures/sshfstest ${username}@${hostname}:/home/app/equuselementsui`,
); // -o dir_cache=no
console.log(`ssh ${username}@${hostname}`);

process.stdin.setRawMode(true);
process.stdin.setEncoding("utf-8");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log("Press ['d' to create patch] ['q' to exit]");
process.stdin.on("data", async (key) => {
	if (key === "d") {
		console.log("Creating patch...");
		await sandbox.sh`cd equuselementsui && git add .`; // .noThrow();
		const { stdoutText } =
			await sandbox.sh`cd equuselementsui && git diff --cached`
				.noThrow()
				.stdout("piped");
		// console.log("stdoutText: ", stdoutText);
		try {
			await fs.writeFile("./patch.patch", stdoutText ?? "stdoutText is null");
		} catch (err) {
			console.log(err);
		}
		console.log("Patch created");
		console.log("Press ['d' to create patch] ['q' to exit]");
	}
	if (key === "q") {
		const answer = await new Promise((resolve) => {
			rl.question("Are you sure you want to quit? [y/n] ", (a) => resolve(a));
		});
		if (answer !== "y") {
			return;
		}

		console.log("Exiting...");
		process.exit();
	}
});

await new Promise(() => {});
