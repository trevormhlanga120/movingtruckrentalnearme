import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function BookingScreen({ navigation }) {
  const [originLat, setOriginLat] = useState('');
  const [originLng, setOriginLng] = useState('');
  const [destLat, setDestLat] = useState('');
  const [destLng, setDestLng] = useState('');

  const onNext = () => {
    // pass either coordinates as strings or empty values to the PickupDelivery screen
    const pickupVal = originLat && originLng ? `${originLat.trim()},${originLng.trim()}` : '';
    const deliveryVal = destLat && destLng ? `${destLat.trim()},${destLng.trim()}` : '';
    navigation.navigate('PickupDelivery', { pickup: pickupVal, delivery: deliveryVal });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Booking</Text>
      <Text>Origin Latitude</Text>
      <TextInput style={styles.input} value={originLat} onChangeText={setOriginLat} keyboardType="numeric" />
      <Text>Origin Longitude</Text>
      <TextInput style={styles.input} value={originLng} onChangeText={setOriginLng} keyboardType="numeric" />

      <Text>Destination Latitude</Text>
      <TextInput style={styles.input} value={destLat} onChangeText={setDestLat} keyboardType="numeric" />
      <Text>Destination Longitude</Text>
      <TextInput style={styles.input} value={destLng} onChangeText={setDestLng} keyboardType="numeric" />

      <Button title="Select Truck" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }
});
