import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('agent_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('agent_user', JSON.stringify(userData));
        if (userData.token) {
            await AsyncStorage.setItem('agent_token', userData.token);
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('agent_user');
        await AsyncStorage.removeItem('agent_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
