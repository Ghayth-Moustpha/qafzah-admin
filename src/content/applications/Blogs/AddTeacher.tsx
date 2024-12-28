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
import axiosInstance from 'src/hooks/axios';

function AddTeacher() {
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
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
      email,
      fname,
      lname,
      password,
      Bio: bio,
      title,
      image: imageURL,
    };

    try {
      await axiosInstance.post('/teachers', data);
      setSuccess('Teacher added successfully!');
      setEmail('');
      setFname('');
      setLname('');
      setPassword('');
      setBio('');
      setTitle('');
      setImageURL('');
      setPreview('');
      setLoading(false);
    } catch (submitError) {
      setError('Failed to add teacher.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}></Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Add New Teacher
          </Typography>
        </Grid>
      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Bio"
          multiline
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

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
          Add Teacher
        </Button>
      </form>
    </Container>
  );
}

export default AddTeacher;
