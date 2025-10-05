import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import BottomMenu from '../components/BottomMenu';
import api from '../api';


import { useRealtimeData } from '../hooks/useRealtimeData';
import { usePassengerActions } from '../hooks/usePassengerActions';
import { useDriverActions } from '../hooks/useDriverActions';

import './MainPage.css'; 

function MainPage() {
    const [user, setUser] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState('');

    const { vehicles, pings } = useRealtimeData(selectedRouteId, user);
    const passengerActions = usePassengerActions(selectedRouteId);
    const driverActions = useDriverActions();

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (!user) return <div>Loading...</div>;
    
    const { myPing } = passengerActions;
    const pingsForMap = user.role === 'driver' ? pings : (myPing ? [myPing] : []);

    return (
        <div className="main-container">
            <div className="map-wrapper">
                <Map vehicles={vehicles} pings={pingsForMap} />
            </div>
            
            <div className="menu-wrapper">
                <BottomMenu 
                    user={user}
                    routes={routes}
                    selectedRouteId={selectedRouteId}
                    onSelectRoute={(e) => setSelectedRouteId(e.target.value)}
                    onLogout={handleLogout}
                    passengerActions={passengerActions}
                    driverActions={driverActions}
                />
            </div>
        </div>
    );
}

export default MainPage;