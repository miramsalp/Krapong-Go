import React from 'react';

function PassengerMenu({ hasActivePing, onPing, onCancelPing }) {
    return (
        <div>
            <h3>Passenger Menu</h3>
            {hasActivePing ? (
                <button onClick={onCancelPing} style={{ background: 'orange' }}>ยกเลิกการเรียกรถ</button>
            ) : (
                <button onClick={onPing}>ปักหมุดเรียกรถ</button>
            )}
        </div>
    );
}

export default PassengerMenu;