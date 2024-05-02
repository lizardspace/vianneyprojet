import React from 'react';

const PorteDeVaiseLive = () => {
  return (
    <div className="live-video-container">
      <h2>Porte de Vaise en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/z4vQEMiD3VI?si=E37_zBskQiX-epKu&autoplay=1&mute=1"
        title="Porte de Vaise"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PorteDeVaiseLive;