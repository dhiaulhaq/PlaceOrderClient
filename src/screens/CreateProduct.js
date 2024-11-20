import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Input, Button, Card } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/api';

export default function CreateProduct({ navigation }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !type || !price) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            await api.createProduct({
                name,
                type,
                price: parseInt(price)
            });
            Alert.alert('Success', 'Product created successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title>Create New Product</Card.Title>
                <Card.Divider />
                <Input
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter product name"
                />
                <Text style={styles.label}>Type</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={type}
                        onValueChange={setType}
                        style={styles.picker}
                    >
                        <Picker.Item
                            key="Laptop"
                            label="Laptop"
                            value="Laptop"
                        />
                        <Picker.Item
                            key="Kulkas"
                            label="Kulkas"
                            value="Kulkas"
                        />
                        <Picker.Item
                            key="Smartphone"
                            label="Smartphone"
                            value="Smartphone"
                        />
                        <Picker.Item
                            key="Televisi"
                            label="Televisi"
                            value="Televisi"
                        />
                    </Picker>
                </View>
                <Input
                    label="Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="Enter product price"
                />
                <Button
                    title="Create Product"
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
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 10,
        color: '#86939e'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e1e8ee',
        borderRadius: 5,
        marginBottom: 15,
        marginHorizontal: 10
    },
    picker: {
        height: 55
    }
});