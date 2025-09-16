require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const mongoose = require('mongoose');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow common local dev and LAN origins
    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
      /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$/,
    ];
    if (!origin) return callback(null, true);
    if (allowedPatterns.some((re) => re.test(origin))) return callback(null, true);
    // For demos, allow other origins as well. If you want to restrict, replace next line with an error callback
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
}));

// Handle preflight
// Explicit OPTIONS handler not required; cors() above handles preflight

// =================== SCHEMAS ===================

// Camp Schema
const campSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  state: { type: String, required: true, default: 'Karnataka' },
  district: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  type: { type: String, required: true },
  contact: { type: String },
  status: { type: String, default: 'upcoming' },
  createdAt: { type: Date, default: Date.now },
  cancerTypes: [{ type: String }],
});
const Camp = mongoose.model('Camp', campSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  state: { type: String, required: true },
  district: { type: String, required: true },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camp', required: true },
  campName: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Confirmed' }
});
const Booking = mongoose.model('Booking', bookingSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// =================== ROUTES ===================

// Camps
app.post('/camps', async (req, res) => {
  try {
    console.log('POST /camps body:', req.body);
    const camp = new Camp(req.body);
    const savedCamp = await camp.save();
    res.status(201).json(savedCamp);
  } catch (err) {
    console.error('Error saving camp:', err);
    res.status(400).json({ error: err.message, details: err });
  }
});

app.get('/camps', async (req, res) => {
  try {
    const camps = await Camp.find().sort({ date: 1 });
    res.json(camps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/camps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Camp.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Camp not found' });
    res.json({ message: 'Camp deleted', id });
  } catch (err) {
    console.error('Error deleting camp:', err);
    res.status(500).json({ error: 'Failed to delete camp' });
  }
});

// Bookings
app.post('/bookings', async (req, res) => {
  try {
    console.log('POST /bookings body:', req.body);
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(400).json({ error: err.message, details: err });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('campId');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted', id });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Users
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'Registration successful', user: { name, email } });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed', details: err });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email, password });
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Login failed', details: err });
  }
});

// ML Prediction
app.post('/predict', async (req, res) => {
  try {
    const python = process.env.PYTHON || 'python';
    const scriptPath = path.join(__dirname, 'predict.py');
    const py = spawn(python, [scriptPath]);

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => stdout += data.toString());
    py.stderr.on('data', (data) => stderr += data.toString());

    py.on('error', (err) => {
      console.error('Failed to start python process:', err);
      res.status(500).json({ error: 'Failed to start python process', details: String(err) });
    });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('Python exited with code', code, 'stderr:', stderr);
        return res.status(500).json({ error: 'Python error', code, stderr });
      }
      try {
        const json = JSON.parse(stdout || '[]');
        res.json(json);
      } catch (e) {
        console.error('Invalid JSON from python:', stdout);
        res.status(500).json({ error: 'Invalid JSON from python', stdout });
      }
    });

    py.stdin.write(JSON.stringify(req.body || []));
    py.stdin.end();
  } catch (err) {
    console.error('Error in /predict:', err);
    res.status(400).json({ error: 'Prediction failed', details: String(err?.message || err) });
  }
});

// =================== START SERVER ===================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
