import React from 'react';

const JSPaintComponent = () => {
    return (
        <div style={{ width: '100%', height: '100vh', border: 'none' }}>
            <iframe
                src="https://jspaint.app/"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="External Application"
            />
        </div>
    );
};

export default JSPaintComponent;
