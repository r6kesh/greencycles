import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for token/user on load
        const storedUser = localStorage.getItem('scrapcycle_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('scrapcycle_user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('scrapcycle_token', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('scrapcycle_user');
        localStorage.removeItem('scrapcycle_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
