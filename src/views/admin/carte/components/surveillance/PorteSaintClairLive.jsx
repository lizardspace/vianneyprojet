import React from 'react';

const PorteSaintClairLive = () => {
  return (
    <div className="live-video-container">
      <h2>Porte Saint-Clair en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/EBhCrTPpdBI?si=0P_t-lYedM6srzDY&autoplay=1&mute=1"
        title="Porte Saint-Clair"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PorteSaintClairLive;