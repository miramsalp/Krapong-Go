import React from 'react';
import './PassengerMenu.css';

function PassengerMenu({ hasActivePing, onPing, onCancelPing }) {
    return (
        <div className="passenger-menu-container"> 
            <h3>Passenger Menu</h3>
            {hasActivePing ? (
                <button onClick={onCancelPing} className="action-button cancel">ยกเลิกการเรียกรถ</button>
            ) : (
                <button onClick={onPing} className="action-button primary">ปักหมุดเรียกรถ</button>
            )}
        </div>
    );
}

export default PassengerMenu;