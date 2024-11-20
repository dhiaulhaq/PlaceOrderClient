import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Card } from '@rneui/themed';
import { api } from '../api/api';

export default function CreateCustomer({ navigation }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !address) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            await api.createCustomer({
                name,
                address,
            });
            Alert.alert('Success', 'Customer created successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title>Create New Customer</Card.Title>
                <Card.Divider />
                <Input
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter customer name"
                />
                <Input
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter customer address"
                />
                <Button
                    title="Create Customer"
                    onPress={handleSubmit}
                    loading={loading}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5'
    }
});