import React from 'react';

const TunnelDeFourviereLive = () => {
  return (
    <div className="live-video-container">
      <h2>Tunnel de Fourvière en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/f9ALdmDLPGU?si=nXtn4DYqQUwMbsgL&autoplay=1&mute=1"
        title="Tunnel de Fourviere"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TunnelDeFourviereLive;