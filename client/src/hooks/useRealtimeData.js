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

        const socket = io(import.meta.env.VITE_API_BASE_URL);
        socket.on('connect', () => {
            console.log('Socket connected!');

            const token = localStorage.getItem('token');
            if (token) {
                socket.emit('authenticate', { token });
            }

            socket.emit('joinRoute', selectedRouteId);
        });

        socket.on('vehicleLocationUpdate', updatedVehicle => {
            setVehicles(prev => prev.map(v => v._id === updatedVehicle.vehicleId ? { ...v, location: updatedVehicle.location } : v));
        });

        socket.on('vehicleStatusChanged', (updatedVehicle) => {
            if (updatedVehicle.status === 'en-route') {
                setVehicles(prev => {
                    if (prev.find(v => v._id === updatedVehicle._id)) {
                        return prev; 
                    }
                    return [...prev, updatedVehicle]; 
                });
            } else {
                setVehicles(prev => prev.filter(v => v._id !== updatedVehicle._id));
            }
        });

        if (user?.role === 'driver') {
            socket.on('newPing', newPing => setPings(prev => [...prev, newPing]));
            socket.on('pingRemoved', ({ pingId }) => setPings(prev => prev.filter(p => p._id !== pingId)));
        }

        return () => socket.disconnect();
    }, [selectedRouteId, user]);

    return { vehicles, pings };
}