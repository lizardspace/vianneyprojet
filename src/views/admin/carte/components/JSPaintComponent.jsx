import React, { useRef, useEffect } from 'react';

function JSPaintComponent() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Assurez-vous que le chemin d'accès est correct et accessible
    const iframePath = './../../../../src/jspaint/index.html'; // Modifiez selon votre configuration

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