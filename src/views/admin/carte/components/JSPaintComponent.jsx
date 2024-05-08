import React, { useRef, useEffect } from 'react';

function JSPaintComponent() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Utilisez une URL absolue pour le développement local ou la production
    const iframePath = 'https://super-duper-doodle-r44wqp6rp6jjhxv6x-3000.app.github.dev/index.html'; // Ajustez selon votre configuration

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