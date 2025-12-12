import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Material-UI Components
import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  FormControlLabel,
  Checkbox,
  Paper
} from "@mui/material";
import {
  PhotoCamera,
  PictureAsPdf
} from "@mui/icons-material";

function StudentUpdates() {
  const [title, setTitle] = useState("");
  const [education, setEducation] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");
  const [applicationMethod, setApplicationMethod] = useState("");
  const [description2, setDescription2] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [notificationPdfFile, setNotificationPdfFile] = useState(null);
  const [selectionPdfFile, setSelectionPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('education', education.trim());
      formData.append('ageRestriction', ageRestriction.trim());
      formData.append('applicationMethod', applicationMethod.trim());
      formData.append('description2', description2.trim());
      formData.append('applicationLink', applicationLink.trim());
      formData.append('lastDate', lastDate);
      formData.append('notification', notification);
      
      if (imageFile) formData.append('image', imageFile);
      if (notificationPdfFile) formData.append('notificationPdf', notificationPdfFile);
      if (selectionPdfFile) formData.append('selectionPdf', selectionPdfFile);

      const response = await fetch('/api/student-updates', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success(notification ? "Student update saved and notification sent!" : "Student update saved successfully!");
        setTitle("");
        setEducation("");
        setAgeRestriction("");
        setApplicationMethod("");
        setDescription2("");
        setApplicationLink("");
        setLastDate("");
        setImageFile(null);
        setNotificationPdfFile(null);
        setSelectionPdfFile(null);
        setNotification(false);
      } else {
        throw new Error('Failed to save student update');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save student update");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleNotificationPdfChange = (e) => {
    setNotificationPdfFile(e.target.files[0]);
  };

  const handleSelectionPdfChange = (e) => {
    setSelectionPdfFile(e.target.files[0]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Card elevation={3} className="modern-card">
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Student Updates Management
          </Typography>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            
            {/* New Structure Fields */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                variant="outlined"
                placeholder="Education requirement..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Age Restriction"
                value={ageRestriction}
                onChange={(e) => setAgeRestriction(e.target.value)}
                variant="outlined"
                placeholder="Age restriction..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Application Method"
                value={applicationMethod}
                onChange={(e) => setApplicationMethod(e.target.value)}
                variant="outlined"
                placeholder="How to apply..."
              />
            </Grid>
            
            {/* Description and Links */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Enter description..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Link"
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
                variant="outlined"
                placeholder="https://..."
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Date"
                type="date"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                File Uploads
              </Typography>
              <Grid container spacing={3}>
                {/* Image Upload */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Student Update Image
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
                    {imageFile && (
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Selected: {imageFile.name}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Notification PDF Upload */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Notification PDF
                    </Typography>
                    <input
                      type="file"
                      name="notificationPdf"
                      accept=".pdf"
                      onChange={handleNotificationPdfChange}
                      hidden
                      id="notification-pdf-upload"
                    />
                    <label htmlFor="notification-pdf-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PictureAsPdf />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Select Notification PDF
                      </Button>
                    </label>
                    {notificationPdfFile && (
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Selected: {notificationPdfFile.name}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                
                {/* Selection PDF Upload */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Selection PDF
                    </Typography>
                    <input
                      type="file"
                      name="selectionPdf"
                      accept=".pdf"
                      onChange={handleSelectionPdfChange}
                      hidden
                      id="selection-pdf-upload"
                    />
                    <label htmlFor="selection-pdf-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PictureAsPdf />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Select Selection PDF
                      </Button>
                    </label>
                    {selectionPdfFile && (
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Selected: {selectionPdfFile.name}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Notification and Submit in single row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
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
                sx={{ py: 2, fontSize: '1.1rem', height: '100%' }}
              >
                {loading ? "Saving..." : "Save Student Update"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StudentUpdates;