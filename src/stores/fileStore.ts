import localforage from 'localforage';
import { create } from 'zustand';
import { initialFileData } from '../data/init-file-data';

type FileSystem = {
    files: Record<string, string>; // file path -> content
    folders: Set<string>; // folder paths (e.g., "/src", "/src/utils")
};

interface FileStore {
    initializedEsBuild: boolean;
    setInitializedEsBuild: (initialised: boolean) => void;
    currentFile: string;
    setCurrentFile: (path: string) => void;
    outputBundle: string;
    setOutputBundle: (bundle: string) => void;
    files: Record<string, string>;
    folders: Set<string>;
    setFile: (path: string, content: string) => void;
    addFolder: (path: string) => void;
    removeFile: (path: string) => void;
    renameFile: (oldPath: string, newPath: string) => void;
    removeFolder: (path: string) => void;
    loadFS: () => Promise<void>;
    saveFS: () => Promise<void>;
}

const useFileStore = create<FileStore>((set, get) => ({
    initializedEsBuild: false,
    setInitializedEsBuild: (initialized) => {
        set({ initializedEsBuild: initialized });
    },
    currentFile: '/src/App.tsx',
    setCurrentFile: (path) => {
        set({ currentFile: path });
    },
    outputBundle: '',
    setOutputBundle: (bundle) => {
        set({ outputBundle: bundle });
    },
    files: initialFileData.files,
    folders: initialFileData.folders,
    setFile: (path, content) => {
        set((state) => ({
            files: { ...state.files, [path]: content },
        }));
    },
    addFolder: (path) => {
        set((state) => {
            const folders = new Set(state.folders);
            folders.add(path);
            return { folders };
        });
    },
    renameFile: (oldPath, newPath) => {
        set((state) => {
            const files = { ...state.files };
            if (oldPath in files) {
                files[newPath] = files[oldPath];
                delete files[oldPath];
            }
            // const folders = new Set(state.folders);
            // if (folders.has(oldPath)) {
            //     folders.delete(oldPath);
            //     folders.add(newPath);
            // }
            return { files };
        });
    },
    removeFile: (path) => {
        set((state) => {
            const files = { ...state.files };
            delete files[path];
            return { files };
        });
    },
    removeFolder: (path) => {
        set((state) => {
            const folders = new Set(state.folders);
            folders.delete(path);
            // Optionally, remove all files in this folder
            const files = Object.fromEntries(
                Object.entries(state.files).filter(
                    ([filePath]) => !filePath.startsWith(`${path}/`),
                ),
            );
            return { folders, files };
        });
    },
    loadFS: async () => {
        const saved = await localforage.getItem<FileSystem>('my-fs');
        if (saved) {
            set({
                files: saved.files,
                folders: new Set(saved.folders),
            });
        }
    },
    saveFS: async () => {
        const { files, folders } = get();
        await localforage.setItem('my-fs', {
            files,
            folders: Array.from(folders),
        });
    },
}));

const FileStoreState = useFileStore.getState;

export { FileStoreState, useFileStore };
