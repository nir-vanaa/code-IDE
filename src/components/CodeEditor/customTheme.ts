import { editor } from 'monaco-editor';

const customTheme: editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: '', foreground: 'd4d4d4', background: '1e1e1e' },
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569cd6' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'variable', foreground: '9cdcfe' },
        { token: 'function', foreground: 'dcdcaa' },
        { token: 'type', foreground: '4ec9b0' },
    ],
    colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editorCursor.foreground': '#aeafad',
        'editor.lineHighlightBackground': '#264f78',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
    },
};

export { customTheme };
