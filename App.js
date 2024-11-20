import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductList from './src/screens/ProductList';
import ProductDetail from './src/screens/ProductDetail';
import CreateProduct from './src/screens/CreateProduct';
import Cart from './src/screens/Cart';
import Orders from './src/screens/Orders';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@rneui/themed';
import CreateCustomer from './src/screens/CreateCustomer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="Products"
          component={ProductList}
          options={({ navigation }) => ({
            title: 'Products',
            headerRight: () => (
              <Button
                type="clear"
                icon={{ name: 'shopping-cart', color: '#2196F3' }}
                onPress={() => navigation.navigate('Cart')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{ title: 'Product Detail' }}
        />
        <Stack.Screen
          name="CreateProduct"
          component={CreateProduct}
          options={{ title: 'Create Product' }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={({ navigation }) => ({
            title: 'Shopping Cart',
            headerRight: () => (
              <Button
                type="clear"
                icon={{ name: 'list', color: '#2196F3' }}
                onPress={() => navigation.navigate('Orders')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={({ navigation }) => ({
            title: 'All Orders',
            headerRight: () => (
              <Button
                type="clear"
                icon={{ name: 'person', color: '#2196F3' }}
                onPress={() => navigation.navigate('CreateCustomer')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="CreateCustomer"
          component={CreateCustomer}
          options={{ title: 'Create Customer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}