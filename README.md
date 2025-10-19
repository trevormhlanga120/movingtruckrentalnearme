MovingTruckRentalNearMe (React Native - Expo)

This is a minimal scaffold demonstrating a booking flow:
- Enter origin and destination coordinates
- Select a truck
- Calculates distance using Haversine formula and total fare

Run (requires Node.js and Expo CLI or use `npx expo`):

1. Install dependencies

```bash
cd truck_delivery_app
npm install
```

2. Start Metro / Expo

```bash
npm start
# or
npx expo start
```

Notes:
- This scaffold uses static coordinate inputs for simplicity. Replace with map/autocomplete for production.
- Update `package.json` versions to match your environment's Expo/React Native versions.

Server (optional): a minimal Express server is provided to persist bookings and send notification emails.

1. Run server

```bash
cd server
npm install
cp .env.example .env
# edit .env to add SMTP and/or GOOGLE_API_KEY if you want directions
npm start
```

2. When server is running on http://localhost:3333 the app will POST bookings to `/api/bookings`. If the server is not reachable the app will fall back to opening the user's mail client with a `mailto:` containing booking details.

Driving distance (Google Directions)
- To enable driving distance lookups, add a Google API key with the Directions API enabled to `server/.env` as `GOOGLE_API_KEY`.
- The app will send the `pickup` and `delivery` values as `origin` and `destination`. These can be either address strings (e.g., "123 Main St, City") or `lat,lng` coordinate pairs (e.g., "26.2041,28.0473").
- If the server returns a valid route the app will use the driving distance (in km) for pricing. If the server is not configured or the request fails the app falls back to straight-line Haversine distance (if coordinates were provided) or manual distance entry.

Map preview (web)
- The web app can preview the driving route using `react-leaflet` and `leaflet`.
- Install the dependencies in the client:

```bash
cd /home/trevor/uz_dining_app/truck_delivery_app
npm install react-leaflet leaflet
```

- Leaflet requires CSS to be loaded. For Expo web add the CSS import at the top of `App.js` or in your web entrypoint:

```js
import 'leaflet/dist/leaflet.css';
```

- Once installed, when you request driving directions the app will show a route preview screen with the polyline rendered on OpenStreetMap tiles.

Place search on the map (Africa-only)
- The Map picker uses OpenStreetMap Nominatim to search for places and is constrained to an Africa bounding box so results are limited to African locations. This avoids the need for paid APIs and works well for country-level searching across Africa.
- You can type a place name (e.g., "Nairobi", "Cape Town") in the Map picker search box and select a result — the app will set pickup/delivery markers and compute driving/straight-line distance as usual.
