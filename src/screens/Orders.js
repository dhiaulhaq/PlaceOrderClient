import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, Text, Card, Divider } from '@rneui/themed';
import { api } from '../api/api';
import { formatPrice } from '../utils/formatCurrency';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const loadOrders = async () => {
        try {
            const response = await api.getOrders(page);
            setOrders(response.data.content);
            setLoading(false);
        } catch (error) {
            console.error('Error loading orders:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [page]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const renderOrderItem = ({ item }) => (
        <Card style={styles.orderCards}>
            <Card.Title>Order #{item.id}</Card.Title>
            <Card.Divider />
            <View style={styles.customerInfo}>
                <Text h4>{item.customer.name}</Text>
                <Text>{item.customer.address}</Text>
                <Text>Status: {item.status}</Text>
            </View>
            <Divider style={styles.divider} />
            {item.items.map((orderItem) => (
                <ListItem key={orderItem.id} bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>{orderItem.product.name}</ListItem.Title>
                        <ListItem.Subtitle>Quantity: {orderItem.quantity}</ListItem.Subtitle>
                        <ListItem.Subtitle>Total: {formatPrice(orderItem.totalPrice)}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            ))}
            <View style={styles.totalContainer}>
                <Text h4>Total: {formatPrice(item.totalPrice)}</Text>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderCards: {
        marginBottom: 10,
    },
    customerInfo: {
        marginBottom: 15
    },
    divider: {
        marginVertical: 10
    },
    totalContainer: {
        marginTop: 15,
        alignItems: 'flex-end'
    }
});