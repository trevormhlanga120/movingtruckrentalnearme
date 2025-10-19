require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const BOOKING_FILE = path.join(__dirname, 'bookings.json');
function readDB() {
  try {
    const raw = fs.readFileSync(BOOKING_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { bookings: [], lastId: 0 };
  }
}

function writeDB(data) {
  fs.writeFileSync(BOOKING_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/api/bookings', async (req, res) => {
  const { name, phone, truck, pickup, delivery, distance, helpers, total } = req.body;
  if (!name || !phone || !truck) return res.status(400).json({ error: 'Missing required fields' });

  const dbData = readDB();
  const id = (dbData.lastId || 0) + 1;
  const booking = { id, name, phone, truck, pickup, delivery, distance: distance || 0, helpers: helpers || 0, total: total || 0, created_at: new Date().toISOString() };
  dbData.bookings.push(booking);
  dbData.lastId = id;
  writeDB(dbData);

  // send email if SMTP configured
  if (process.env.SMTP_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        to: process.env.EMAIL_TO || process.env.SMTP_USER,
        subject: `New booking #${id}`,
        text: `Name: ${name}\nPhone: ${phone}\nTruck: ${truck}\nPickup: ${pickup}\nDelivery: ${delivery}\nDistance: ${distance}\nHelpers: ${helpers}\nTotal: ${total}`
      });
    } catch (e) {
      console.warn('Failed to send email', e);
    }
  }

  res.json({ success: true, id });
});

// optional directions proxy
app.get('/api/directions', async (req, res) => {
  const { origin, destination } = req.query;
  if (!process.env.GOOGLE_API_KEY) return res.status(400).json({ error: 'GOOGLE_API_KEY not configured' });
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${process.env.GOOGLE_API_KEY}`;
  try {
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// simple health check for phone/browser
app.get('/', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server listening on ${port} (root / responds with JSON)`));
