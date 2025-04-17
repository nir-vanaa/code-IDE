/// <reference types="vite/client" />

declare module 'monaco-jsx-highlighter' {
    export default class MonacoJSXHighlighter {
        constructor(monaco: any, parse: any, traverse: any, options?: any);

        highlightOnDidChangeModelContent(delay?: number): void;

        highlightOnDidChangeModelContentStop(): void;

        addJSXCommentCommand(): void;

        dispose(): void;
    }
}
