import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import axiosInstance from 'src/hooks/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';

function EditCourse() {
  const {API} = useAuth() ; 
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teacherId, setTeacherId] = useState<number | string>('');
  const [cost, setCost] = useState<number | string>('');
  const [type, setType] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | string>('');
  const [hours, setHours] = useState<number | string>('');
  const [deleteDialogOpen,setDeleteDialogOpen] = useState(false) ;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/courses/${id}`);
      setSuccess('Teacher deleted successfully!');
      setDeleteDialogOpen(false);
      setTimeout(() => {
        navigate('/courses');
      }, 2000);
    } catch (deleteError) {
      setError('Failed to delete teacher.');
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseResponse = await axiosInstance.get(`/courses/${id}`);
        const teachersResponse = await axiosInstance.get('/teachers');
        const categoriesResponse = await axiosInstance.get('/categories');

        const {
          title,
          description,
          teacherId,
          cost,
          type,
          imageUrl,
          categories: courseCategories,
          startDate,
          hours,
        } = courseResponse.data;

        setTitle(title);
        setDescription(description);
        setTeacherId(teacherId);
        setCost(cost);
        setType(type);
        setImageURL(imageUrl);
        setSelectedCategories(courseCategories);
        setStartDate(startDate);
        setHours(hours);

        setTeachers(teachersResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (fetchError) {
        setError('Failed to fetch course details.');
        setLoading(false);
      }
    };

    fetchData();
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

    const updatedCourse = {
      title,
      description,
      teacherId: Number(teacherId),
      cost: cost ? Number(cost) : undefined,
      type,
      imageUrl: imageURL,
      categories: selectedCategories,
      startDate: startDate ? new Date(startDate) : new Date(),
      hours: hours ? Number(hours) : 0,
    };

    try {
      await axiosInstance.put(`/courses/${id}`, updatedCourse);
      setSuccess('Course updated successfully!');
      setLoading(false);
      navigate('/courses');
    } catch (submitError) {
      setError('Failed to update course.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}></Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Edit Course
          </Typography>
        </Grid>
      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {loading && <CircularProgress />}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Teacher</InputLabel>
          <Select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            label="Teacher"
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.fname + ' ' + teacher.lname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Course Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Course Type"
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="onsite">Onsite</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={(e) => {
              const selectedValues = Array.isArray(e.target.value)
                ? e.target.value.map((id) => Number(id))
                : [];
              setSelectedCategories(selectedValues);
            }}
            label="Categories"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Hours"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
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
          {id ? 'Update Course' : 'Add Course'}
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
            Delete Course
          </Button>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Course </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Course ? This action cannot be undone.
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

export default EditCourse;
