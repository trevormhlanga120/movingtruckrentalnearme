import React, { useMemo } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { calculateDistanceKm } from '../utils/distance';
import axios from 'axios';

function parseLatLng(input) {
  if (!input || typeof input !== 'string') return null;
  const parts = input.split(',').map((s) => s.trim());
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

export default function DistanceScreen({ navigation, route }) {
  const { pickup, delivery } = route.params;

  const parsedPickup = parseLatLng(pickup);
  const parsedDelivery = parseLatLng(delivery);

  // If both are coordinate-like we can calculate; otherwise distance is unknown (would need geocoding)
  const distanceKm = useMemo(() => {
    if (parsedPickup && parsedDelivery) {
      return calculateDistanceKm(parsedPickup.lat, parsedPickup.lng, parsedDelivery.lat, parsedDelivery.lng);
    }
    return null;
  }, [parsedPickup, parsedDelivery]);

  const onChooseTruck = () => {
    navigation.navigate('SelectTruck', { pickup, delivery, distanceKm });
  };

  const onDrivingDistance = async () => {
    // call server /api/directions?origin=..&destination=..
    try {
  const { API_BASE } = require('../config');
  const resp = await axios.get(`${API_BASE}/api/directions`, { params: { origin: pickup, destination: delivery } });
      if (resp.data && resp.data.routes && resp.data.routes.length) {
        const route = resp.data.routes[0];
        const legs = route.legs;
        let meters = 0;
        for (const leg of legs) meters += leg.distance.value;
        const km = meters / 1000;
        // if an overview_polyline exists, decode and show map preview first
        const overview = route.overview_polyline && route.overview_polyline.points;
        if (overview) {
          const { decodePolyline } = require('../utils/polylineDecode');
          const points = decodePolyline(overview);
          navigation.navigate('MapPreview', { pickup, delivery, distanceKm: km, polyline: points });
          return;
        }
        navigation.navigate('SelectTruck', { pickup, delivery, distanceKm: km });
        return;
      }
      Alert.alert('No route', 'Could not get driving route from server');
    } catch (e) {
      console.warn('Driving distance failed', e.message || e);
      Alert.alert('Error', 'Driving distance lookup failed. Ensure server has GOOGLE_API_KEY set.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distance</Text>
      <Text>Pickup: {pickup}</Text>
      <Text>Delivery: {delivery}</Text>

      {distanceKm === null ? (
        <Text style={styles.warn}>Could not parse coordinates. Enter coordinates as "lat,lng" to auto-calc distance, or proceed to enter distance manually in the next screen.</Text>
      ) : (
        <Text style={styles.distance}>Distance: {distanceKm.toFixed(2)} km</Text>
      )}

      <Button title="Choose Truck" onPress={onChooseTruck} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  warn: { color: '#b35000', marginVertical: 12 },
  distance: { fontSize: 18, fontWeight: '600', marginVertical: 12 }
});
