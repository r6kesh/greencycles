import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('agentUser');
            const storedToken = await AsyncStorage.getItem('agentToken');

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (e) {
            console.error("Failed to load credentials", e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData, tokenData) => {
        if (userData.role !== 'agent') {
            throw new Error('Access denied. Agent privileges required.');
        }
        setUser(userData);
        setToken(tokenData);
        await AsyncStorage.setItem('agentUser', JSON.stringify(userData));
        await AsyncStorage.setItem('agentToken', tokenData);
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('agentUser');
        await AsyncStorage.removeItem('agentToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
