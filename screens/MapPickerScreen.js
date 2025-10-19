import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';

// MapPicker is implemented for web (react-leaflet). Native apps will see a fallback message.
export default function MapPickerScreen({ navigation }) {
  const [markers, setMarkers] = useState([]); // [{lat,lng}]

  useEffect(() => {
    // no-op
  }, []);

  const onMapClick = (latlng) => {
    if (markers.length >= 2) setMarkers([latlng]);
    else setMarkers([...markers, latlng]);
  };

  const onUse = async () => {
    if (markers.length < 2) return Alert.alert('Select both pickup and delivery', 'Click on the map to set pickup (first) and delivery (second) markers.');
    const pickup = `${markers[0][0]},${markers[0][1]}`;
    const delivery = `${markers[1][0]},${markers[1][1]}`;

    // Try driving distance via server
    try {
      const axios = require('axios');
  const { API_BASE } = require('../config');
  const resp = await axios.get(`${API_BASE}/api/directions`, { params: { origin: pickup, destination: delivery } });
      if (resp.data && resp.data.routes && resp.data.routes.length) {
        const route = resp.data.routes[0];
        let meters = 0;
        for (const leg of route.legs) meters += leg.distance.value;
        const km = meters / 1000;
        // decode polyline if available
        const overview = route.overview_polyline && route.overview_polyline.points;
        let points = null;
        if (overview) {
          const { decodePolyline } = require('../utils/polylineDecode');
          points = decodePolyline(overview);
        }
        // navigate directly to SelectTruck with distance
        navigation.navigate('SelectTruck', { pickup, delivery, distanceKm: km, polyline: points });
        return;
      }
      Alert.alert('No route found', 'Server returned no route. Falling back to straight-line distance.');
    } catch (e) {
      console.warn('Driving lookup failed', e.message || e);
      // continue to fallback
    }

    // fallback: compute straight-line distance using utils
    try {
      const { calculateDistanceKm } = require('../utils/distance');
      const p = markers[0];
      const d = markers[1];
      const km = calculateDistanceKm(p[0], p[1], d[0], d[1]);
      navigation.navigate('SelectTruck', { pickup, delivery, distanceKm: km });
    } catch (e) {
      Alert.alert('Error', 'Could not calculate distance.');
    }
  };

  // Web render uses react-leaflet; native shows a message
  if (typeof document !== 'undefined') {
    const ReactLeaflet = require('react-leaflet');
    const { MapContainer, TileLayer, Marker, useMapEvents, Popup, Polyline } = ReactLeaflet;
    const L = require('leaflet');

    // Africa bounding box: west, north, east, south for Nominatim viewbox (left,top,right,bottom)
    const AFRICA_VIEWBOX = { west: -25.0, north: 38.0, east: 60.0, south: -35.0 };

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    async function searchPlaces() {
      if (!query || query.trim().length < 2) return setResults([]);
      const q = encodeURIComponent(query.trim());
      const vb = `${AFRICA_VIEWBOX.west},${AFRICA_VIEWBOX.north},${AFRICA_VIEWBOX.east},${AFRICA_VIEWBOX.south}`;
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=6&viewbox=${vb}&bounded=1`;
      try {
        const r = await fetch(url, { headers: { 'User-Agent': 'movingtruck-app/1.0 (trevor)', Accept: 'application/json' } });
        const j = await r.json();
        // map relevant fields
        setResults(j.map((it) => ({ display_name: it.display_name, lat: parseFloat(it.lat), lon: parseFloat(it.lon) })));
      } catch (e) {
        console.warn('Place search failed', e);
        setResults([]);
      }
    }

    // small marker component to capture clicks
    function ClickMap() {
      useMapEvents({
        click(e) { onMapClick([e.latlng.lat, e.latlng.lng]); }
      });
      return null;
    }

    // helper to select a place result
    function onSelectResult(item) {
      const latlng = [item.lat, item.lon];
      // if no markers yet, add pickup; if one exists add delivery; if two, replace delivery
      if (markers.length === 0) setMarkers([latlng]);
      else if (markers.length === 1) setMarkers([markers[0], latlng]);
      else setMarkers([markers[0], latlng]);
    }

    const positions = markers.map((m) => [m[0], m[1]]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pick pickup and delivery on the map</Text>
        <View style={{ width: '100%', marginBottom: 8 }}>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search place in Africa (e.g. Nairobi, Cape Town)" style={styles.searchInput} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={searchPlaces} style={styles.searchBtn}><Text style={{ color: '#fff' }}>Search</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }} style={[styles.searchBtn, { backgroundColor: '#777' }]}><Text style={{ color: '#fff' }}>Clear</Text></TouchableOpacity>
          </View>
          {results.length > 0 && (
            <ScrollView style={styles.results}>
              {results.map((r, i) => (
                <TouchableOpacity key={i} onPress={() => onSelectResult(r)} style={styles.resultItem}>
                  <Text>{r.display_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        <div style={{ height: '60vh', width: '100%' }}>
          <MapContainer center={positions[0] || [26.2041, 28.0473]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickMap />
            {positions.map((pos, i) => (
              <Marker key={i} position={pos}>
                <Popup>{i === 0 ? 'Pickup' : 'Delivery'}</Popup>
              </Marker>
            ))}
            {positions.length === 2 && <Polyline positions={positions} color="blue" />}
          </MapContainer>
        </div>

        <View style={{ marginTop: 12 }}>
          <Button title="Use these locations" onPress={onUse} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map picker is available in web builds only.</Text>
      <Text>Use the address fields or enter coordinates instead.</Text>
      <View style={{ marginTop: 12 }}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 }
  ,
  searchInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 6 },
  searchBtn: { backgroundColor: '#1e90ff', padding: 8, borderRadius: 6, marginRight: 8 },
  results: { maxHeight: 140, borderWidth: 1, borderColor: '#eee', marginTop: 6, marginBottom: 6, padding: 6 },
  resultItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' }
});
