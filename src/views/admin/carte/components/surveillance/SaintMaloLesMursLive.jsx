import React from 'react';

const SaintMaloLesMursLive = () => {
  return (
    <div className="live-video-container">
      <h2>Saint Malo - Les Murs en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/J3xg6-S2bFU?si=Eae4clP29YKcae1r&autoplay=1&mute=1"
        title="Saint Malo - Les Murs"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default SaintMaloLesMursLive;