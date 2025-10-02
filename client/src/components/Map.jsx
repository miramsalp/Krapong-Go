import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapUpdater() {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, [map]);
    return null;
}

function Map({ vehicles = [], pings = [] }) {
    const position = [13.7563, 100.5018];

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>

            <MapUpdater />

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {vehicles.map(vehicle => (
                <Marker key={vehicle._id} position={[vehicle.location.coordinates[1], vehicle.location.coordinates[0]]}>
                    <Popup>ทะเบียน: {vehicle.licensePlate}</Popup>
                </Marker>
            ))}
             
            {pings.map(ping => (
                 <Marker key={ping._id} position={[ping.location.coordinates[1], ping.location.coordinates[0]]}>
                    <Popup>มีคนรอตรงนี้!</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default Map;