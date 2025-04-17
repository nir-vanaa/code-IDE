import { FileStoreState } from '../../../stores/fileStore';
import { buildFile } from './esbuild';

const buildApp = async () => {
    const { files, setOutputBundle } = FileStoreState();
    try {
        const result = await buildFile(files);
        setOutputBundle(result);
        return result;
    } catch (error) {
        console.error('Error building app:', { error });
        setOutputBundle(`document.write('${error.message}');`);
        return '';
    } finally {
        console.log('Build completed');
    }
};

export { buildApp };
