// import { rolldown } from '@rolldown/browser';

// async function compile() {
//     if (compiling) return;
//     setCompiling(true);

//     const mainCode = latestCode.current;
//     const vfs = new Map<string, string>([['/main.ts', mainCode]]);
//     const t = performance.now();

//     try {
//         const build = await rolldown({
//             input: ['/main.ts'],
//             cwd: '/',
//             plugins: [
//                 {
//                     name: 'vfs',
//                     resolveId: (id: string) => id,
//                     load(id: string) {
//                         if (vfs.has(id)) {
//                             return vfs.get(id)!;
//                         }
//                         throw new Error(`File not found: ${JSON.stringify(id)}`);
//                     },
//                 },
//             ],
//         });

//         const { output: chunks } = await build.generate({
//             dir: 'dist',
//         });

//         if (!cancelled) {
//             setOutput(
//                 chunks
//                     .map(
//                         (chunk: any) =>
//                             `//${chunk.fileName}\n${'code' in chunk ? chunk.code : chunk.source}`,
//                     )
//                     .join('\n'),
//             );
//         }
//     } catch (err: any) {
//         if (!cancelled) {
//             setOutput(ansis.strip(err.toString()));
//             console.error(err);
//         }
//         return;
//     } finally {
//         if (!cancelled) {
//             setTimeCost(+(performance.now() - t).toFixed(2));
//             setCompiling(false);
//         }
//     }

//     // If code changed during compile, recompile
//     if (latestCode.current !== mainCode && !cancelled) {
//         compile();
//     }
// }

// // watch(code, compile, { immediate: true });

// const buildFile = async (file: string) => {
//     const config: BuildOptions = {
//         input: 'src/main.js',
//         output: {
//             file: 'bundle.js',
//         },
//     };
//     try {
//         const result = await build(config);
//         console.log('Build successful:', result);
//     } catch (error) {
//         console.error('Build failed:', error);
//     }
// };

// export { buildFile };
