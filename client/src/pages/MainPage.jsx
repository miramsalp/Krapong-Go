import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import TestMap from '../components/TestMap'
import api from '../api';
import { jwtDecode } from 'jwt-decode'; 


function MainPage() {
    const [user, setUser] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [pings, setPings] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState("ID_ของสายรถที่สร้างไว้"); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token);

            api.get(`/users/me`).then(res => setUser(res.data));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handlePing = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                await api.post('/pings', {
                    latitude,
                    longitude,
                    routeId: selectedRouteId
                });
                alert('Ping successful!');
            } catch (err) {
                alert('Ping failed!');
                console.error(err);
            }
        });
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', height: '100vh' }}> 
            <div style={{ width: '300px', padding: '10px', background: '#f0f0f0' }}>
                <h2>Welcome, {user.username}!</h2>
                <p>Role: {user.role}</p>
                <button onClick={handleLogout}>Logout</button>
                <hr />

                {user.role === 'passenger' && (
                    <div>
                        <h3>Passenger Menu</h3>
                        <button onClick={handlePing}>Ping My Location</button>
                    </div>
                )}
                {user.role === 'driver' && (
                     <div>
                        <h3>Driver Menu</h3>

                        <button>Go Online</button> 
                    </div>
                )}
            </div>
            <div style={{ flex: 1 }}>
                {/* <Map vehicles={vehicles} pings={pings} /> */}
                <TestMap /> 
            </div>
        </div>
    );
}

export default MainPage;