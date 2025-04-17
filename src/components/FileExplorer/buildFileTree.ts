type FileNode = {
    name: string;
    path: string;
    isDir: boolean;
    children?: FileNode[];
};

function buildFileTree(files: Record<string, string>, folders: Set<string>): FileNode[] {
    type FileNodeMap = {
        [name: string]: { name: string; path: string; isDir: boolean; children?: FileNodeMap };
    };
    const root: FileNodeMap = {};

    // Add folders first
    Array.from(folders).forEach((folderPath) => {
        const parts = folderPath.split('/').filter(Boolean);
        let current: FileNodeMap = root;
        let currentPath = '';
        parts.forEach((part, idx) => {
            currentPath += `/${part}`;
            if (!current[part]) {
                current[part] = {
                    name: part,
                    path: currentPath,
                    isDir: true,
                    children: {},
                };
            }
            if (idx < parts.length - 1) {
                current = current[part].children as FileNodeMap;
            }
        });
    });

    // Add files
    Object.keys(files).forEach((filePath) => {
        const parts = filePath.split('/').filter(Boolean);
        let current: FileNodeMap = root;
        let currentPath = '';
        parts.forEach((part, idx) => {
            currentPath += `/${part}`;
            if (idx === parts.length - 1) {
                // File
                current[part] = {
                    name: part,
                    path: currentPath,
                    isDir: false,
                };
            } else {
                // Folder
                if (!current[part]) {
                    current[part] = {
                        name: part,
                        path: currentPath,
                        isDir: true,
                        children: {},
                    };
                }
                current = current[part].children as FileNodeMap;
            }
        });
    });

    function toArray(obj: FileNodeMap): FileNode[] {
        return Object.values(obj).map((node) => {
            const { children, ...rest } = node;
            return {
                ...rest,
                children:
                    children && Object.keys(children).length > 0 ? toArray(children) : undefined,
            };
        });
    }

    return toArray(root);
}

export { buildFileTree };

export type { FileNode };
