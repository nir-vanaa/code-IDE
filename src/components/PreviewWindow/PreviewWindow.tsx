import React, { useEffect } from 'react';
import { useFileStore } from '../../stores/fileStore';

function PreviewWindow() {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const outputBundle = useFileStore((state) => state.outputBundle);

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.srcdoc = `
              <div id="root"></div>
              <script>
              try {
                ${outputBundle}
              } catch (e) {
                document.body.innerHTML = '<pre>' + e + '</pre>';
              }
              </script>
            `;
        }
    }, [outputBundle]);
    return (
        <div className="preview-window h-full m-2">
            <iframe ref={iframeRef} title="Preview" className="w-full h-full" />
        </div>
    );
}

export default PreviewWindow;
