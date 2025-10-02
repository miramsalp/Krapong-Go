import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
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
        setTimeout(() => {
            map.invalidateSize();
        }, 100); 
    }, [map]);
    return null;
}

function MinimalMap() {
    const position = [13.7563, 100.5018]; // Center of Bangkok

    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1 }}>
                <MapContainer 
                    center={position} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <MapUpdater />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <Marker position={position}>
                        <Popup>
                            ถ้าเห็นหมุดนี้และแผนที่ แสดงว่า Component ทำงานถูกต้อง
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default MinimalMap;