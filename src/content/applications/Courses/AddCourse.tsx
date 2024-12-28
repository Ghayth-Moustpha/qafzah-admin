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
} from '@mui/material';
import axiosInstance from 'src/hooks/axios';
import { ICreateCourse } from './course.interface';

function AddCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teacherId, setTeacherId] = useState<number | string>(''); // Teacher selection
  const [cost, setCost] = useState<number | string>('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]); // Teachers list
  const [categories, setCategories] = useState<any[]>([]); // Categories list
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Selected categories
  const [startDate, setStartDate] = useState<Date | string>(''); // Start date field
  const [hours, setHours] = useState<number | string>(''); // Hours field

  // Fetch teachers and categories from the backend
  useEffect(() => {
    const fetchTeachersAndCategories = async () => {
      try {
        const teachersResponse = await axiosInstance.get('/teachers'); // Assuming endpoint for teachers
        const categoriesResponse = await axiosInstance.get('/categories'); // Assuming endpoint for categories
        setTeachers(teachersResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setError('Failed to fetch teachers or categories.');
      }
    };

    fetchTeachersAndCategories();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
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

    if (!imageURL) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');

    const newCourse: ICreateCourse = {
      title,
      description,
      teacherId: Number(teacherId),
      cost: cost ? Number(cost) : undefined,
      type,
      imageUrl: imageURL,
      categories: selectedCategories, // Set selected categories here
      startDate: startDate ? new Date(startDate) : new Date(), // Set the start date as needed
      hours: hours ? Number(hours) : 0, // Set the hours based on your form logic
    };

    try {
      await axiosInstance.post('/courses', newCourse);
      setSuccess('Course added successfully!');
      setTitle('');
      setDescription('');
      setTeacherId('');
      setCost('');
      setType('');
      setImageURL('');
      setPreview('');
      setSelectedCategories([]);
      setStartDate(''); // Reset startDate
      setHours(''); // Reset hours
      setLoading(false);
    } catch (submitError) {
      setError('Failed to add course.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}></Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Add New Course
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

        {/* Teacher selection */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Teacher</InputLabel>
          <Select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            label="Teacher"
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.fname + " " + teacher.lname}
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
            value={type} // type will store the selected value
            onChange={(e) => setType(e.target.value)} // Update the value on change
            label="Course Type"
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="onsite">Onsite</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>

        {/* Categories selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={(e) => {
              // Check if e.target.value is an array before mapping
              const selectedValues = Array.isArray(e.target.value)
                ? e.target.value.map((id) => Number(id)) // Convert to number[] if it's an array
                : []; // Fallback if it's not an array (this shouldn't happen for `multiple`)
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

        {/* Start Date input */}
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

        {/* Hours input */}
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
          Add Course
        </Button>
      </form>
    </Container>
  );
}

export default AddCourse;
