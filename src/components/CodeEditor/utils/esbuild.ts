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

const generateFilePlugin = (files: Record<string, string>): Plugin => ({
    name: 'file-plugin',
    setup(build) {
        // eslint-disable-next-line consistent-return
        build.onResolve({ filter: /.*/ }, (args) => {
            if (args.path.startsWith('.')) {
                const resolved = new URL(args.path, `file://${args.resolveDir}/`).pathname;
                if (files[resolved]) {
                    return { path: resolved, namespace: 'file' };
                }
            }
            if (files[args.path]) {
                return { path: args.path, namespace: 'file' };
            }
            // Do not return external: true!
            // Just return nothing so the next plugin can try
        });
        // eslint-disable-next-line consistent-return
        build.onLoad({ filter: /.*/ }, (args) => {
            if (files[args.path]) {
                const ext = args.path.split('.').pop();
                let loader: 'js' | 'jsx' | 'ts' | 'tsx' | 'css' = 'js';
                if (ext === 'ts') loader = 'ts';
                else if (ext === 'tsx') loader = 'tsx';
                else if (ext === 'jsx') loader = 'jsx';
                else if (ext === 'css') loader = 'css';
                return {
                    contents: files[args.path],
                    loader,
                };
            }
        });
    },
});

// Plugin to resolve and load modules from unpkg
// CDN plugin for external dependencies
// const unpkgPathPlugin = (): Plugin => ({
//     name: 'unpkg-path-plugin',
//     setup(build) {
//         // Bare imports (e.g. 'react')
//         build.onResolve({ filter: /^[^./].*/ }, (args) => ({
//             path: `https://unpkg.com/${args.path}?module`,
//             namespace: 'unpkg',
//         }));

//         // Relative imports inside unpkg modules
//         build.onResolve({ filter: /^\.+\// }, (args) => ({
//             path: new URL(args.path, `${args.importer}/`).href,
//             namespace: 'unpkg',
//         }));

//         // Load from unpkg
//         build.onLoad({ filter: /.*/, namespace: 'unpkg' }, async (args) => {
//             const res = await fetch(args.path);
//             if (!res.ok) throw new Error(`Failed to fetch ${args.path}`);
//             const text = await res.text();
//             // Guess loader
//             const ext = args.path.split('.').pop();
//             let loader: 'js' | 'jsx' | 'ts' | 'tsx' | 'css' = 'js';
//             if (ext === 'ts') loader = 'ts';
//             else if (ext === 'tsx') loader = 'tsx';
//             else if (ext === 'jsx') loader = 'jsx';
//             else if (ext === 'css') loader = 'css';
//             return { contents: text, loader };
//         });
//     },
// });

// In-memory cache for unpkg/esm.sh modules
const unpkgCache: Record<string, string> = {};

function getLoader(path: string): 'js' | 'jsx' | 'ts' | 'tsx' | 'css' {
    const ext = path.split('.').pop();
    if (ext === 'ts') return 'ts';
    if (ext === 'tsx') return 'tsx';
    if (ext === 'jsx') return 'jsx';
    if (ext === 'css') return 'css';
    return 'js';
}

const esmShPathPlugin = (): Plugin => ({
    name: 'esm-sh-path-plugin',
    setup(build) {
        build.onResolve({ filter: /^[^./].*/ }, (args) => {
            const { path } = args;
            if (path === 'react') {
                return {
                    path: 'https://unpkg.com/react@19.1.0/index.js?module',
                    namespace: 'esm-sh',
                };
            }
            if (path === 'react-dom') {
                return {
                    path: 'https://unpkg.com/react-dom@19.1.0/index.js?module',
                    namespace: 'esm-sh',
                };
            }
            if (path === 'react-dom/client') {
                return {
                    path: 'https://unpkg.com/react-dom@19.1.0/client.js?module',
                    namespace: 'esm-sh',
                };
            }
            // Default: use esm.sh for other bare imports
            return {
                path: `https://esm.sh/${path}?bundle`,
                namespace: 'esm-sh',
            };
        });

        // esm.sh absolute imports (e.g. /react@19.1.0/es2022/react.bundle.mjs)
        build.onResolve({ filter: /^\/.*\.mjs$/ }, (args) => ({
            path: `https://esm.sh${args.path}`,
            namespace: 'esm-sh',
        }));

        // Relative imports inside esm.sh modules
        build.onResolve({ filter: /^\.+\// }, (args) => ({
            path: new URL(args.path, `${args.importer}/`).href,
            namespace: 'esm-sh',
        }));

        // Load from esm.sh or unpkg with in-memory cache
        build.onLoad({ filter: /.*/, namespace: 'esm-sh' }, async (args) => {
            if (unpkgCache[args.path]) {
                return {
                    contents: unpkgCache[args.path],
                    loader: getLoader(args.path),
                };
            }
            const res = await fetch(args.path);
            if (!res.ok) throw new Error(`Failed to fetch ${args.path}`);
            const text = await res.text();
            unpkgCache[args.path] = text;
            return {
                contents: text,
                loader: getLoader(args.path),
            };
        });
    },
});

const inlineCssPlugin = (files: Record<string, string>): Plugin => ({
    name: 'inline-css',
    setup(build) {
        build.onLoad({ filter: /\.css$/ }, (args) => {
            // If using in-memory files
            const css = files[args.path];
            // If using CDN, fetch the CSS here instead
            // const res = await fetch(args.path);
            // const css = await res.text();

            // Return a JS module that injects the CSS at runtime
            return {
                contents: `
            if (typeof document !== 'undefined') {
              const style = document.createElement('style');
              style.textContent = ${JSON.stringify(css)};
              document.head.appendChild(style);
            }
            export default ${JSON.stringify(css)};`,
                loader: 'js',
            };
        });
    },
});

const buildFile = async (files: Record<string, string>) => {
    const filePlugin = generateFilePlugin(files);
    const esbuild = await getEsbuild();
    const result = await esbuild.build({
        entryPoints: ['/main.tsx'],
        bundle: true,
        write: false,
        jsx: 'automatic',
        // sourcemap: true,
        format: 'esm',
        // splitting: true,
        // sourcemap: 'external',
        // outdir: 'out',
        // minifySyntax: true,
        // minifyWhitespace: true,
        external: ['fs'],
        define: {
            // 'process.env.NODE_ENV': 'production',
            global: 'window',
            // process: 'window',
        },
        plugins: [inlineCssPlugin(files), filePlugin, esmShPathPlugin()],
    });
    const outputText = result.outputFiles?.[0].text;
    return outputText;
};

export { buildFile, initEsBuild };
