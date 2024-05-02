import React from 'react';

const EuronewsLive = () => {
  return (
    <div className="live-video-container">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/l8PMl7tUDIE?autoplay=1&mute=1"
        title="Euronews Live"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default EuronewsLive;