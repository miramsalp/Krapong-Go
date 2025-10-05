import React, { useState } from 'react';

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
        <div>
            <h3>Driver Menu</h3>
            {myVehicle ? (
                <div>
                    <p>ทะเบียนรถ: {myVehicle.licensePlate}</p>
                    {!isOnline ? (
                        <button onClick={onGoOnline}>Go Online</button>
                    ) : (
                        <button onClick={onGoOffline} style={{ background: 'red' }}>Go Offline</button>
                    )}
                </div>
            ) : (
                <form onSubmit={onRegisterSubmit}>
                    <p>คุณยังไม่ได้ลงทะเบียนรถ</p>
                    <input 
                        type="text" 
                        value={licensePlate} 
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="ทะเบียนรถ (เช่น กก-1234)"
                        required
                    />
                    <button type="submit">ลงทะเบียนรถ</button>
                </form>
            )}
        </div>
    );
}

export default DriverMenu;