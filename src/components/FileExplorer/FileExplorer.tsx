import classNames from 'classnames';
import { useState } from 'react';
import { SiTypescript, SiJavascript, SiCss3, SiHtml5 } from 'react-icons/si';
import { LiaReact } from 'react-icons/lia';
import { VscJson, VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { LuFileText, LuFile } from 'react-icons/lu';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useShallow } from 'zustand/shallow';
import { FileStoreState, useFileStore } from '../../stores/fileStore';
import { buildFileTree, FileNode } from './buildFileTree';
import './FileExplorer.scss';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '../ui/context-menu';

const getFileIcon = (fileName: string, isDir: boolean, isOpen?: boolean) => {
    if (isDir) return isOpen ? <FcOpenedFolder size={18} /> : <FcFolder size={18} />;
    // Add more icons based on file extension if needed
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'ts') return <SiTypescript className="text-[#0088d1]" size={14} />;
    if (ext === 'tsx') return <LiaReact className="text-[#0088d1]" size={14} />;
    if (ext === 'jsx') return <LiaReact className="text-[#00bcd5]" size={14} />;
    if (ext === 'js') return <SiJavascript className="text-[#ffca27]" size={14} />;
    if (ext === 'css') return <SiCss3 className="text-[#42a5f6]" size={14} />;
    if (ext === 'html') return <SiHtml5 className="text-[#e65000]" size={14} />;
    if (ext === 'txt') return <LuFileText className="text-white" size={14} />;
    if (ext === 'json') return <VscJson className="text-[#ffd64f]" size={14} />;
    return <LuFile className="file-icon" size={16} />;
};
type FileOptionMenuProps = {
    children: React.ReactNode;
    options: string[];
    onOptionClick: (option: string) => void;
};
function FileOptionMenu({ children, options, onOptionClick }: FileOptionMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                {options.map((option) => (
                    <ContextMenuItem
                        className="text-xs cursor-pointer"
                        key={option}
                        onClick={() => onOptionClick(option)}
                    >
                        {option}
                    </ContextMenuItem>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    );
}

function FileTreeNode({
    node,
    onSelect,
    selectedPath,
}: {
    node: FileNode;
    onSelect: (path: string) => void;
    selectedPath: string;
}) {
    const [open, setOpen] = useState(true);
    const [rename, setRename] = useState(false);
    const [newName, setNewName] = useState(node.name);

    const handleRename = () => {
        setRename(true);
    };
    const handleRenameBlur = () => {
        if (rename) {
            FileStoreState().renameFile(node.path, `/${newName}`);
            FileStoreState().saveFS();
            setRename(false);
        }
    };

    const handleDelete = () => {
        FileStoreState().removeFile(node.path);
        FileStoreState().saveFS();
    };

    const handleOptionClick = (option: string) => {
        if (option === 'Rename') {
            handleRename();
        }
        if (option === 'Delete') {
            handleDelete();
        }
    };

    if (node.isDir) {
        return (
            <div className="file-tree-node folder">
                <div className="folder-name-container" onClick={() => setOpen((o) => !o)}>
                    <span className={classNames('expand-icon', { open })}>
                        <MdOutlineKeyboardArrowRight size={16} />
                    </span>
                    <span className="folder-name">
                        {getFileIcon(node.name, node.isDir, open)} {node.name}
                    </span>
                </div>
                {open &&
                    node.children?.map((child) => (
                        <FileTreeNode
                            key={child.path}
                            node={child}
                            onSelect={onSelect}
                            selectedPath={selectedPath}
                        />
                    ))}
            </div>
        );
    }
    return (
        <FileOptionMenu options={['Rename', 'Delete']} onOptionClick={handleOptionClick}>
            <div
                className={classNames('file-tree-node', 'file', {
                    selected: node.path === selectedPath,
                })}
                onClick={() => onSelect(node.path)}
            >
                {rename ? (
                    <input
                        ref={(rf) => {
                            rf?.focus();
                        }}
                        value={newName}
                        onBlur={handleRenameBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleRenameBlur();
                            }
                        }}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                ) : (
                    <>
                        {getFileIcon(node.name, node.isDir)} {node.name}
                    </>
                )}
            </div>
        </FileOptionMenu>
    );
}

function FileExplorer() {
    const [files, folders] = useFileStore(useShallow((s) => [s.files, s.folders]));
    const [currentFile, setCurrentFile] = useFileStore(
        useShallow((s) => [s.currentFile, s.setCurrentFile]),
    );
    const tree = buildFileTree(files, folders);

    const createNewFile = () => {
        FileStoreState().setFile('/newFile.ts', ' ');
        FileStoreState().saveFS();
    };

    const createNewFolder = () => {
        FileStoreState().addFolder('/untitled');
        FileStoreState().saveFS();
    };

    return (
        <div className="file-explorer">
            <div className="heading flex items-center justify-between">
                File Explorer
                <div className="flex gap-2">
                    <span
                        className="cursor-pointer hover:bg-gray-700 p-1 rounded"
                        onClick={createNewFile}
                    >
                        <VscNewFile />
                    </span>
                    <span
                        className="cursor-pointer hover:bg-gray-700 p-1 rounded"
                        onClick={createNewFolder}
                    >
                        <VscNewFolder />
                    </span>
                </div>
            </div>
            <div className="divider" />
            <div className="explorer-tree">
                {tree.map((node) => (
                    <FileTreeNode
                        key={node.path}
                        node={node}
                        onSelect={setCurrentFile}
                        selectedPath={currentFile}
                    />
                ))}
            </div>
        </div>
    );
}

export default FileExplorer;
