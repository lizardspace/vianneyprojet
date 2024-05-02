import React from 'react';

const IenaVueTourEiffelLive = () => {
  return (
    <div className="live-video-container">
      <h2>Iéna - Vue Tour Eiffel en direct</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/bQwalAKrfWE?si=cjIoLYhaiiHcl39D&autoplay=1&mute=1"
        title="Iéna - Vue Tour Eiffel"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default IenaVueTourEiffelLive;