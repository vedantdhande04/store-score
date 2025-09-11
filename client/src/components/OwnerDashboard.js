import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/owner/dashboard');
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); 

  if (loading) {
    return <CircularProgress />;
  }
  
  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Store Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Overall Average Rating
        </Typography>
        <Typography variant="h2" color="primary">
          {data?.averageRating} / 5
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Ratings Submitted
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell align="right">Rating Given</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.ratings.map((rating) => (
              <TableRow
                key={rating.email} 
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {rating.name}
                </TableCell>
                <TableCell>{rating.email}</TableCell>
                <TableCell>{rating.comment}</TableCell>
                <TableCell align="right">{rating.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OwnerDashboard;