import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

// Material-UI Components
import {
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import {
  PhotoCamera,
  PictureAsPdf
} from "@mui/icons-material";

function CurrentAffairs() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationDate, setNotificationDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.", { position: "top-right" });
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
      formData.append('date', date || '');
      formData.append('notification', notification);
      if (notificationDate) formData.append('notificationDate', notificationDate);
      

      if (imageFile) formData.append('image', imageFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      const response = await axios.post('/api/current-affairs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let bannerUrl = null;
      if (bannerFile) {
        try {
          const bannerFormData = new FormData();
          bannerFormData.append('banner', bannerFile);
          bannerFormData.append('notificationType', 'current_affairs');
          bannerFormData.append('contentId', response.data.currentAffair?.id || 'latest');
          
          const bannerResponse = await axios.post('/api/notification-banners', bannerFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          bannerUrl = `http://localhost:3000${bannerResponse.data.banner.banner_url}`;
        } catch (bannerError) {
          console.error('Banner upload failed:', bannerError);
          toast.warn('Banner upload failed, but current affairs saved successfully');
        }
      }

      if (notification) {
        const firebaseData = {
          topic: "current_affairs",
          data: {
            notificationType: "current_affairs",
            title: title,
            date: date,
            notificationDate: notificationDate,
            scheduledTime: notificationDate ? `${notificationDate} 19:00:00` : null,
            isScheduled: !!notificationDate,
            bannerImageUrl: bannerUrl || "",
            timestamp: new Date().toISOString()
          }
        };
        const endpoint = notificationDate ? 
          "http://localhost:3000/api/firebase/schedule-notification" : 
          "http://localhost:3000/api/firebase/send-notification";
        await axios.post(endpoint, firebaseData);
        toast.success("Current affairs saved and notification sent!");
      } else {
        toast.success("Current affairs saved successfully!");
      }

      // Reset form
      setTitle("");
      setDate(null);
      setImageFile(null);
      setBannerFile(null);
      setPdfFile(null);
      setNotificationDate("");
    } catch (error) {
      console.error("Firestore error:", error.message);
      toast.error(`Failed to save data: ${error.message}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    toast.info("Content image selected successfully!", { position: "top-right" });
  };

  const handleBannerChange = (e) => {
    setBannerFile(e.target.files[0]);
    toast.info("Banner image selected successfully!", { position: "top-right" });
  };



  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    toast.info("PDF selected successfully!", { position: "top-right" });
  };





  return (
    <Container maxWidth="lg" className="app-container">
      <ToastContainer />
      <Card elevation={3} className="modern-card">
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Current Affairs Management
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    placeholder: "dd/mm/yyyy"
                  }
                }}
              />
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                File Uploads
              </Typography>
              <Grid container spacing={3}>
                {/* Content Image Upload */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Content Image
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
                        variant="contained"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        color={imageFile ? 'success' : 'primary'}
                        size="small"
                      >
                        {imageFile ? `Selected: ${imageFile.name.substring(0, 15)}...` : "Select Content Image"}
                      </Button>
                    </label>
                  </Paper>
                </Grid>

                {/* Banner Image Upload */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Notification Banner
                    </Typography>
                    <input
                      type="file"
                      name="banner"
                      accept="image/*"
                      onChange={handleBannerChange}
                      hidden
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        color={bannerFile ? 'success' : 'primary'}
                        size="small"
                      >
                        {bannerFile ? `Selected: ${bannerFile.name.substring(0, 15)}...` : "Select Banner (Optional)"}
                      </Button>
                    </label>
                  </Paper>
                </Grid>

                {/* PDF Upload */}
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      PDF
                    </Typography>
                    <input
                      type="file"
                      name="pdf"
                      accept=".pdf"
                      onChange={handlePdfChange}
                      hidden
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<PictureAsPdf />}
                        fullWidth
                        color={pdfFile ? 'success' : 'primary'}
                        size="small"
                      >
                        {pdfFile ? `Selected: ${pdfFile.name.substring(0, 15)}...` : "Select PDF"}
                      </Button>
                    </label>
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
                      onChange={(e) => {
                        setNotification(e.target.checked);
                        if (!e.target.checked) setNotificationDate("");
                      }}
                      color="primary"
                    />
                  }
                  label="Send Push Notification"
                  sx={{ mb: 1 }}
                />
                {notification && (
                  <TextField
                    fullWidth
                    label="Notification Date (7:00 PM)"
                    type="date"
                    value={notificationDate}
                    onChange={(e) => setNotificationDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="Leave empty to send immediately"
                    size="small"
                  />
                )}
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
                {loading ? "Saving..." : "Save Current Affairs"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default CurrentAffairs;
