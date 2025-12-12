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

function NewsPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      formData.append('date', date.trim());
      formData.append('description1', description1.trim());
      formData.append('description2', description2.trim());
      formData.append('notification', notification);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('/api/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (notification) {
        const firebaseData = {
          topic: "news",
          data: {
            notificationType: "news",
            title: title,
            type: type,
            date: date,
            description1: description1,
            description2: description2,
            timestamp: new Date().toISOString()
          }
        };
        await axios.post("http://localhost:3000/api/firebase/send-notification", firebaseData);
      }
      toast.success("News saved successfully!", { position: "top-right" });

      // Reset form
      setTitle("");
      setType("");
      setDate("");
      setDescription1("");
      setDescription2("");
      setImageUrl("");
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
            News Management
          </Typography>
          
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Update Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                variant="outlined"
                placeholder="Enter update type (e.g., Breaking, Alert, Info)"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Description Paragraphs */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description - Paragraph 1"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Enter first paragraph..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description - Paragraph 2"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Enter second paragraph..."
              />
            </Grid>


            {/* File Upload and Save/Notification Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="file-upload-card">
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                    News Image
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
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notification}
                      onChange={(e) => setNotification(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Send Push Notification"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                  className="submit-button"
                  sx={{ py: 2, fontSize: '1.1rem' }}
                >
                  {loading ? "Saving..." : "Save News"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NewsPage;