import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Switch } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { PRICE_PER_KM, HELPER_PRICE } from '../config';
const TRUCKS = [
  { id: 't1', name: '4 ton', capacity: '4t' },
  { id: 't2', name: '5 ton', capacity: '5t' },
  { id: 't3', name: '8 ton', capacity: '8t' },
  { id: 't4', name: '10 ton', capacity: '10t' },
  { id: 't5', name: '12 ton', capacity: '12t' }
];

export default function SelectTruckScreen({ route, navigation }) {
  const { pickup, delivery, distanceKm } = route.params;
  const [manualDistance, setManualDistance] = useState(distanceKm ? distanceKm.toFixed(2) : '');
  const [helpersEnabled, setHelpersEnabled] = useState(false);
  const [helpersCount, setHelpersCount] = useState('0');

  function getDistanceNumber() {
    const v = parseFloat(manualDistance);
    if (Number.isNaN(v) || v < 0) return 0;
    return v;
  }

  const onSelect = (truck) => {
    const d = getDistanceNumber();
    const baseAmount = PRICE_PER_KM * d;
    const helpers = helpersEnabled ? Math.max(0, parseInt(helpersCount, 10) || 0) : 0;
    const helpersAmount = helpers * HELPER_PRICE;
    const total = baseAmount + helpersAmount;

    navigation.navigate('Checkout', {
      truck,
      pickup,
      delivery,
      distanceKm: d,
      helpers,
      total
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Truck & Options</Text>
      <Text>Distance (km) detected: {distanceKm ? distanceKm.toFixed(2) : '—'}</Text>

      <Text style={{ marginTop: 12 }}>Distance to use (you can edit):</Text>
      <TextInput
        style={styles.input}
        value={manualDistance}
        onChangeText={setManualDistance}
        keyboardType="numeric"
        placeholder="Distance in km"
      />

      <View style={styles.helperRow}>
        <Text>Add helpers (250 ZAR each)</Text>
        <Switch value={helpersEnabled} onValueChange={setHelpersEnabled} />
      </View>

      {helpersEnabled && (
        <View>
          <Text>Number of helpers</Text>
          <TextInput style={styles.input} value={helpersCount} onChangeText={setHelpersCount} keyboardType="numeric" />
        </View>
      )}

      <FlatList
        data={TRUCKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.truckName}>{item.name}</Text>
            <Text>Capacity: {item.capacity}</Text>
            <Text>Estimated transport cost: ZAR { (PRICE_PER_KM * getDistanceNumber()).toFixed(2) }</Text>
            <Animatable.View animation="fadeInUp" duration={500}>
              <Button title="Select" onPress={() => onSelect(item)} />
            </Animatable.View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  truckName: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }
});
