import React, { useState } from 'react';
import './DriverMenu.css';

function DriverMenu({ myVehicle, isOnline, onGoOnline, onGoOffline, handleRegisterVehicle, selectedRouteId }) {
    const [licensePlate, setLicensePlate] = useState('');

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        if (!licensePlate || !selectedRouteId) {
            alert('กรุณากรอกทะเบียนรถและเลือกสายรถ');
            return;
        }
        handleRegisterVehicle(licensePlate, selectedRouteId).catch(() => {});
    };

    return (
        <div className="driver-menu-container"> 
            <h3>Driver Menu</h3>
            {myVehicle ? (
                <div className="status-container">
                    <p>ทะเบียนรถ: {myVehicle.licensePlate}</p>
                    {!isOnline ? (
                        <button onClick={onGoOnline} className="action-button primary">Go Online</button>
                    ) : (
                        <button onClick={onGoOffline} className="action-button offline">Go Offline</button>
                    )}
                </div>
            ) : (
                <form onSubmit={onRegisterSubmit} className="register-form">
                    <p>คุณยังไม่ได้ลงทะเบียนรถ</p>
                    <input 
                        type="text" 
                        value={licensePlate} 
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="ทะเบียนรถ (เช่น กก-1234)"
                        required
                    />
                    <button type="submit" className="action-button primary">ลงทะเบียนรถ</button>
                </form>
            )}
        </div>
    );
}

export default DriverMenu;