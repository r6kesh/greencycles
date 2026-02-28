import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../utils/theme';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PickupDetailScreen from '../screens/PickupDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: COLORS.bgCard },
                    headerTintColor: COLORS.textLight,
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: COLORS.bgDark }
                }}
            >
                {user ? (
                    <>
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ title: 'GreenCycle Agent' }}
                        />
                        <Stack.Screen
                            name="PickupDetail"
                            component={PickupDetailScreen}
                            options={{ title: 'Pickup Details' }}
                        />
                    </>
                ) : (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
