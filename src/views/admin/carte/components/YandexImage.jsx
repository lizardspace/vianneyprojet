import React from 'react';

const YandexImage = () => {
    return (
        <div style={{ width: '100%', height: '100vh', border: 'none' }}>
            <iframe
                src="https://www.searchencrypt.com/home"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="External Application"
            />
        </div>
    );
};

export default YandexImage;
