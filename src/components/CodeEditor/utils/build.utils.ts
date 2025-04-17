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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setOutputBundle(`document.write('${error.message}');`);
        return '';
    } finally {
        console.log('Build completed');
    }
};

export { buildApp };
