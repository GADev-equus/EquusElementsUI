+++
title = "A safe AI workflow with Deno sandboxes"
date = 2026-04-09
url = "a-safe-ai-workflow-with-deno-sandboxes"
+++

An AI coding assistant using a cloud model is a vehicle for [remote code execution (RCE)](https://en.wikipedia.org/wiki/Arbitrary_code_execution) by design, which means they're incredibly dangerous! The assistant creators know this, and as a result their assistants usually include a permission system. This is one solution, and should always be set up, but an agent can carry out multiple reads (when it tries to build context) or multiple writes (when it creates/modifies code) from a single question. In practice, checking every command becomes annoying (and humans naturally make mistakes), which is probably why people let it loose on their system! Is there a better solution?

An alternative solution is sandboxing. Using a container is a popular choice, but I prefer Deno sandboxes. Deno sandboxes are just virtual machines (VM) running on Deno's computers, but what makes them great is Deno's JavaScript SDK and SSH. I'm essentially going to be:

1. Starting a VM
2. Copying project files to it
3. Opening the VM's file system (more specifically, the project folder) in Visual Studio Code
4. Using opencode running inside the VM
5. When I'm happy, bringing the changes to my machine

I will step through a Node script that I have created to demonstrate the workflow. Keep in mind that Deno sandboxes are ephemeral - they're short-lived by design for "bursts" of AI coding (Deno [snapshots](https://docs.deno.com/sandbox/volumes/#snapshots) can let you avoid repeating a "setup phase"). (Later on you will see that for changes I want, I bring them into my system in the form of a patch file.)

# Setup

## Create sandbox

```js
await using sandbox = await Sandbox.create();
```

## Install opencode in sandbox

```js
await sandbox.sh`npm i -g opencode-ai`;
await sandbox.fs.upload("./opencode.jsonc", "./opencode.jsonc");
```

## Bring project files into sandbox

I'm using `tar` to copy the entire project folder over.

```js
exec(tarCmd);
// tarCmd: tar --exclude='node_modules' -cz . | ssh example.org tar -C /home/app -xz
```

## Setup callback to get changes

This bit is quite interesting. After the AI coding assistant has made its changes, I can bring them into my system by executing `git diff` and writing the diff to a patch file.

```js
process.stdin.on("data", async (key) => {
	if (key === "d") {
		console.log("Creating patch...");

		await sandbox.sh`git add .`;

		const { stdoutText } =
			await sandbox.sh`git diff --cached`
				.stdout("piped");

		await fs.writeFile("./patch.patch", stdoutText);

		console.log("Patch created");
		console.log("Press ['d' to create patch] ['q' to exit]");
```

# Connecting IDE and running assistant

## Connecting IDE

I want to have the project in the sandbox open in Visual Studio Code. I can mount a remote file system using `sshfs`:

```sh
sshfs /home/tom/work/for_sshfs example.org:/home/app
```

Now it's a folder on my computer just like any other one!

![Screenshot_2026-04-09_20-49-02.png](/blog/images/Screenshot_2026-04-09_20-49-02.png)

## Running assistant

```sh
~% ssh example.org
~# opencode
```
