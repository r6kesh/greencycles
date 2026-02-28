import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import axios from 'axios';

// Ensure to replace this with your actual IP address or production URL when building for physical device
const API_URL = 'http://10.0.2.2:5000/api'; // 10.0.2.2 is local host for Android emulator

const LoginScreen = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            return Alert.alert('Error', 'Please enter a valid phone number');
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/send-otp`, { phoneNumber: `+91${phone}` });
            setStep(2);
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            return Alert.alert('Error', 'Please enter the valid OTP');
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/verify-otp`, {
                phoneNumber: `+91${phone}`,
                otp
            });

            if (res.data.user.role !== 'agent') {
                return Alert.alert('Error', 'Unauthorized access. Agent only.');
            }

            await login(res.data.user, res.data.token);
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🛡️</Text>
                </View>

                <Text style={styles.title}>Agent Login</Text>
                <Text style={styles.subtitle}>Secure access for GreenCycle Agents</Text>

                {step === 1 ? (
                    <View style={styles.form}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputGroup}>
                            <View style={styles.prefix}>
                                <Text style={styles.prefixText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="0000000000"
                                placeholderTextColor={COLORS.textMuted}
                                keyboardType="number-pad"
                                value={phone}
                                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                                maxLength={10}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color={COLORS.textLight} /> : <Text style={styles.buttonText}>Get OTP</Text>}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.label}>Enter OTP Code</Text>
                        <TextInput
                            style={[styles.input, styles.otpInput]}
                            placeholder="••••"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="number-pad"
                            value={otp}
                            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                            maxLength={6}
                            autoFocus
                        />
                        <Text style={styles.mutedText}>Code sent to +91 {phone}</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color={COLORS.textLight} /> : <Text style={styles.buttonText}>Verify & Login</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setStep(1)} style={styles.linkButton}>
                            <Text style={styles.linkText}>Use a different number</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
        justifyContent: 'center',
        padding: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.bgCard,
        padding: SIZES.padding * 1.5,
        borderRadius: SIZES.radius * 2,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.textLight,
        marginBottom: SIZES.base / 2,
    },
    subtitle: {
        color: COLORS.textMuted,
        marginBottom: SIZES.padding * 1.5,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    label: {
        ...FONTS.medium,
        color: COLORS.textMuted,
        marginBottom: SIZES.base,
    },
    inputGroup: {
        flexDirection: 'row',
        marginBottom: SIZES.padding,
    },
    prefix: {
        backgroundColor: '#0f172a',
        paddingHorizontal: SIZES.padding,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: SIZES.radius,
        borderBottomLeftRadius: SIZES.radius,
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: COLORS.border,
    },
    prefixText: {
        color: COLORS.textMuted,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: COLORS.bgDark,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textLight,
        paddingHorizontal: SIZES.padding,
        borderTopRightRadius: SIZES.radius,
        borderBottomRightRadius: SIZES.radius,
        fontSize: SIZES.medium,
    },
    otpInput: {
        borderRadius: SIZES.radius,
        textAlign: 'center',
        fontSize: 24,
        letterSpacing: 8,
        fontWeight: 'bold',
        marginBottom: SIZES.base,
    },
    mutedText: {
        color: COLORS.textMuted,
        fontSize: SIZES.small,
        textAlign: 'center',
        marginBottom: SIZES.padding,
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        ...FONTS.bold,
        color: COLORS.textLight,
    },
    linkButton: {
        marginTop: SIZES.padding,
        padding: SIZES.base,
        alignItems: 'center',
    },
    linkText: {
        color: COLORS.textMuted,
        ...FONTS.medium,
    }
});

export default LoginScreen;
