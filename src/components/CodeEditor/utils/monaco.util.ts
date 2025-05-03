// import * as babel from '@babel/standalone';
import { Monaco } from '@monaco-editor/react';
// import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
// import { packages } from '@babel/standalone';
// import traverse from '@babel/traverse';
// import traverse from '@babel/traverse/lib/index.js';
import { editor } from 'monaco-editor';
import { MonacoJsxSyntaxHighlight, getWorker } from 'monaco-jsx-syntax-highlight';
import { FileStoreState } from '../../../stores/fileStore';

// const { parser, traverse } = packages;

// const babelParse = (code: string) =>
//     parser.parse(code, {
//         sourceType: 'module',
//         plugins: ['jsx'],
//     });

// Minimal Babel setup for React JSX parsing:
// const babelParse = (code: string) =>
//   parse(code, {
//     sourceType: 'module',
//     plugins: ['jsx'],
//   });

// Done =)

// function getMonacoEditor() {
//   return monaco.editor.create(document.getElementById('editor'), {
//     value: 'const AB=<A x={d}><B>{"hello"}</B></A>;',
//     language: 'javascript',
//   });
// }

// const initJSXHighlighter = (monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
//   // Instantiate the highlighter
//   const monacoJSXHighlighter = new MonacoJSXHighlighter(monaco, babel, monacoEditor);
//   // Activate highlighting (debounceTime default: 100ms)
//   monacoJSXHighlighter.highlightOnDidChangeModelContent(100);
//   // Activate JSX commenting
//   monacoJSXHighlighter.addJSXCommentCommand();
// };

// const initMonacoEditor = (monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
//   initJSXHighlighter(monacoEditor, monaco);
// };

// export { initMonacoEditor };

