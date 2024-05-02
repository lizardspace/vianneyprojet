import React from 'react';

const MyChannelLive = () => {
  return (
    <div className="live-video-container">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/e_gwbGH4rXA?autoplay=1&mute=1"
        title="My Channel Live"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default MyChannelLive;