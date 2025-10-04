import React, { useState, useEffect, useRef } from 'react';
import Map from '../components/Map';
import api from '../api';
import { io } from 'socket.io-client'; 

function MainPage() {
    const [user, setUser] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState('');
    
    const [vehicles, setVehicles] = useState([]);
    const [pings, setPings] = useState([]);

    const [isOnline, setIsOnline] = useState(false);
    const locationWatchId = useRef(null); 

    const [hasActivePing, setHasActivePing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/users/me').then(res => setUser(res.data));
        }

        api.get('/routes').then(res => {
            setRoutes(res.data.data.routes);
            if (res.data.data.routes.length > 0) {
                setSelectedRouteId(res.data.data.routes[0]._id);
            }
        });
    }, []);

    useEffect(() => {
        if (!selectedRouteId) return;

        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Socket connected!');
            socket.emit('joinRoute', selectedRouteId);
        });

        socket.on('vehicleLocationUpdate', (updatedVehicle) => {
            setVehicles(prevVehicles => 
                prevVehicles.map(v => v._id === updatedVehicle.vehicleId ? { ...v, location: updatedVehicle.location } : v)
            );
        });

        socket.on('newPing', (newPing) => {
            setPings(prevPings => [...prevPings, newPing]);
        });

        socket.on('pingRemoved', ({ pingId }) => {
            setPings(prevPings => prevPings.filter(p => p._id !== pingId));
        });

        return () => {
            socket.disconnect();
        };

    }, [selectedRouteId]); 

    useEffect(() => {
        if (selectedRouteId) {
            api.get(`/vehicles?routeId=${selectedRouteId}`).then(res => {
                setVehicles(res.data.data.vehicles);
            });
            if (user?.role === 'driver') {
                api.get('/pings').then(res => {
                    setPings(res.data.data.pings);
                });
            }
        }
    }, [selectedRouteId, user]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handlePing = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                await api.post('/pings', { latitude, longitude, routeId: selectedRouteId });
                alert('ส่งสัญญาณเรียกรถสำเร็จ!');
                setHasActivePing(true); 
            } catch (err) {
                alert(err.response?.data?.message || 'ส่งสัญญาณไม่สำเร็จ');
            }
        });
    };

    const handleCancelPing = async () => {
        try {
            await api.delete('/pings/my-ping');
            alert('ยกเลิกการเรียกรถแล้ว');
            setHasActivePing(false); 
        } catch (err) {
            alert('ยกเลิกไม่สำเร็จ หรือไม่มีหมุดของคุณอยู่แล้ว');
            setHasActivePing(false); 
            console.error(err);
        }
    };
    
    const handleGoOnline = () => {
        api.patch('/vehicles/my-vehicle/status', { status: 'en-route' })
            .then(() => {
                setIsOnline(true);
                locationWatchId.current = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        api.patch('/vehicles/my-vehicle/location', { latitude, longitude });
                    },
                    (error) => console.error("Geolocation Error:", error),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            })
            .catch(err => alert('ไม่สามารถเริ่มวิ่งได้ กรุณาลงทะเบียนรถก่อน'));
    };
    
    const handleGoOffline = () => {
        if (locationWatchId.current) {
            navigator.geolocation.clearWatch(locationWatchId.current);
        }
        api.patch('/vehicles/my-vehicle/status', { status: 'offline' })
            .then(() => setIsOnline(false));
    };

    if (!user) return <div>Loading...</div>;

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
                    <div>
                        <h3>Passenger Menu</h3>
                        {hasActivePing ? (
                            <button onClick={handleCancelPing} style={{background: 'orange'}}>ยกเลิกการเรียกรถ</button>
                        ) : (
                            <button onClick={handlePing}>ปักหมุดเรียกรถ</button>
                        )}
                    </div>
                )}
                {user.role === 'driver' && (
                     <div>
                        <h3>Driver Menu</h3>
                        {!isOnline ? (
                            <button onClick={handleGoOnline}>Go Online</button> 
                        ) : (
                            <button onClick={handleGoOffline} style={{background: 'red'}}>Go Offline</button>
                        )}
                    </div>
                )}
            </div>
            <div style={{ flex: 1 }}>
                <Map vehicles={vehicles} pings={pings} />
            </div>
        </div>
    );
}

export default MainPage;