import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@/": "/src/",
		},
	},

	plugins: [
		AutoImport({
			dts: "types/auto-import.d.ts",
			defaultExportByFilename: true,
			dirs: ["src/utils/*"],
		}),
	]

});
