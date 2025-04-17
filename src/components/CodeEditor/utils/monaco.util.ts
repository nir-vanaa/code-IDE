// import * as babel from '@babel/standalone';
import { Monaco } from '@monaco-editor/react';
// import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import { customTheme } from '../customTheme';

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
    // Define your custom theme here
    monaco.editor.defineTheme('vscode-dark-plus', customTheme);
    // Enable JSX/TSX support
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.React,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: true,
        esModuleInterop: true,
        allowJs: true,
        typeRoots: ['node_modules/@types'],
        allowSyntheticDefaultImports: true,
    });

    // Optional: Add custom TS typings (e.g., React types)
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `
            declare module "react" {
                export = React;
                namespace React {
                interface FC<P = {}> {
                    (props: P): JSX.Element;
                }
                const createElement: any;
                }
            }
            
            declare namespace JSX {
                interface IntrinsicElements {
                div: any;
                span: any;
                h1: any;
                [elemName: string]: any;
                }
            }
            `,
        'file:///node_modules/@types/react/index.d.ts',
    );
};

// const handleEditorDidMount = (monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
//     // initMonacoEditor(monacoEditor, monaco);
// };

export { handleEditorWillMount };
