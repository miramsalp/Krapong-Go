import { useState, useRef } from 'react';
import api from '../api';

export function useDriverActions() {
    const [isOnline, setIsOnline] = useState(false);
    const locationWatchId = useRef(null);

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
    
    return { isOnline, handleGoOnline, handleGoOffline };
}