import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Platform } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import GentooChat from '../../src/packages/GentooChat';
import GentooService from '../../src/packages/GentooService';

type CartItem = {
  id: string;
  name: string;
  price: number;
};

export default function CartScreen() {
  // For this demo, let's assume we have some items in the cart state:
  
  const gentooInput = {
    partnerId: "6718be2310310e41ab5276ef",
    authCode: "selentest_rn",
    itemId: "111111111111111111111111",
    displayLocation: "HOME",
  }

  if (Platform.OS !== 'web') {
    GentooService.App.init(gentooInput);
  }

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        console.log("CartScreen focused");
        if ((window as any).GentooIO) {
          console.log("GentooIO unmounted");
          GentooService.Web.unmount();
        }
        GentooService.Web.loadScript();
        GentooService.Web.boot(gentooInput);
        GentooService.Web.init({
            showGentooButton: true,
        });
      }
    }, [])
  );
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Classic White Shirt', price: 29.99 },
    { id: '2', name: 'Black T-Shirt', price: 19.99 },
  ]);

  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  function handleCheckout() {
    alert('Checkout complete!');
    // In a real app, you'd navigate to a payment screen or do an API call
  }

  function handleRemoveItem(itemId: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  return (
    <>
      <GentooChat showGentooButton={true} />
      {/* Use Stack.Screen to set the title in the nav bar */}
      <Stack.Screen options={{ title: 'My Cart' }} />

      <View style={styles.container}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyMsg}>Your cart is empty.</Text>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <Button
                    title="Remove"
                    onPress={() => handleRemoveItem(item.id)}
                  />
                </View>
              )}
            />

            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <Button title="Checkout" onPress={() => GentooService.App.toggleChat()} />
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  emptyMsg: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemPrice: {
    marginRight: 10,
    color: '#666',
  },
  total: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
});
