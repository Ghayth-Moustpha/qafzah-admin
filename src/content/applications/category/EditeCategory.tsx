import React, { useState, useEffect } from 'react';
import axiosInstance from 'src/hooks/axios';
import {
  Container,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';

function EditCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/categories/${id}`);
        const { name, description, imageURL } = response.data;
        setName(name);
        setDescription(description);
        setImageURL(imageURL);
        setLoading(false);
      } catch (fetchError) {
        setError('Failed to load category details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);
  const {API} = useAuth () ; 

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
      if (id) {
        await axiosInstance.patch(`/categories/${id}`, data);
        setSuccess('Category updated successfully!');
      } else {
        await axiosInstance.post('/categories', data);
        setSuccess('Category created successfully!');
      }

      setTimeout(() => {
        navigate('/categories');
      }, 2000);
    } catch (submitError) {
      setError('Failed to save category.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/categories/${id}`);
      setSuccess('Category deleted successfully!');
      setDeleteDialogOpen(false);
      setTimeout(() => {
        navigate('/categories');
      }, 2000);
    } catch (deleteError) {
      setError('Failed to delete category.');
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Box mt={4}></Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {id ? 'Edit Category' : 'Create New Category'}
          </Typography>
        </Grid>
      </Grid>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit}>
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
          rows={4}
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

        {preview ? (
          <Box mb={2}>
            <img
              src={preview}
              alt="Image Preview"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          </Box>
        ) : <img
        src={API+imageURL}
        alt="Image Preview"
        style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
      /> }

        {loading && <CircularProgress />}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
        >
          {id ? 'Update Category' : 'Create Category'}
        </Button>
      </form>

      {id && (
        <Box mt={4}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Category
          </Button>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EditCategory;
