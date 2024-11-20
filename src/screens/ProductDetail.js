import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Input } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/api';
import { formatPrice } from '../utils/formatCurrency';

export default function ProductDetail({ route, navigation }) {
    const { product } = route.params;
    const [quantity, setQuantity] = useState('1');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        name: product.name,
        type: product.type,
        price: product.price.toString()
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await api.getCustomers();
            setCustomers(response.data.content);
            if (response.data.content.length > 0) {
                setSelectedCustomerId(response.data.content[0].id);
            }
        } catch (error) {
            console.error('Error loading customers:', error);
            Alert.alert('Error', 'Failed to load customers');
        }
    };

    const addToCart = async () => {
        if (!selectedCustomerId) {
            Alert.alert('Error', 'Please select a customer');
            return;
        }

        try {
            setLoading(true);
            await api.addToCart(selectedCustomerId, product.id, parseInt(quantity));
            Alert.alert('Success', 'Product added to cart');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await api.updateProduct(product.id, {
                ...editedProduct,
                price: parseInt(editedProduct.price)
            });
            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await api.deleteProduct(product.id);
                            Alert.alert('Success', 'Product deleted successfully');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete product');
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title>{product.name}</Card.Title>
                <Card.Divider />

                {isEditing ? (
                    <>
                        <Input
                            label="Name"
                            value={editedProduct.name}
                            onChangeText={(text) => setEditedProduct(prev => ({ ...prev, name: text }))}
                        />
                        <Input
                            label="Type"
                            value={editedProduct.type}
                            onChangeText={(text) => setEditedProduct(prev => ({ ...prev, type: text }))}
                        />
                        <Input
                            label="Price"
                            value={editedProduct.price}
                            onChangeText={(text) => setEditedProduct(prev => ({ ...prev, price: text }))}
                            keyboardType="numeric"
                        />
                        <View style={styles.buttonGroup}>
                            <Button
                                title="Save"
                                onPress={handleUpdate}
                                loading={loading}
                                containerStyle={styles.button}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => setIsEditing(false)}
                                type="outline"
                                containerStyle={styles.button}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.text}>Type: {product.type}</Text>
                        <Text style={styles.text}>Price: {formatPrice(product.price)}</Text>

                        <Text style={styles.label}>Select Customer:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCustomerId}
                                onValueChange={setSelectedCustomerId}
                                style={styles.picker}
                            >
                                {customers.map((customer) => (
                                    <Picker.Item
                                        key={customer.id}
                                        label={customer.name}
                                        value={customer.id}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <Input
                            label="Quantity"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />

                        <View style={styles.buttonContainer}>

                            <Button
                                title="Add to Cart"
                                onPress={addToCart}
                                loading={loading}
                                containerStyle={styles.buttonCart}
                            />

                            <View style={styles.buttonGroup}>
                                <Button
                                    title="Edit"
                                    onPress={() => setIsEditing(true)}
                                    type="outline"
                                    containerStyle={styles.button}
                                />
                                <Button
                                    title="Delete"
                                    onPress={handleDelete}
                                    buttonStyle={{ backgroundColor: 'red' }}
                                    containerStyle={styles.button}
                                />
                            </View>
                        </View>

                    </>
                )}
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
    text: {
        marginBottom: 10
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
        height: 50
    },
    buttonGroup: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 15
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15
    },
    buttonCart: {
        marginHorizontal: 5,
    },
    button: {
        marginHorizontal: 5,
        flex: 1,
    }
});