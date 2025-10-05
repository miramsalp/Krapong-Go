import { useState, useEffect } from 'react';
import api from '../api';

export function usePassengerActions(selectedRouteId) {
    const [myPing, setMyPing] = useState(null); 

    useEffect(() => {
        const checkActivePing = async () => {
            try {
                const res = await api.get('/pings/my-ping');
                setMyPing(res.data.data.ping); 
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setMyPing(null); 
                }
            }
        };
        checkActivePing();
    }, []);

    const handlePing = () => {
        const options = {
            enableHighAccuracy: true, 
            timeout: 10000,            
            maximumAge: 0             
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => { 
                try {
                    // console.log('Position Found:', position); 
                    const { latitude, longitude } = position.coords;
                    const res = await api.post('/pings', { latitude, longitude, routeId: selectedRouteId });
                    alert('ส่งสัญญาณเรียกรถสำเร็จ!');
                    setMyPing(res.data.data.ping);
                } catch (err) {
                    alert(err.response?.data?.message || 'ส่งสัญญาณไม่สำเร็จ');
                }
            },
            (error) => { 
                console.error("Error getting location:", error);
                alert(`ไม่สามารถหาตำแหน่งได้: ${error.message}`);
            },
            options 
        );
    };
    
    const handleCancelPing = async () => {
        try {
            await api.delete('/pings/my-ping');
            alert('ยกเลิกการเรียกรถแล้ว');
            setMyPing(null); 
        } catch (err) {
            alert('ยกเลิกไม่สำเร็จ หรือไม่มีหมุดของคุณอยู่แล้ว');
            setMyPing(null);
        }
    };

    return { myPing, hasActivePing: !!myPing, handlePing, handleCancelPing };
}