import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem, FAB } from '@rneui/themed';
import { api } from '../api/api';
import { formatPrice } from '../utils/formatCurrency';

export default function ProductList({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const loadProducts = async () => {
        try {
            const response = await api.getProducts(page);
            setProducts(response.data.content);
            setLoading(false);
        } catch (error) {
            console.error('Error loading products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadProducts();
        });

        return unsubscribe;
    }, [navigation, page]);

    const renderItem = ({ item }) => (
        <ListItem
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            bottomDivider
        >
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.type}</ListItem.Subtitle>
                <ListItem.Subtitle>Price: {formatPrice(item.price)}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <FAB
                placement="right"
                icon={{ name: 'add', color: 'white' }}
                onPress={() => navigation.navigate('CreateProduct')}
                style={styles.fab}
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
    fab: {
        margin: 16
    }
});