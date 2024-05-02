import React from 'react';

const PorteDuValvertLive = () => {
  return (
    <div className="live-video-container">
      <h2>Porte du Valvert en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/WdgZIE0T4Gs?si=HdtZGzitb9JBwvGk&autoplay=1&mute=1"
        title="Porte du Valvert"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PorteDuValvertLive;