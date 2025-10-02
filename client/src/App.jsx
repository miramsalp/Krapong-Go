import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';

const token = localStorage.getItem('token');

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={token ? <Navigate to="/" /> : <AuthPage />} />
                <Route path="/" element={token ? <MainPage /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;