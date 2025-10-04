import React, { useState } from 'react';
import api from '../api';

function AuthPage() {
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

    return (
        <div>
            <h1>Login / Register</h1>
            <form>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required /><br />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /><br />
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="passenger">Passenger</option>
                    <option value="driver">Driver</option>
                </select><br />
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
}

export default AuthPage;