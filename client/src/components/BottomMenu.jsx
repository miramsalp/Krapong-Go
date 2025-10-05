import React from 'react';
import DriverMenu from './DriverMenu';
import PassengerMenu from './PassengerMenu';
import './BottomMenu.css';
import { FiLogOut } from 'react-icons/fi';

function BottomMenu({ user, routes, selectedRouteId, onSelectRoute, onLogout, passengerActions, driverActions }) {

  return (
    <div className="bottom-menu-card">
      <div className="header">
        <div className="user-info">
          <h4>Welcome, {user.username}!</h4>
          <p>Role: {user.role}</p>
        </div>
        <button onClick={onLogout} className="logout-button">
          <FiLogOut size={20} />
        </button>
      </div>

      <div className="route-selector">
        <label htmlFor="route-select">เลือกสายรถ:</label>
        <select id="route-select" value={selectedRouteId} onChange={onSelectRoute}>
          {routes.map(route => (
            <option key={route._id} value={route._id}>{route.routeName}</option>
          ))}
        </select>
      </div>

      <hr className="divider" />

      <div className="action-area">
        {user.role === 'passenger' && (
          <PassengerMenu 
            hasActivePing={passengerActions.hasActivePing}
            onPing={passengerActions.handlePing}
            onCancelPing={passengerActions.handleCancelPing}
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
    </div>
  );
}

export default BottomMenu;