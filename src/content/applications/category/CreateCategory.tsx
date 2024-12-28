import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Grid
} from '@mui/material';
import axiosInstance from 'src/hooks/axios';

function CreateCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/files/upload', formData);
      setImageURL(response.data.filePath);

      setLoading(false);
    } catch (uploadError) {
      setError('Failed to upload image.');
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageURL) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');

    const data = {
      name,
      description,
      imageURL
    };

    try {
      await axiosInstance.post('/categories', data);
      setSuccess('Category created successfully!');
      setName('');
      setDescription('');
      setImageURL('');
      setPreview('');
      setLoading(false);
    } catch (submitError) {
      setError('Failed to create category.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" >
         <Box mt={4}></Box> 
     <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
         </Typography>
       
      </Grid>
      <Grid item>
        
      </Grid>
    </Grid>
    
      <Typography variant="h4" gutterBottom >
        Create New Category
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit} >
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box mt={2} mb={2}>
          <Button
            variant="contained"
            component="label"
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Box>

        {preview && (
          <Box mb={2}>
            <img
              src={preview}
              alt="Image Preview"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          </Box>
        )}

        {loading && <CircularProgress />}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          
        >
          Create Category
        </Button>
      </form>
    </Container>
  );
}

export default CreateCategoryPage;
