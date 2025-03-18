import React from 'react';
import { Shirt } from "../data/shirts";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ShirtsItemProps = {
    shirt: Shirt;
    onPress: () => void;
}

export default function ShirtsItem({ shirt, onPress }: ShirtsItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: shirt.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{shirt.name}</Text>
                <Text style={styles.price}>${shirt.price}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        marginVertical: 6,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    info: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    }
})