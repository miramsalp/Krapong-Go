import { useState, useRef, useEffect } from 'react';
import api from '../api';

export function useDriverActions() {
    const [myVehicle, setMyVehicle] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const locationWatchId = useRef(null);

    useEffect(() => {
        api.get('/vehicles/my-vehicle')
            .then(res => {
                const vehicle = res.data.data.vehicle;
                setMyVehicle(vehicle);
                setIsOnline(vehicle.status === 'en-route');
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setMyVehicle(null);
                }
            });
    }, []);

    const handleRegisterVehicle = async (licensePlate, routeId) => {
        try {
            const res = await api.post('/vehicles', { licensePlate, routeId });
            setMyVehicle(res.data.data.vehicle);
            alert('ลงทะเบียนรถสำเร็จ!');
        } catch (err) {
            alert(err.response?.data?.message || 'ลงทะเบียนไม่สำเร็จ');
            throw err; 
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
                    { enableHighAccuracy: true }
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
    
    return { myVehicle, isOnline, handleGoOnline, handleGoOffline, handleRegisterVehicle };
}