import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Link, Stack } from 'expo-router';
import SHIRTS from '../../data/shirts';
import ShirtsItem from '../../components/ShirtsItem';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Test Store' }} />

      <View style={styles.container}>
        <FlatList
          data={SHIRTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link
              href={`/(stack)/${item.id}`}
              asChild
            >
              <ShirtsItem shirt={item} onPress={() => {}} />
            </Link>
          )}
        />
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => alert('FAB clicked')}>
          <Text style={styles.fabText}>?</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
  },
});
