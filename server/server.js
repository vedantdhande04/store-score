const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')
const storeRoutes = require('./routes/stores'); 
const userRoutes = require('./routes/users'); 
const ownerRoutes = require('./routes/owner');

app.use(cors()); 
app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owner', ownerRoutes); 


app.get('/', (req, res) => {
  res.send('Store rating API is running!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});