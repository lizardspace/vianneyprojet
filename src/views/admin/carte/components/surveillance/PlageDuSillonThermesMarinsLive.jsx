import React from 'react';

const PlageDuSillonThermesMarinsLive = () => {
  return (
    <div className="live-video-container">
      <h2>Plage du Sillon - Thermes Marins en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/0l2LxTnQGZc?si=0ndu7BSLjie6fe1P&autoplay=1&mute=1"
        title="Plage du Sillon - Thermes Marins"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PlageDuSillonThermesMarinsLive;