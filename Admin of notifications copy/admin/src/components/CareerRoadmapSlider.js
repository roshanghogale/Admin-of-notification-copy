import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";

function CareerRoadmapSlider() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await axios.get('/api/career-roadmap-sliders');
      const slidersData = response.data.careerRoadmapSliders || [];
      setSliders(slidersData);
      
      // Set existing image if there's a slider with id 1
      const mainSlider = slidersData.find(slider => slider.id === 1);
      if (mainSlider && mainSlider.image_url) {
        setExistingImage(mainSlider.image_url);
        setUrl(mainSlider.url || '');
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("URL is required.", { position: "top-right" });
      return;
    }



    setLoading(true);
    try {
      // Check if slider with id 1 exists and delete it first
      const mainSlider = sliders.find(slider => slider.id === 1);
      if (mainSlider) {
        await axios.delete(`/api/career-roadmap-sliders/${mainSlider.id}`);
      }

      const formData = new FormData();
      formData.append('url', url);
      
      if (imageFile) formData.append('image', imageFile);

      await axios.post('/api/career-roadmap-sliders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Career roadmap slider saved successfully!");

      // Reset form
      setUrl("");
      setImageFile(null);
      setExistingImage(null);
      fetchSliders();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to save slider: ${error.response?.data?.error || error.message}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    toast.info("Image selected successfully!", { position: "top-right" });
  };

  const handleDeleteExisting = () => {
    setExistingImage(null);
    setImageFile(null);
    toast.info("Existing image will be removed when you save.", { position: "top-right" });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        await axios.delete(`/api/career-roadmap-sliders/${id}`);
        toast.success('Slider deleted successfully!');
        fetchSliders();
      } catch (error) {
        toast.error('Failed to delete slider');
      }
    }
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
              Slider Image
            </Typography>
            
            {/* Show existing image if available */}
            {existingImage && !imageFile && (
              <Box sx={{ mb: 2 }}>
                <img 
                  src={`http://localhost:3000${existingImage}`} 
                  alt="Current slider" 
                  style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDeleteExisting}
                  startIcon={<Delete />}
                  fullWidth
                >
                  Remove Current Image
                </Button>
              </Box>
            )}
            
            {/* Show selected image preview */}
            {imageFile && (
              <Box sx={{ mb: 2 }}>
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Selected" 
                  style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                />
                <Typography variant="caption" color="success.main">
                  New image selected: {imageFile.name}
                </Typography>
              </Box>
            )}
            
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              hidden
              id="slider-image-upload"
            />
            <label htmlFor="slider-image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
                fullWidth
                color={imageFile ? 'success' : 'primary'}
              >
                {imageFile ? "Change Image" : (existingImage ? "Replace Image" : "Select Image")}
              </Button>
            </label>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            variant="outlined"
            placeholder="Enter URL"
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            sx={{ py: 2, fontSize: '1.1rem', height: '100%' }}
          >
            {loading ? "Saving..." : "Save Slider"}
          </Button>
        </Grid>
      </Grid>

      {/* Uploaded Slider Display */}
      {sliders.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Current Career Roadmap Slider
          </Typography>
          {sliders.slice(0, 1).map((slider) => (
            <Box key={slider.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {slider.image_url && (
                <Box sx={{ position: 'relative' }}>
                  <img 
                    src={`http://localhost:3000${slider.image_url}`} 
                    alt="Slider" 
                    style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  URL: {slider.url || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(slider.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDelete(slider.id)}
                size="small"
              >
                Delete
              </Button>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

export default CareerRoadmapSlider;