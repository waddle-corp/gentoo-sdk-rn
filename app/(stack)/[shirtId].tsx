import SHIRTS from "../../data/shirts";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
    const { shirtId } = useLocalSearchParams();
    const shirt = SHIRTS.find((shirt) => shirt.id === shirtId);

    if (!shirt) {
        return (
            <>
                <Stack.Screen options={{ title: 'Not Found' }} />
                <View style={styles.center}>
                    <Text>Shirts not found!</Text>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: shirt.name }} />
            <View style={styles.container}>
                <Image source={{ uri: shirt.image }} style={styles.image} />
                <Text style={styles.name}>{shirt.name}</Text>
                <Text style={styles.price}>${shirt.price}</Text>

                <Button title="Add to Cart" onPress={() => alert('Added to Cart!')}/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
      },
      image: {
        width: 200,
        height: 200,
        marginVertical: 16,
        borderRadius: 8,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      price: {
        fontSize: 18,
        color: '#666',
        marginBottom: 16,
      },
})