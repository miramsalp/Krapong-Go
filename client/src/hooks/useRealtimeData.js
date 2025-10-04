import { useState, useEffect } from 'react';
import api from '../api';
import { io } from 'socket.io-client';

export function useRealtimeData(selectedRouteId, user) {
    const [vehicles, setVehicles] = useState([]);
    const [pings, setPings] = useState([]);

    useEffect(() => {
        if (selectedRouteId && user) {
            api.get(`/vehicles?routeId=${selectedRouteId}`).then(res => {
                setVehicles(res.data.data.vehicles);
            });

            if (user.role === 'driver') {
                api.get('/pings').then(res => {
                    setPings(res.data.data.pings);
                }).catch(() => setPings([]));
            } else {
                setPings([]);
            }
        }
    }, [selectedRouteId, user]);

    useEffect(() => {
        if (!selectedRouteId) return;

        const socket = io('http://localhost:5000');
        socket.on('connect', () => socket.emit('joinRoute', selectedRouteId));

        socket.on('vehicleLocationUpdate', updatedVehicle => {
            setVehicles(prev => prev.map(v => v._id === updatedVehicle.vehicleId ? { ...v, location: updatedVehicle.location } : v));
        });

        if (user?.role === 'driver') {
            socket.on('newPing', newPing => setPings(prev => [...prev, newPing]));
            socket.on('pingRemoved', ({ pingId }) => setPings(prev => prev.filter(p => p._id !== pingId)));
        }

        return () => socket.disconnect();
    }, [selectedRouteId, user]);

    return { vehicles, pings };
}