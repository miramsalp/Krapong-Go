import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import PassengerMenu from '../components/PassengerMenu';
import DriverMenu from '../components/DriverMenu';
import api from '../api';

import { useRealtimeData } from '../hooks/useRealtimeData';
import { usePassengerActions } from '../hooks/usePassengerActions';
import { useDriverActions } from '../hooks/useDriverActions';

function MainPage() {
    const [user, setUser] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState('');

    useEffect(() => {
        api.get('/users/me').then(res => setUser(res.data));
        api.get('/routes').then(res => {
            const fetchedRoutes = res.data.data.routes;
            setRoutes(fetchedRoutes);
            if (fetchedRoutes.length > 0) {
                setSelectedRouteId(fetchedRoutes[0]._id);
            }
        });
    }, []);

    const { vehicles, pings } = useRealtimeData(selectedRouteId, user);
    const { myPing, hasActivePing, handlePing, handleCancelPing } = usePassengerActions(selectedRouteId);
    const driverActions = useDriverActions();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (!user) return <div>Loading...</div>;

    const pingsForMap = user.role === 'driver' ? pings : (myPing ? [myPing] : []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '300px', padding: '10px', background: '#f0f0f0', overflowY: 'auto' }}>
                <h2>Welcome, {user.username}!</h2>
                <p>Role: {user.role}</p>
                 <select value={selectedRouteId} onChange={e => setSelectedRouteId(e.target.value)}>
                    {routes.map(route => (
                        <option key={route._id} value={route._id}>{route.routeName}</option>
                    ))}
                </select>
                <button onClick={handleLogout} style={{float: 'right'}}>Logout</button>
                <hr />

                {user.role === 'passenger' && (
                    <PassengerMenu 
                        hasActivePing={hasActivePing} 
                        onPing={handlePing}
                        onCancelPing={handleCancelPing}
                    />
                )}
                
                {user.role === 'driver' && (
                     <DriverMenu 
                        myVehicle={driverActions.myVehicle}
                        isOnline={driverActions.isOnline}
                        onGoOnline={driverActions.handleGoOnline}
                        onGoOffline={driverActions.handleGoOffline}
                        handleRegisterVehicle={driverActions.handleRegisterVehicle}
                        selectedRouteId={selectedRouteId}
                     />
                )}
            </div>
            <div style={{ flex: 1 }}>
                <Map vehicles={vehicles} pings={pingsForMap} />
            </div>
        </div>
    );
}

export default MainPage;