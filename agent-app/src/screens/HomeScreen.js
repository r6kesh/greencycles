import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

const HomeScreen = ({ navigation }) => {
    const [pickups, setPickups] = useState([]);
    const [earnings, setEarnings] = useState({ totalPickups: 0, totalProcessedValue: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { token, user, logout } = useAuth();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                    <Text style={{ color: COLORS.danger, fontWeight: 'bold' }}>Logout</Text>
                </TouchableOpacity>
            )
        });
        fetchData();
    }, [navigation]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [pickupsRes, earningsRes] = await Promise.all([
                axios.get(`${API_URL}/agents/assigned-pickups`, config),
                axios.get(`${API_URL}/agents/earnings`, config)
            ]);
            setPickups(pickupsRes.data);
            setEarnings(earningsRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderItem = ({ item }) => {
        const date = new Date(item.pickupDate).toLocaleDateString();
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('PickupDetail', { order: item })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.customerName}>{item.customer?.name || 'Customer'}</Text>
                    <View style={[styles.badge, item.status === 'Completed' ? styles.badgeSuccess : styles.badgeInfo]}>
                        <Text style={[styles.badgeText, item.status === 'Completed' ? styles.badgeTextSuccess : styles.badgeTextInfo]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.detailText}>📍 {item.address?.street}, {item.address?.city} {item.address?.zip}</Text>
                    <Text style={styles.detailText}>🕘 {date} | {item.pickupTimeSlot}</Text>
                    <Text style={styles.detailText}>📦 {item.items?.length || 0} Types of Scrap</Text>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.estAmount}>Est. ₹{item.totalEstimatedAmount}</Text>
                    <Text style={styles.actionText}>View Details →</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, {user?.name}</Text>
                <Text style={styles.subtitle}>You have {pickups.filter(p => p.status !== 'Completed').length} pending pickups.</Text>

                <View style={styles.earningsCard}>
                    <View>
                        <Text style={styles.earningsLabel}>Processed Value</Text>
                        <Text style={styles.earningsAmount}>₹{earnings.totalProcessedValue}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.earningsLabel}>Pickups Done</Text>
                        <Text style={styles.earningsCount}>{earnings.totalPickups}</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={pickups}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No pickups assigned to you yet.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgDark,
    },
    header: {
        padding: SIZES.padding,
        paddingBottom: SIZES.base,
    },
    greeting: {
        ...FONTS.h2,
        color: COLORS.textLight,
    },
    subtitle: {
        ...FONTS.medium,
        color: COLORS.textMuted,
        marginTop: 4,
        marginBottom: SIZES.padding,
    },
    earningsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    earningsLabel: {
        color: COLORS.primary,
        fontSize: parseInt(SIZES.font) - 2,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    earningsAmount: {
        ...FONTS.h2,
        color: COLORS.textLight,
    },
    earningsCount: {
        ...FONTS.h2,
        color: COLORS.textLight,
    },
    listContainer: {
        padding: SIZES.padding,
        paddingTop: SIZES.base,
    },
    card: {
        backgroundColor: COLORS.bgCard,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.base,
    },
    customerName: {
        ...FONTS.bold,
        color: COLORS.textLight,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeInfo: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    badgeTextInfo: {
        color: '#a78bfa',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    badgeSuccess: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    badgeTextSuccess: {
        color: '#34d399',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    cardBody: {
        marginBottom: SIZES.padding,
    },
    detailText: {
        color: COLORS.textMuted,
        fontSize: SIZES.font,
        marginBottom: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SIZES.base,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    estAmount: {
        ...FONTS.bold,
        color: COLORS.textLight,
    },
    actionText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: SIZES.padding * 2,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textMuted,
        ...FONTS.medium,
    }
});

export default HomeScreen;
