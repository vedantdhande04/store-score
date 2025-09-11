import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
  Box, Typography, Paper, Grid, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AdminDashboard = () => {
 
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const [userModalOpen, setUserModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  
  
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  const [newStoreData, setNewStoreData] = useState({ name: '', address: '', owner_id: '' });

  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/stores')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      setError('Failed to fetch admin data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  
  const handleUserFormChange = (e) => setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUserData);
      setUserModalOpen(false);
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert('Failed to add user.'); // Simple error handling
    }
  };

  
  const handleStoreFormChange = (e) => setNewStoreData({ ...newStoreData, [e.target.name]: e.target.value });
  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', newStoreData);
      setStoreModalOpen(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
      alert('Failed to add store. Make sure the Owner ID is valid.');
    }
  };


  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Total Users</Typography><Typography variant="h4">{stats?.totalUsers}</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Total Stores</Typography><Typography variant="h4">{stats?.totalStores}</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Total Ratings</Typography><Typography variant="h4">{stats?.totalRatings}</Typography></Paper></Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setUserModalOpen(true)} sx={{ mr: 2 }}>Add New User</Button>
        <Button variant="contained" onClick={() => setStoreModalOpen(true)}>Add New Store</Button>
      </Box>

      {/* Users Table */}
      <Typography variant="h5" gutterBottom>Users</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Address</TableCell><TableCell>Role</TableCell></TableRow></TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}><TableCell>{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.address}</TableCell><TableCell>{user.role}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stores Table */}
      <Typography variant="h5" gutterBottom>Stores</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Address</TableCell><TableCell>Owner Email</TableCell><TableCell align="right">Avg. Rating</TableCell></TableRow></TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}><TableCell>{store.name}</TableCell><TableCell>{store.address}</TableCell><TableCell>{store.owner_email}</TableCell><TableCell align="right">{parseFloat(store.average_rating).toFixed(1)}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {}
      <Modal open={userModalOpen} onClose={() => setUserModalOpen(false)}>
        <Box sx={style} component="form" onSubmit={handleAddUser}>
          <Typography variant="h6">Add New User</Typography>
          <TextField name="name" label="Name" fullWidth required margin="normal" onChange={handleUserFormChange} />
          <TextField name="email" label="Email" type="email" fullWidth required margin="normal" onChange={handleUserFormChange} />
          <TextField name="password" label="Password" type="password" fullWidth required margin="normal" onChange={handleUserFormChange} />
          <TextField name="address" label="Address" fullWidth required margin="normal" onChange={handleUserFormChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={newUserData.role} label="Role" onChange={handleUserFormChange}>
              <MenuItem value="Normal User">Normal User</MenuItem>
              <MenuItem value="Store Owner">Store Owner</MenuItem>
              <MenuItem value="System Administrator">System Administrator</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create User</Button>
        </Box>
      </Modal>

      {}
      <Modal open={storeModalOpen} onClose={() => setStoreModalOpen(false)}>
        <Box sx={style} component="form" onSubmit={handleAddStore}>
          <Typography variant="h6">Add New Store</Typography>
          <TextField name="name" label="Store Name" fullWidth required margin="normal" onChange={handleStoreFormChange} />
          <TextField name="address" label="Address" fullWidth required margin="normal" onChange={handleStoreFormChange} />
          <TextField name="owner_id" label="Owner ID" type="number" fullWidth required margin="normal" onChange={handleStoreFormChange} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create Store</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;