const handleEditorWillMount = (monaco: Monaco) => {
    // Configure TypeScript settings
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        allowJs: true,
        allowSyntheticDefaultImports: true,
        strictNullChecks: true,
        allowImportingTsExtensions: true,
        // typeRoots: ['node_modules/@types'],
    });

    // Add each file as an extraLib with its real content and a virtual file path
    const { files } = FileStoreState();
    Object.entries(files).forEach(([path, content]) => {
        // Ensure the path starts with a slash for virtual file system
        const virtualPath = `file://${path.startsWith('/') ? '' : '/'}${path}`;
        console.log(virtualPath, content);
        monaco.languages.typescript.typescriptDefaults.addExtraLib(content, virtualPath);
    });

    // // Define your custom theme here
    // monaco.editor.defineTheme('vscode-dark-plus', {
    //     base: 'vs-dark',
    //     inherit: true,
    //     rules: [
    //         { token: '', foreground: 'd4d4d4', background: '1e1e1e' },
    //         { token: 'comment', foreground: '6a9955' },
    //         { token: 'string', foreground: 'ce9178' },
    //         { token: 'keyword', foreground: '569cd6' },
    //         { token: 'number', foreground: 'b5cea8' },
    //         { token: 'regexp', foreground: 'd16969' },
    //         { token: 'operator', foreground: 'd4d4d4' },
    //         { token: 'namespace', foreground: '4ec9b0' },
    //         { token: 'type', foreground: '4ec9b0' },
    //         { token: 'function', foreground: 'dcdcaa' },
    //         { token: 'variable', foreground: '9cdcfe' },
    //         { token: 'parameter', foreground: '9cdcfe' },
    //         { token: 'property', foreground: '9cdcfe' },
    //         { token: 'class', foreground: '4ec9b0' },
    //         { token: 'interface', foreground: 'b8d7a3' },
    //         { token: 'enum', foreground: 'b8d7a3' },
    //         { token: 'typeParameter', foreground: '4ec9b0' },
    //         { token: 'delimiter', foreground: 'd4d4d4' },
    //         // JSX specific
    //         { token: 'tag', foreground: '4ec9b0' }, // HTML tags
    //         { token: 'metatag', foreground: 'ffffff' }, // <, >, / in tags
    //         { token: 'attribute.name', foreground: '9cdcfe' }, // JSX attribute
    //         { token: 'attribute.value', foreground: 'ce9178' }, // JSX attribute value
    //         { token: 'string.key.js', foreground: '9cdcfe' }, // JSX attribute (sometimes)
    //         { token: 'type.identifier', foreground: '4ec9b0' }, // Custom JSX tags (best match)
    //         { token: 'identifier', foreground: '569cd6' }, // fallback for custom tags
    //         { token: 'invalid', foreground: 'f44747' },

    //         // More granular tokens
    //         { token: 'variable.readonly', foreground: 'b5cea8', fontStyle: 'italic' },
    //         { token: 'variable.predefined', foreground: 'dcdcaa' },
    //         { token: 'variable.language', foreground: '569cd6' },
    //         { token: 'variable.parameter', foreground: '9cdcfe', fontStyle: 'italic' },
    //         { token: 'constant', foreground: 'b5cea8' },
    //         { token: 'constant.numeric', foreground: 'b5cea8' },
    //         { token: 'constant.language', foreground: '569cd6' },
    //         { token: 'constant.character', foreground: 'ce9178' },
    //         { token: 'constant.other', foreground: 'b5cea8' },
    //         { token: 'entity.name.function', foreground: 'dcdcaa' },
    //         { token: 'entity.name.type', foreground: '4ec9b0' },
    //         { token: 'entity.name.class', foreground: '4ec9b0', fontStyle: 'bold' },
    //         { token: 'entity.name.tag', foreground: '569cd6' },
    //         { token: 'entity.other.attribute-name', foreground: '9cdcfe' },
    //         { token: 'punctuation.definition.tag', foreground: '808080' },
    //         { token: 'punctuation.separator', foreground: 'd4d4d4' },
    //         { token: 'punctuation.terminator', foreground: 'd4d4d4' },
    //         { token: 'storage', foreground: '569cd6' },
    //         { token: 'storage.type', foreground: '569cd6' },
    //         { token: 'support.function', foreground: 'dcdcaa' },
    //         { token: 'support.constant', foreground: 'b5cea8' },
    //         { token: 'support.type', foreground: '4ec9b0' },
    //         { token: 'support.class', foreground: '4ec9b0' },
    //         { token: 'support.variable', foreground: '9cdcfe' },
    //         { token: 'markup.bold', fontStyle: 'bold', foreground: 'd7ba7d' },
    //         { token: 'markup.italic', fontStyle: 'italic', foreground: 'd7ba7d' },
    //         { token: 'markup.underline', fontStyle: 'underline', foreground: 'd7ba7d' },
    //         { token: 'markup.heading', foreground: '569cd6', fontStyle: 'bold' },
    //         { token: 'markup.quote', foreground: '6a9955', fontStyle: 'italic' },
    //         { token: 'markup.list', foreground: 'b5cea8' },
    //         { token: 'markup.inserted', foreground: 'b5cea8' },
    //         { token: 'markup.deleted', foreground: 'f44747' },
    //         { token: 'markup.changed', foreground: '569cd6' },
    //         { token: 'markup.inline.raw', foreground: 'ce9178' },
    //         { token: 'meta.embedded', foreground: 'd4d4d4' },
    //         { token: 'meta.tag', foreground: '569cd6' },
    //         { token: 'meta.jsx.children', foreground: 'd4d4d4' },
    //         { token: 'meta.brace', foreground: 'd4d4d4' },
    //         { token: 'meta.delimiter.period', foreground: 'd4d4d4' },
    //         { token: 'meta.selector', foreground: 'd7ba7d' },
    //         { token: 'meta.object-literal.key', foreground: '9cdcfe' },
    //     ],
    //     colors: {
    //         'editor.background': '#1e1e1e',
    //         'editor.foreground': '#d4d4d4',
    //         'editor.lineHighlightBackground': '#2a2d2e',
    //         'editorCursor.foreground': '#aeafad',
    //         'editor.selectionBackground': '#264f78',
    //         'editor.inactiveSelectionBackground': '#3a3d41',
    //         'editorIndentGuide.background': '#404040',
    //         'editorIndentGuide.activeBackground': '#707070',
    //     },
    // });

    // Optional: Add custom TS typings (e.g., React types)
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    //     `
    //         declare module "react" {
    //             export = React;
    //             namespace React {
    //             interface FC<P = {}> {
    //                 (props: P): JSX.Element;
    //             }
    //             const createElement: any;
    //             }
    //         }

    //         declare namespace JSX {
    //             interface IntrinsicElements {
    //             div: any;
    //             span: any;
    //             h1: any;
    //             [elemName: string]: any;
    //             }
    //         }
    //         `,
    //     'file:///node_modules/@types/react/index.d.ts',
    // );

    // Add React types
    fetch('https://unpkg.com/@types/react/index.d.ts')
        .then((res) => res.text())
        .then((data) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                data,
                'file:///node_modules/@types/react/index.d.ts',
            );
        });

    // Add ReactDOM client types for 'react-dom/client'
    fetch('https://unpkg.com/@types/react-dom/client.d.ts')
        .then((res) => res.text())
        .then((data) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                data,
                'file:///node_modules/@types/react-dom/client.d.ts',
            );
        });

    // Add ReactDOM types
    fetch('https://unpkg.com/@types/react-dom/index.d.ts')
        .then((res) => res.text())
        .then((data) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                data,
                'file:///node_modules/@types/react-dom/index.d.ts',
            );
        });
};

