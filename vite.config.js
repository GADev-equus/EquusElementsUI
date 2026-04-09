import { defineConfig, esmExternalRequirePlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: "src/components/index.js",
			fileName: (format) => `equuselementsui.${format}.js`,
			formats: ["es", "cjs"],
		},
		rolldownOptions: {
			plugins: [
				esmExternalRequirePlugin({
					external: ["react", "react-dom", "prop-types"],
				}),
			],
		},
		minify: false,
	},
});
