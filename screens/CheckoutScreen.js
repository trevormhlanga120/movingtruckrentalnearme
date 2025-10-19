import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Linking } from 'react-native';
import { OWNER_EMAIL } from '../config';
import { Platform } from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

export default function CheckoutScreen({ route, navigation }) {
  const { truck, pickup, delivery, distanceKm, helpers, total } = route.params;
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('FNB Bank Transfer');

  function sendOrder() {
    const subject = encodeURIComponent('New delivery booking');
    const body = encodeURIComponent(
      `Name: ${customerName}\nPhone: ${phone}\nTruck: ${truck.name}\nPickup: ${pickup}\nDelivery: ${delivery}\nDistance: ${distanceKm} km\nHelpers: ${helpers}\nTotal: ZAR ${total.toFixed(2)}\nPayment method: ${paymentMethod}`
    );
    // Try server POST first (axios)
  const { API_BASE } = require('../config');
  const serverUrl = `${API_BASE}/api/bookings`;
  axios.post(serverUrl, { name: customerName, phone, truck: truck.name, pickup, delivery, distance: distanceKm, helpers, total })
      .then(() => {
        navigation.navigate('Confirmation', { truck, distanceKm, amount: total });
      })
      .catch(() => {
        // fallback to mailto
        const mailto = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
        Linking.openURL(mailto)
          .then(() => navigation.navigate('Confirmation', { truck, distanceKm, amount: total }))
          .catch((e) => {
            console.warn('Could not open email client', e);
            navigation.navigate('Confirmation', { truck, distanceKm, amount: total });
          });
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text>Truck: {truck.name}</Text>
      <Text>Distance: {distanceKm} km</Text>
      <Text>Helpers: {helpers}</Text>
      <Text style={styles.total}>Total: ZAR {total.toFixed(2)}</Text>

      <TextInput style={styles.input} placeholder="Your full name" value={customerName} onChangeText={setCustomerName} />
      <TextInput style={styles.input} placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={{ marginTop: 8 }}>Payment method</Text>
      <Text>{paymentMethod}</Text>

      <Animatable.View animation="pulse" iterationCount={1} duration={800} style={{ marginTop: 12 }}>
        <Button title="Send booking to company (email)" onPress={sendOrder} />
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
  total: { fontSize: 18, fontWeight: '700', marginVertical: 12 }
});
