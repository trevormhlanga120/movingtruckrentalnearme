import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// The map preview is intended for web via react-leaflet. We dynamically import to avoid native errors.
export default function MapPreviewScreen({ route, navigation }) {
  const { polyline, pickup, delivery, distanceKm } = route.params || {};

  const MapContent = () => {
    // render nothing if no polyline
    if (!polyline) return <Text>No route to preview</Text>;
    // The web runtime will use react-leaflet; we provide a different implementation for native if needed later
    const { MapContainer, TileLayer, Polyline } = require('react-leaflet');
    const L = require('leaflet');

    // convert polyline points (array of [lat, lng]) to leaflet latlngs
    const positions = polyline.map((p) => [p[0], p[1]]);

    return (
      <div style={{ height: '60vh' }}>
        <MapContainer center={positions[0]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={positions} color="blue" />
        </MapContainer>
      </div>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Route preview</Text>
      <Text>Pickup: {pickup}</Text>
      <Text>Delivery: {delivery}</Text>
      <Text>Distance: {distanceKm ? distanceKm.toFixed(2) + ' km' : '—'}</Text>

      <div style={{ marginTop: 12 }}>{MapContent()}</div>

      <Button title="Continue to Select Truck" onPress={() => navigation.navigate('SelectTruck', { pickup, delivery, distanceKm })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 }
});
