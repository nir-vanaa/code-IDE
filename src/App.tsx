import SplitPane from 'react-split-pane';
import './App.scss';
import BuildButton from './components/BuildButtton/BuildButton';
import CodeEditor from './components/CodeEditor/CodeEditor';
import CodeTerminal from './components/CodeTerminal/CodeTerminal';
import FileExplorer from './components/FileExplorer/FileExplorer';
import PreviewWindow from './components/PreviewWindow/PreviewWindow';
import './Resizer.scss';

function App() {
    return (
        <div className="app-container">
            <div className="app-header">
                <h2>Code Editor</h2>
                <BuildButton />
            </div>
            <div className="app-body">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                <SplitPane split="vertical" minSize="250px" maxSize="50%">
                    <FileExplorer />
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-expect-error */}
                    <SplitPane split="horizontal" minSize="70%">
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-expect-error */}
                        <SplitPane split="vertical" size="60%" minSize="10%" maxSize="100%">
                            <CodeEditor />
                            <PreviewWindow />
                        </SplitPane>
                        <CodeTerminal />
                    </SplitPane>
                </SplitPane>
            </div>

            {/* <div className="app-body">
                <div className="app-sidebar">
                    <FileExplorer />
                </div>
                <div className="app-content">
                    <div className="flex h-[80%]">
                        <CodeEditor />
                        <PreviewWindow />
                    </div>
                    <div className="app-terminal">
                        <CodeTerminal />
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default App;
