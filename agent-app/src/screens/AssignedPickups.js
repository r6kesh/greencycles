import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAuth } from '../components/AuthContext';

const mockPickups = [
    { id: 'ORD-8212', customer: 'Riya Gupta', address: '123 Indiranagar, Bangalore\nNear Metro Station', amount: '₹890', status: 'Assigned', time: 'Today, 2:00 PM' },
    { id: 'ORD-8215', customer: 'Amit K', address: '45 Koramangala, Bangalore', amount: '₹1200', status: 'Assigned', time: 'Today, 4:30 PM' },
];

export default function AssignedPickups() {
    const { user, logout } = useAuth();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.customer}>{item.customer}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <View style={styles.footer}>
                    <Text style={styles.amount}>Est: {item.amount}</Text>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Text style={styles.actionText}>Start Pickup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name}</Text>
                    <Text style={styles.title}>Your Pickups</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={mockPickups}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    greeting: { fontSize: 14, color: '#64748b', fontWeight: '600' },
    title: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginTop: 4 },
    logoutBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fee2e2', borderRadius: 8 },
    logoutText: { color: '#ef4444', fontWeight: 'bold' },
    listContainer: { padding: 16 },
    card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0ea5e9', paddingHorizontal: 16, paddingVertical: 12 },
    orderId: { color: '#fff', fontWeight: '900', fontSize: 16 },
    time: { color: '#e0f2fe', fontWeight: 'bold', fontSize: 14 },
    cardBody: { padding: 16 },
    customer: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    address: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 16 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
    amount: { fontSize: 18, fontWeight: '900', color: '#10b981' },
    actionBtn: { backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
    actionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
