import React from 'react';
import  NFT from './../../../../components/card/NFT'; 

const Camera = ({ camera }) => {
  return (
    <NFT
      key={camera.id}
      image_url={camera.image_url}
      name={camera.name}
      location={camera.location}
      last_active={camera.last_active}
      latitude={camera.latitude}
      longitude={camera.longitude}
    />
  );
};

export default Camera;
