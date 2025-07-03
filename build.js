import { build } from 'esbuild';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

build({
	bundle: true,
	conditions: [
		'development',
	],
	entryPoints: [
		'./demo/app.jsx',
	],
	format: 'esm',
	jsx: 'automatic',
	logLevel: 'debug',
	outdir: './demo/build',
	platform: 'neutral',
	plugins: [
		cssModulesPlugin({
			localsConvention: 'dashesOnly',
		}),
	],
	sourcemap: true,
	target: 'esnext',
})
.catch(() => process.exit(1));
