import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useCallback, useEffect, useRef } from 'react';
import { FileStoreState } from '../../stores/fileStore';
import { buildFile } from '../CodeEditor/utils/esbuild';

function XTermTerminal() {
    const termRef = useRef<HTMLDivElement>(null);
    const xterm = useRef<Terminal>(null);

    // Command state
    const commandBuffer = useRef<string>('');

    function prompt() {
        xterm.current?.write('\r\n$ ');
        commandBuffer.current = '';
    }

    const handleCommand = useCallback(async (cmd: string) => {
        const term = xterm.current;
        if (!term) return;
        if (!cmd) return;
        const { files } = FileStoreState();
        if (cmd === 'help') {
            term.writeln('Available commands:');
            term.writeln('help - Show this help');
            term.writeln('ls - List files');
            // term.writeln('cat <file> - Show file content');
            term.writeln('build - Bundle project');
            term.writeln('run - Run the project');
            term.writeln('clear - Clear terminal');
            return;
        }
        if (cmd === 'ls') {
            Object.keys(files).forEach((f) => term.writeln(f));
            return;
        }
        if (cmd === 'run') {
            const { outputBundle } = FileStoreState();
            term.writeln('Running...');
            // eslint-disable-next-line no-eval
            eval(outputBundle);
            term.writeln('Execution complete!');
            return;
        }
        if (cmd === 'build') {
            term.writeln('Building...');
            try {
                const result = await buildFile(files);
                FileStoreState().setOutputBundle(result);
                term.writeln('Build successful!');
                // result.output.forEach((line: string) => term.writeln(line));
            } catch (e: any) {
                term.writeln('Build failed:');
                // term.writeln(e.message);
                term.writeln('Please check your configuration and try again.');
            }
            return;
        }
        if (cmd === 'clear') {
            term.clear();
            return;
        }
        term.writeln(`Unknown command: ${cmd}`);
    }, []);

    const handleInput = useCallback(
        async (data: string) => {
            const term = xterm.current;
            if (!term) return;
            // eslint-disable-next-line no-restricted-syntax
            for (const char of data) {
                if (char === '\r') {
                    // Enter
                    term.write('\r\n');
                    // eslint-disable-next-line no-await-in-loop
                    await handleCommand(commandBuffer.current.trim());
                    prompt();
                } else if (char === '\u007F') {
                    // Backspace
                    if (commandBuffer.current.length > 0) {
                        commandBuffer.current = commandBuffer.current.slice(0, -1);
                        term.write('\b \b');
                    }
                } else if (char >= ' ' && char <= '~') {
                    // Printable
                    commandBuffer.current += char;
                    term.write(char);
                }
            }
        },
        [handleCommand],
    );

    useEffect(() => {
        if (!termRef.current) return;
        if (xterm.current) return;

        xterm.current = new Terminal({
            theme: { background: '#1e1e1e', foreground: '#fff' },
            fontFamily: 'monospace',
            fontSize: 12,
            cursorBlink: true,
            // rows: 12,
        });
        xterm.current.open(termRef.current);
        xterm.current.writeln('Type "help" for commands.');
        prompt();

        xterm.current.onData(handleInput);
    }, [handleInput]);

    useEffect(() => {
        return () => {
            if (xterm.current) {
                xterm.current.dispose();
                xterm.current = null;
            }
        };
    }, []);

    return <div ref={termRef} className="w-full h-full overflow-y-auto p-2" />;
}

export default XTermTerminal;
