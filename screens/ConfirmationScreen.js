import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ConfirmationScreen({ route, navigation }) {
  const { truck, distanceKm, amount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmation</Text>
      <Text>Truck: {truck.name}</Text>
      <Text>Distance: {distanceKm.toFixed(2)} km</Text>
      <Text style={styles.amount}>Total: ${amount.toFixed(2)}</Text>
      <Button title="Finish" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  amount: { fontSize: 18, fontWeight: '700', marginVertical: 12 }
});
