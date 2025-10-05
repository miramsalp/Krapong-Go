import React, { useState } from 'react';
import api from '../api';
import './AuthPage.css';

import KrapongIcon from '../assets/krapong-icon2.png';

function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true); 

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('passenger');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/'; 
        } catch (err) {
            alert('Login failed!');
            console.error(err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { username, password, role });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/'; 
        } catch (err) {
            alert('Registration failed!');
            console.error(err);
        }
    };

    const handleSubmit = isLoginView ? handleLogin : handleRegister;

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-icon-wrapper">
                    <img src={KrapongIcon} alt="Krapong Bus Icon" className="auth-illustration" />
                </div>

                <h2>{isLoginView ? 'Login' : 'Register'}</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="Username" 
                        required 
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required 
                        className="auth-input"
                    />
                    
                    {!isLoginView && (
                        <select value={role} onChange={e => setRole(e.target.value)} className="auth-input">
                            <option value="passenger">I am a Passenger</option>
                            <option value="driver">I am a Driver</option>
                        </select>
                    )}

                    <button type="submit" className="auth-button">
                        {isLoginView ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="toggle-auth">
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="toggle-auth-link">
                        {isLoginView ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;