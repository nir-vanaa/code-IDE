// import * as esbuild from 'esbuild-wasm';
import type { Plugin } from 'esbuild-wasm';
import { FileStoreState } from '../../../stores/fileStore';

let initialized = false;

const getEsbuild = async () => {
    const esbuild = await import('esbuild-wasm');
    return esbuild;
};

const initEsBuild = async () => {
    if (initialized) return;
    initialized = true;
    // Initialize esbuild
    const esbuild = await getEsbuild();
    await esbuild.initialize({
        wasmURL: '/assets/esbuild.wasm',
        worker: true,
    });
    FileStoreState().setInitializedEsBuild(true);
    console.log('Esbuild initialized');
};

// Custom plugin to resolve and load files from the in-memory object
// const files: Record<string, string> = {
//     '/index.ts': `
//       import { foo } from './foo';
//       const result: string = foo('TypeScript');
//       document.getElementById('result')!.textContent = result;
//     `,
//     '/foo.ts': `
//       export function foo(name: string): string {
//         return 'Hello from ' + name + '!';
//       }
//     `,
// };

// // Plugin to resolve and load files from the in-memory object
// const filePlugin: esbuild.Plugin = {
//     name: 'file-plugin',
//     setup(build) {
//         // Resolve paths
//         build.onResolve({ filter: /.*/ }, (args) => {
//             if (args.path.startsWith('.')) {
//                 const resolvedPath = new URL(args.path, `file://${args.resolveDir}/`).pathname;
//                 // Try .ts first, then .js
//                 if (files[`${resolvedPath}.ts`]) {
//                     return { path: `${resolvedPath}.ts`, namespace: 'file' };
//                 }
//                 if (files[`${resolvedPath}.js`]) {
//                     return { path: `${resolvedPath}.js`, namespace: 'file' };
//                 }
//                 return { path: resolvedPath, namespace: 'file' };
//             }
//             return { path: args.path, external: true };
//         });

//         // Load file contents
//         build.onLoad({ filter: /.*/ }, (args) => {
//             const ext = args.path.split('.').pop();
//             if (files[args.path]) {
//                 return {
//                     contents: files[args.path],
//                     loader: ext === 'ts' ? 'ts' : 'js',
//                 };
//             }
//         });
//     },
// };

const generateFilePlugin = (files: Record<string, string>): Plugin => {
    return {
        name: 'file-plugin',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (args.path.startsWith('.')) {
                    const resolved = new URL(args.path, `file://${args.resolveDir}/`).pathname;
                    if (files[resolved]) {
                        return { path: resolved, namespace: 'file' };
                    }
                }
                // Absolute import
                if (files[args.path]) {
                    return { path: args.path, namespace: 'file' };
                }
                return { path: args.path, external: true };
            });
            build.onLoad({ filter: /.*/ }, (args) => {
                if (files[args.path]) {
                    const ext = args.path.split('.').pop();
                    return {
                        contents: files[args.path],
                        loader: ext === 'ts' ? 'ts' : 'js',
                    };
                }
                return { contents: '', loader: 'text' };
            });
        },
    };
};

const buildFile = async (files: Record<string, string>) => {
    const filePlugin = generateFilePlugin(files);
    const esbuild = await getEsbuild();
    const result = await esbuild.build({
        entryPoints: ['/main.ts'],
        bundle: true,
        write: false,
        plugins: [filePlugin],
        format: 'esm',
    });
    const outputText = result.outputFiles?.[0].text;
    return outputText;
};

export { buildFile, initEsBuild };
