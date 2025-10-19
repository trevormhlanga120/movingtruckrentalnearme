import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BookingScreen from './screens/BookingScreen';
import PickupDeliveryScreen from './screens/PickupDeliveryScreen';
import DistanceScreen from './screens/DistanceScreen';
import MapPreviewScreen from './screens/MapPreviewScreen';
import MapPickerScreen from './screens/MapPickerScreen';
import SelectTruckScreen from './screens/SelectTruckScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

// Load leaflet CSS on web
if (typeof document !== 'undefined') {
  try {
    require('leaflet/dist/leaflet.css');
  } catch (e) {
    // ignore when leaflet not installed
  }
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
  <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="PickupDelivery" component={PickupDeliveryScreen} />
  <Stack.Screen name="Distance" component={DistanceScreen} />
  <Stack.Screen name="MapPreview" component={MapPreviewScreen} />
    <Stack.Screen name="MapPicker" component={MapPickerScreen} />
        <Stack.Screen name="SelectTruck" component={SelectTruckScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
