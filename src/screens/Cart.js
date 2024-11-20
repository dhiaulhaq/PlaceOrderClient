import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { ListItem, Button, Text, Divider, Card } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/api';
import { formatPrice } from '../utils/formatCurrency';

export default function Cart({ navigation }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const loadCustomers = async () => {
        try {
            const response = await api.getCustomers();
            setCustomers(response.data.content);
            if (response.data.content.length > 0) {
                setSelectedCustomer(response.data.content[0]);
                loadCart(response.data.content[0].id);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading customers:', error);
            setLoading(false);
        }
    };

    const loadCart = async (customerId) => {
        try {
            const response = await api.getCart(customerId);
            setCart(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading cart:', error);
            setLoading(false);
        }
    };

    const placeOrder = async () => {
        if (!selectedCustomer) {
            Alert.alert('Error', 'Please select a customer first');
            return;
        }

        try {
            setLoading(true);
            await api.placeOrder(selectedCustomer.id);
            Alert.alert('Success', 'Order placed successfully!');
            navigation.navigate('Products');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card>
                <Picker
                    selectedValue={selectedCustomer?.id}
                    onValueChange={(itemValue) => {
                        const customer = customers.find(c => c.id === itemValue);
                        setSelectedCustomer(customer);
                        loadCart(itemValue);
                    }}>
                    {customers.map((customer) => (
                        <Picker.Item
                            key={customer.id}
                            label={customer.name}
                            value={customer.id}
                        />
                    ))}
                </Picker>
                {selectedCustomer && (
                    <View style={styles.customerInfo}>
                        <Text h4>{selectedCustomer.name}</Text>
                        <Text>{selectedCustomer.address}</Text>
                    </View>
                )}
            </Card>

            {cart && cart.items && cart.items.length > 0 ? (
                <>
                    <FlatList
                        style={styles.productList}
                        data={cart.items}
                        renderItem={({ item }) => (
                            <ListItem bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{item.product.name}</ListItem.Title>
                                    <ListItem.Subtitle>Quantity: {item.quantity}</ListItem.Subtitle>
                                    <ListItem.Subtitle>Total: {formatPrice(item.totalPrice)}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                    <View style={styles.footer}>
                        <Text h4>Total: {formatPrice(cart.totalPrice)}</Text>
                        <Button
                            title="Place Order"
                            onPress={placeOrder}
                            loading={loading}
                            containerStyle={styles.button}
                        />
                    </View>
                </>
            ) : (
                <View style={styles.center}>
                    <Text h4>Cart is empty</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    productList: {
        marginTop: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0'
    },
    button: {
        marginTop: 10
    },
    customerInfo: {
        padding: 10,
    }
});