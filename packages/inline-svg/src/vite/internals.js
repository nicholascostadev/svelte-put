import fs from 'fs';
import path from 'path';

/**
 * @param {string} dir
 * @returns {string[]}
 */
function findSvgRecursively(dir) {
	/** find all svg files in provided directory */
	const files = fs
		.readdirSync(dir)
		.map((f) => path.join(dir, f))
		.filter((f) => {
			const stat = fs.statSync(f);
			if (stat.isDirectory()) return true;
			if (stat.isFile()) return f.endsWith('.svg');
			return false;
		});
	/** find all svg files in sub directories */
	const directories = files.filter((f) => fs.statSync(f).isDirectory());
	const subFiles = directories.flatMap(findSvgRecursively);
	return [...files, ...subFiles];
}

/**
 * @param {import('../preprocessor/internals').ResolvedSources} sources
 * @param {import('../preprocessor/internals').ResolvedPreprocessorConfig} config
 * @param {string} out - output path
 */
export function generateSourceTyping(sources, config, out) {
	try {
		const { local, dirs } = sources;
		const directories = [...local.directories, ...dirs.flatMap((d) => d.directories)];
		/** @type {Set<string>} */
		const svgs = new Set();
		for (const dir of directories) {
			const files = findSvgRecursively(dir);
			for (const file of files) {
				const svg = path.relative(dir, file).replace('.svg', '');
				svgs.add(`'${svg}'`);
			}
		}
		const indent = '\t\t\t';
		const nonTyped = ['`./${string}`', '`../${string}`'].join(`\n${indent}| `);
		const typing = Array.from(svgs).join(`\n${indent}| `);

		const source = `/** DO NOT EDIT! This file is generated by @svelte-put/inline-svg vite plugin */
declare module 'svelte/elements' {
	export interface SVGAttributes {
		'${config.inlineSrcAttributeName}'?:\n${indent}${nonTyped}\n${indent}| ${typing};
	}
}
export {};
`;

		fs.writeFileSync(out, source);
	} catch (error) {
		console.error('[vite-plugin-svelte-preprocess-inline-svg]', error);
	}
}

/**
 *
 * @param {string} file
 * @param {string[]} extensions
 * @returns {boolean}
 */
export function matchFileExtension(file, extensions) {
	return extensions.some((ext) => file.endsWith(ext));
}
