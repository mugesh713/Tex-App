  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const multer = require('multer'); // For handling file uploads
  const xlsx = require('xlsx'); // For parsing Excel files

  const app = express();
  app.use(cors());
  app.use(express.json());

  // MongoDB Atlas connection
  mongoose.connect('mongodb+srv://mugeshv22cse:mugeshv22cse@cluster0.0xbsx.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

  // Define Schema and Model
  const addressSchema = new mongoose.Schema({
    companyName: String,
    address: String,
    gstNumber: String,
    email: String,
  });

  const Address = mongoose.model('Address', addressSchema);

  // Multer setup for file uploads (in-memory storage)
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // ✅ API to manually add an address
  app.post('/api/addresses', async (req, res) => {
    try {
      const newAddress = new Address(req.body);
      const savedAddress = await newAddress.save();
      res.status(201).json(savedAddress);
    } catch (err) {
      res.status(500).json({ error: 'Error saving address' });
    }
  });

  // ✅ API to fetch all addresses
  app.get('/api/addresses', async (req, res) => {
    try {
      const addresses = await Address.find();
      res.status(200).json(addresses);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching addresses' });
    }
  });

  // ✅ API to delete an address by ID
  app.delete('/api/addresses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedAddress = await Address.findByIdAndDelete(id);

      if (!deletedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }

      res.json({ message: 'Address deleted successfully' });
    } catch (err) {
      console.error('Error deleting address:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // ✅ API to upload an Excel file and save data to MongoDB
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      

      // Read the uploaded file buffer
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Insert data into MongoDB
      const savedData = await Address.insertMany(jsonData);

      res.status(201).json({ message: 'File uploaded and data saved', data: savedData });
    } catch (err) {
      console.error('Error processing file:', err);
      res.status(500).json({ error: 'Error processing file' });
    }
  });

  // Start the server
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
