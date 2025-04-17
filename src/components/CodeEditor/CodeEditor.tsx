import Editor from '@monaco-editor/react';
import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useFileStore } from '../../stores/fileStore';
import './CodeEditor.css';
import { buildApp } from './utils/build.utils';
import { handleEditorWillMount } from './utils/monaco.util';

const EXT_TO_LANGUAGE: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    css: 'css',
    html: 'html',
    json: 'json',
    txt: 'plaintext',
};

function CodeEditor() {
    const [currentFile, files, setFile, loadFS, saveFS] = useFileStore(
        useShallow((s) => [s.currentFile, s.files, s.setFile, s.loadFS, s.saveFS]),
    );

    const currentFileExt = currentFile.split('.').pop();
    const language = currentFileExt ? EXT_TO_LANGUAGE[currentFileExt] : 'plaintext';

    const build = useCallback(() => {
        debounce(buildApp, 1000)();
    }, []);

    useEffect(() => {
        loadFS();
    }, [build, loadFS]);

    const handleEditorChange = useCallback(
        (value: string | undefined) => {
            if (value) {
                setFile(currentFile, value);
                saveFS();
                build();
            }
        },
        [setFile, currentFile, saveFS, build],
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                console.log('Saving...');
                saveFS();
                buildApp();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [saveFS]);

    return (
        <div className="code-editor-container">
            <Editor
                // height="100vh"
                defaultLanguage={language}
                language={language}
                defaultValue={files[currentFile]}
                value={files[currentFile]}
                theme="vs-dark"
                onChange={handleEditorChange}
                beforeMount={handleEditorWillMount}
                // onMount={handleEditorDidMount}
                options={{
                    fontFamily: 'Cascadia Code, sans-serif',
                    fontSize: 12,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}

export default CodeEditor;
