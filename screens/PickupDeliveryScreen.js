import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function PickupDeliveryScreen({ navigation, route }) {
  // allow manual entry of addresses or coordinates
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');

  const onNext = () => {
    // For simplicity we pass strings; DistanceScreen will attempt to parse coords if provided
    navigation.navigate('Distance', { pickup, delivery });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickup & Delivery</Text>

      <Text>Pickup Address</Text>
      <TextInput style={styles.input} value={pickup} onChangeText={setPickup} placeholder="e.g. 26.2041,28.0473 or 123 Main St" />

      <Text>Delivery Address</Text>
      <TextInput style={styles.input} value={delivery} onChangeText={setDelivery} placeholder="e.g. 26.0823,28.0536 or 456 Other Ave" />

      <Button title="Calculate Distance" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }
});
