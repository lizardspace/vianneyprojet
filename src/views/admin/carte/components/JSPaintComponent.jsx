import React, { useRef, useEffect } from 'react';

function JSPaintComponent() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Utilisation d'un chemin absolu par rapport à la base de l'URL du serveur
    const iframePath = '/jspaint/index.html'; // Cette URL pointe vers le dossier public

    if (iframeRef.current) {
      iframeRef.current.src = iframePath;
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '700px', border: 'none' }}>
      <iframe ref={iframeRef} title="JSPaint" width="100%" height="100%" style={{ border: 'none' }} />
    </div>
  );
}

export default JSPaintComponent;
