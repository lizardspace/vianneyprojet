import React from 'react';

const LiveVideo = () => {
  const videoUrl = "https://www.youtube.com/embed/Z-Nwo-ypKtM?autoplay=1&mute=1";

  return (
    <div className="live-video-container">
      <iframe
        width="560"
        height="315"
        src={videoUrl}
        title="Live Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LiveVideo;