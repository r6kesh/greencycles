import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert, TextInput } from 'react-native';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://10.0.2.2:5000/api';

const PickupDetailScreen = ({ route, navigation }) => {
    const { order } = route.params;
    const [status, setStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);
    const [weights, setWeights] = useState({});
    const { token } = useAuth();

    const openMaps = () => {
        // Fallback or exact query using the address string
        const query = encodeURIComponent(`${order.address.street}, ${order.address.city}, ${order.address.zip}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    const handleUpdateStatus = async (newStatus, isCompletion = false) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let payload = { status: newStatus };

            if (isCompletion) {
                // Formatting items for completion
                const itemsToUpdate = order.items.map(item => {
                    const actualWeight = parseFloat(weights[item._id] || item.quantity);
                    return {
                        _id: item._id, // Assuming backend uses this
                        scrapType: item.scrapType._id || item.scrapType,
                        quantity: item.quantity,
                        actualWeight: actualWeight,
                        priceApplied: item.scrapType?.buyingPrice || 0,
                        sellingPriceApplied: item.scrapType?.sellingPrice || 0
                    };
                });

                payload.items = itemsToUpdate;
                // Dummy proof image url
                payload.proofImageUrl = "https://res.cloudinary.com/dummy/image/upload/v1/scrap.jpg";
            }

            const res = await axios.put(`${API_URL}/orders/${order._id}/status`, payload, config);
            setStatus(res.data.status);

            if (isCompletion) {
                Alert.alert("Success", "Pickup completed successfully!");
                navigation.goBack();
            }

        } catch (err) {
            console.error("Failed to update status", err);
            Alert.alert("Error", "Failed to update pickup status.");
        } finally {
            setLoading(false);
        }
    };

    const handleWeightChange = (id, text) => {
        setWeights(prev => ({ ...prev, [id]: text }));
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>Pickup #{order._id.substring(order._id.length - 6).toUpperCase()}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{status}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Customer Details</Text>
                    <Text style={styles.text}>{order.customer?.name}</Text>
                    <Text style={styles.text}>{order.customer?.phoneNumber}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Location & Time</Text>
                    <Text style={styles.text}>{order.address.street}</Text>
                    <Text style={styles.text}>{order.address.city} - {order.address.zip}</Text>
                    <Text style={styles.text}>{new Date(order.pickupDate).toLocaleDateString()} | {order.pickupTimeSlot}</Text>

                    <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
                        <Text style={styles.mapButtonText}>📍 Open in Google Maps</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Scrap Items ({order.items.length})</Text>
                    {order.items.map(item => (
                        <View key={item._id} style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemText}>{item.scrapType?.icon} {item.scrapType?.name}</Text>
                                <Text style={styles.itemSubText}>Est: {item.quantity}kg @ ₹{item.scrapType?.buyingPrice}/kg</Text>
                            </View>

                            {status === 'On the way' && (
                                <View style={styles.weightInputContainer}>
                                    <TextInput
                                        style={styles.weightInput}
                                        placeholder={item.quantity.toString()}
                                        placeholderTextColor={COLORS.textMuted}
                                        keyboardType="numeric"
                                        value={weights[item._id]}
                                        onChangeText={(text) => handleWeightChange(item._id, text)}
                                    />
                                    <Text style={styles.weightLabel}>kg</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Updates</Text>
                    {status === 'Assigned' && (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: COLORS.secondary }]}
                            onPress={() => handleUpdateStatus('On the way')}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Start Journey</Text>}
                        </TouchableOpacity>
                    )}

                    {status === 'On the way' && (
                        <View style={styles.completionGroup}>
                            <Text style={styles.helperText}>Enter actual weights above to calculate final amount.</Text>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.success }]}
                                onPress={() => handleUpdateStatus('Completed', true)}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Complete Pickup & Pay</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    content: {
        padding: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.bgCard,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: SIZES.padding,
    },
    title: {
        ...FONTS.h2,
        color: COLORS.textLight,
    },
    badge: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    badgeText: {
        color: '#a78bfa',
        ...FONTS.regular,
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: SIZES.padding,
    },
    label: {
        ...FONTS.medium,
        color: COLORS.primary,
        marginBottom: SIZES.base,
    },
    text: {
        ...FONTS.regular,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    mapButton: {
        marginTop: SIZES.base,
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.3)',
        padding: parseInt(SIZES.base) * 1.5,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    mapButtonText: {
        color: '#38bdf8',
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.base,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    itemText: {
        ...FONTS.medium,
        color: COLORS.textLight,
    },
    itemSubText: {
        color: COLORS.textMuted,
        fontSize: parseInt(SIZES.font) - 2,
        marginTop: 2,
    },
    weightInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgDark,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        width: 80,
    },
    weightInput: {
        flex: 1,
        height: 40,
        color: COLORS.textLight,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    weightLabel: {
        color: COLORS.textMuted,
        paddingRight: 8,
        fontSize: 12,
    },
    button: {
        padding: parseInt(SIZES.base) * 2,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginTop: SIZES.base,
    },
    buttonText: {
        ...FONTS.bold,
        color: COLORS.textLight,
    },
    completionGroup: {
        marginTop: SIZES.base,
    },
    helperText: {
        color: COLORS.warning,
        fontSize: parseInt(SIZES.font) - 2,
        marginBottom: SIZES.base,
    }
});

export default PickupDetailScreen;