const handleEditorDidMount = (monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    const { files } = FileStoreState();
    const models: { [path: string]: editor.ITextModel } = {};
    // Object.entries(files).forEach(([path, content]) => {
    //     const uri = monaco.Uri.parse(`file://${path}`);
    //     if (!monaco.editor.getModel(uri)) {
    //         monaco.editor.createModel(content, 'typescript', uri);
    //     }
    // });

    Object.entries(files).forEach(([path, content]) => {
        const uri = monaco.Uri.parse(`file://${path}`);
        models[path] =
            monaco.editor.getModel(uri) || monaco.editor.createModel(content, 'typescript', uri);
    });

    monaco.languages.registerDefinitionProvider('typescript', {
        provideDefinition(model, position) {
            const value = model.getValue();
            const lines = value.split('\n');
            const line = lines[position.lineNumber - 1];

            // Simple regex to match import statements
            // e.g. import { foo } from './foo';
            const importRegex = /import\s+.*?from\s+['"](.*)['"]/;
            const match = line.match(importRegex);
            if (match) {
                const importPath = match[1];
                // Resolve the import path to a file in your virtual FS
                let resolvedPath = importPath;
                if (importPath.startsWith('.')) {
                    // Resolve relative to current file
                    const currentPath = model.uri.path;
                    resolvedPath = new URL(importPath, `file://${currentPath}`).pathname;
                }
                if (files[resolvedPath]) {
                    // Return the location of the imported file (first line, first column)
                    // FileStoreState().setCurrentFile(resolvedPath);
                    return [
                        {
                            uri: monaco.Uri.parse(`file://${resolvedPath}`),
                            range: new monaco.Range(1, 1, 1, 1),
                        },
                    ];
                }
            }
            return null;
        },
    });

    monacoEditor.onMouseDown((e) => {
        if (
            (e.event.ctrlKey || e.event.metaKey) &&
            e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT
        ) {
            const { position } = e.target;
            const model = monacoEditor.getModel();
            if (!model) return;
            // Use the built-in TypeScript/JS provider
            monaco.languages.typescript.getTypeScriptWorker().then((worker) => {
                worker(model.uri).then((client) => {
                    client
                        .getDefinitionAtPosition(model.uri.toString(), model.getOffsetAt(position))
                        .then((defs: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            if (defs && defs.length > 0) {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                                const def = defs[0];
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                                const uri = monaco.Uri.parse(def.fileName);
                                // const targetModel = monaco.editor.getModel(uri);
                                const targetModel = models[uri.path];
                                if (targetModel) {
                                    FileStoreState().setCurrentFile(uri.path);
                                    // monacoEditor.setModel(targetModel);
                                    // monacoEditor.setPosition({
                                    //     lineNumber: def.textSpan.startLine,
                                    //     column: def.textSpan.startColumn,
                                    // });
                                    // monacoEditor.focus();
                                }
                            }
                        });
                });
            });
        }
    });

    // const editors = monaco.editor.getEditors();

    // const monacoJSXHighlighter = new MonacoJSXHighlighter(
    //     monaco,
    //     babelParse,
    //     traverse.default,
    //     monacoEditor,
    // );

    // // Enable highlighting and tag matching
    // monacoJSXHighlighter.highlightOnDidChangeModelContent();
    // monacoJSXHighlighter.addJSXCommentCommand();

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(getWorker(), monaco);

    const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: monacoEditor,
    });

    monacoEditor.onDidChangeModelContent(() => {
        // content change, highlight
        highlighter();
    });

    // init highlight
    highlighter();

    return dispose;

    // setTimeout(() => {
    //     monaco.editor.setTheme('vscode-dark-plus');
    // }, 1000);
    // Optional: Tag matching highlight
    // monacoJSXHighlighter.highlightJSXTags();
};

export { handleEditorDidMount, handleEditorWillMount };
