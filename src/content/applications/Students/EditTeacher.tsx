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

function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();

  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/teachers/${id}`);
        const { email, fname, lname, password, bio, title, image } = response.data;
        setEmail(email);
        setFname(fname);
        setLname(lname);
        setPassword(password);
        setBio(bio);
        setTitle(title);
        setImageURL(image);
        setLoading(false);
      } catch (fetchError) {
        setError('Failed to load teacher details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacher();
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
      bio,
      title,
      imageURL
    };

    try {
      if (id) {
        await axiosInstance.patch(`/teachers/${id}`, data);
        setSuccess('Teacher updated successfully!');
      } else {
        await axiosInstance.post('/teachers', data);
        setSuccess('Teacher added successfully!');
      }

      setTimeout(() => {
        navigate('/teachers');
      }, 2000);
    } catch (submitError) {
      setError('Failed to save teacher.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/teachers/${id}`);
      setSuccess('Teacher deleted successfully!');
      setDeleteDialogOpen(false);
      setTimeout(() => {
        navigate('/teachers');
      }, 2000);
    } catch (deleteError) {
      setError('Failed to delete teacher.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}></Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {id ? 'Edit Teacher' : 'Add New Teacher'}
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
          {id ? 'Update Teacher' : 'Add Teacher'}
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
            Delete Teacher
          </Button>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Teacher</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this teacher? This action cannot be undone.
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

export default EditTeacher;
