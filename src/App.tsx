import './App.scss';
import BuildButton from './components/BuildButtton/BuildButton';
import CodeEditor from './components/CodeEditor/CodeEditor';
import CodeTerminal from './components/CodeTerminal/CodeTerminal';
import FileExplorer from './components/FileExplorer/FileExplorer';

function App() {
    return (
        <div className="app-container">
            <div className="app-header">
                <h2>Code Editor</h2>
                <BuildButton />
            </div>
            <div className="app-body">
                <div className="app-sidebar">
                    <FileExplorer />
                </div>
                <div className="app-content">
                    <CodeEditor />
                    <div className="app-terminal">
                        <CodeTerminal />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
