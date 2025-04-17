/* eslint-disable no-eval */
import { useEffect, useState } from 'react';
import { VscRunAll } from 'react-icons/vsc';
import { useShallow } from 'zustand/shallow';
import { useFileStore } from '../../stores/fileStore';

import { buildApp } from '../CodeEditor/utils/build.utils';
import { initEsBuild } from '../CodeEditor/utils/esbuild';
import { Button } from '../ui/button';

function BuildButton() {
    const [building, setBuilding] = useState(false);

    const [initializedEsBuild] = useFileStore(useShallow((s) => [s.initializedEsBuild]));
    const handleBuild = async () => {
        setBuilding(true);
        try {
            await buildApp();
        } finally {
            setBuilding(false);
        }
    };

    const handleRun = async () => {
        await handleBuild();
        // eval(res);
    };

    useEffect(() => {
        initEsBuild();
    }, []);

    const disableBuildButton = !initializedEsBuild || building;

    return (
        <div className="flex gap-5">
            {/* <Button variant="secondary" size="icon" onClick={handleBuild} disabled={building}>
                <IoMdBuild className="" size={12} />
            </Button> */}
            <Button
                className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
                variant="secondary"
                size="icon"
                onClick={handleRun}
                disabled={disableBuildButton}
            >
                <VscRunAll className="" />
                {/* Run */}
            </Button>
        </div>
    );
}

export default BuildButton;
