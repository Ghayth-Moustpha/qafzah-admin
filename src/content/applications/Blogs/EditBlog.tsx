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
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Add alignment module to Quill
const Align = Quill.import('formats/align');
Align.whitelist = ['left', 'center', 'right', 'justify'];
Quill.register(Align, true);

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // For rich text content
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/blogs/${id}`);
        const { title, content, image } = response.data;
        setTitle(title);
        setContent(content);
        setImageURL(image);
        setLoading(false);
      } catch (fetchError) {
        setError('Failed to load blog details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

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

    if (!imageURL || !title || !content) {
      setError('Please fill in all required fields and upload an image.');
      return;
    }

    setLoading(true);
    setError('');

    const data = {
      title,
      content,
      imageURL
    };

    try {
      if (id) {
        await axiosInstance.patch(`/blogs/${id}`, data);
        setSuccess('Blog updated successfully!');
      } else {
        await axiosInstance.post('/blogs', data);
        setSuccess('Blog added successfully!');
      }

      setTimeout(() => {
        navigate('/blogs');
      }, 2000);
    } catch (submitError) {
      setError('Failed to save blog.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      setSuccess('Blog deleted successfully!');
      setDeleteDialogOpen(false);
      setTimeout(() => {
        navigate('/blogs');
      }, 2000);
    } catch (deleteError) {
      setError('Failed to delete blog.');
      setLoading(false);
    }
  };

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // Text styles
    [{ list: 'ordered' }, { list: 'bullet' }], // Lists
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }], // Alignment
    ['link', 'image'], // Links and images
    [{ direction: 'rtl' }], // Right-to-left direction for Arabic
    ['clean'], // Remove formatting
  ];

  return (
    <Container maxWidth="sm">
      <Box mt={4}></Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {id ? 'Edit Blog' : 'Add New Blog'}
          </Typography>
        </Grid>
      </Grid>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Content
          </Typography>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            modules={{
              toolbar: toolbarOptions
            }}
            style={{ height: '300px', marginBottom: '20px' }}
          />
        </Box>

        <Box mt={2} mb={2}>
          <Button variant="contained" component="label">
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
        ) : (
          <img
            src={API + imageURL}
            alt="Image Preview"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
          />
        )}

        {loading && <CircularProgress />}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
        >
          {id ? 'Update Blog' : 'Add Blog'}
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
            Delete Blog
          </Button>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog? This action cannot be undone.
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

export default EditBlog;
