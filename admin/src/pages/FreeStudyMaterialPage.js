import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function FreeStudyMaterialPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);

  // File states
  const [imageFile, setImageFile] = useState(null);

  // Preview states
  const [imagePreview, setImagePreview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.", { position: "top-right" });
      return;
    }

    if (!type) {
      toast.error("Type is required.", { position: "top-right" });
      return;
    }

    if (!imageFile) {
      toast.error("Study Material Image is required.", { position: "top-right" });
      return;
    }

    if (!pdfUrl.trim()) {
      toast.error("Study Material PDF URL is required.", { position: "top-right" });
      return;
    }

    if (!notification) {
      toast.warn(
        "Notification checkbox is not checked. The notification will not be sent.",
        { position: "top-right" }
      );
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('type', type);
      formData.append('notification', notification);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (pdfUrl.trim()) {
        formData.append('pdfUrl', pdfUrl.trim());
      }

      const response = await axios.post('/api/study-materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const documentId = response.data.studyMaterial?.id;
      
      toast.success("Free Study Material saved successfully!", { position: "top-right" });

      // Reset form
      setTitle("");
      setType("");
      setImageUrl("");
      setPdfUrl("");
      setImageFile(null);
      setImagePreview("");
      setNotification(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "An error occurred", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.info("Image selected successfully!", { position: "top-right" });
    }
  };



  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <ToastContainer />
      <Card elevation={3} className="form-card">
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" className="page-title" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Free Study Material Management
          </Typography>
          
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type *</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type *"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="governmentfree">Government</MenuItem>
                  <MenuItem value="policefree">Police & Defence</MenuItem>
                  <MenuItem value="bankingfree">Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* File Uploads Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="file-upload-card">
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                    Study Material Image *
                  </Typography>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Select Image
                    </Button>
                  </label>
                </Box>
                {imagePreview && (
                  <Box sx={{ mt: 1 }}>
                    <img src={imagePreview} alt="Image preview" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Study Material PDF URL *"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                variant="outlined"
                placeholder="https://..."
                type="url"
              />
            </Grid>

            {/* Checkbox and Submit Button Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '56px', display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notification}
                      onChange={(e) => setNotification(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Send Push Notification"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
                className="submit-button"
                sx={{ py: 2, fontSize: '1.1rem', height: '56px' }}
              >
                {loading ? "Saving..." : "Save Free Study Material"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FreeStudyMaterialPage;