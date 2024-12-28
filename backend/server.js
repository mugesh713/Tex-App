// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://mugeshv22cse:mugeshv22cse@cluster0.0xbsx.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Schema and Model
const addressSchema = new mongoose.Schema({
  companyName: String,
  address: String,
  gstNumber: String,
  email: String,
});

const Address = mongoose.model('Address', addressSchema);

// Routes
app.post('/api/addresses', async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ error: 'Error saving address' });
  }
});

app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching addresses' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
