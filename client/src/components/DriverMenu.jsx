import React from 'react';

function DriverMenu({ isOnline, onGoOnline, onGoOffline }) {
    return (
        <div>
            <h3>Driver Menu</h3>
            {!isOnline ? (
                <button onClick={onGoOnline}>Go Online</button>
            ) : (
                <button onClick={onGoOffline} style={{ background: 'red' }}>Go Offline</button>
            )}
        </div>
    );
}

export default DriverMenu;