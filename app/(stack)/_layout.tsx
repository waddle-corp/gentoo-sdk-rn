import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="[shirtId]" options={{ headerShown: false }} />
    </Stack>
  );
}

export const unstable_settings = {
    // Tells Expo Router NOT to show this layout as a top-level route
    href: null,
};