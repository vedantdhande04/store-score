import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Modal,
  Slider,
  CircularProgress
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

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [open, setOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/stores?search=${searchTerm}`);
      setStores(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch stores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchStores();
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenModal = (store) => {
    setSelectedStore(store);
    setRating(store.userSubmittedRating || 3); 
    setComment(store.userSubmittedComment || '');
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedStore(null);
    setComment(''); 
  };

  const handleRatingSubmit = async () => {
    try {
      await api.post(`/stores/${selectedStore.id}/rate`, { rating , comment});
      handleCloseModal();
      fetchStores(); 
    } catch (err) {
      console.error(err);
      
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  
  if (error) {
      return <Typography color="error">{error}</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stores
      </Typography>
      <TextField
        fullWidth
        label="Search for stores by name or address"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {stores.map((store) => (
          <Card key={store.id} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                {store.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {store.address}
              </Typography>
              <Typography variant="body2">
                Overall Rating: {parseFloat(store.overallRating).toFixed(1)} / 5
              </Typography>
              <Typography variant="body2" sx={{ color: store.userSubmittedRating ? 'primary.main' : 'text.secondary' }}>
                Your Rating: {store.userSubmittedRating || 'Not Rated'}
              </Typography>
              {store.userSubmittedComment && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                  Your Comment: "{store.userSubmittedComment}"
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleOpenModal(store)}>
                {store.userSubmittedRating ? 'Update Rating' : 'Rate Store'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Rating Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rate {selectedStore?.name}
          </Typography>
          <Slider
            aria-label="Rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
          />
          <TextField
            label="Leave a comment (optional)"
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Button onClick={handleRatingSubmit} variant="contained">Submit</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserDashboard;