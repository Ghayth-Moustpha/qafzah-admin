import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // React Quill styles
import axiosInstance from 'src/hooks/axios';

// Add alignment module to Quill
const Align = Quill.import('formats/align');
Align.whitelist = ['left', 'center', 'right', 'justify'];
Quill.register(Align, true);

function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // For rich text content
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  const handleSubmit = async (event: React.FormEvent) => {
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
      imageURL,
    };

    try {
      await axiosInstance.post('/blogs', data);
      setSuccess('Blog post added successfully!');
      setTitle('');
      setContent('');
      setImageURL('');
      setPreview('');
      setLoading(false);
    } catch (submitError) {
      setError('Failed to add blog post.');
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
      <Box mt={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Add New Blog Post
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
                toolbar: toolbarOptions,
              }}
              style={{
                height: '500px',
                marginBottom: '20px',
              }}
            />
          </Box>

          <Box mt={8} mb={2}>
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

          <Button fullWidth type="submit" variant="contained" color="primary">
            Add Post
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddBlog;
