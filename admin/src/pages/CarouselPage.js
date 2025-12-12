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
  Checkbox
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../Firebase/firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function CarouselPage() {
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);

  // File states
  const [imageFile, setImageFile] = useState(null);

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);

  // Uploaded states
  const [uploadedImage, setUploadedImage] = useState(false);

  // Chosen states
  const [imageChosen, setImageChosen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!notification) {
      toast.warn(
        "Notification checkbox is not checked. The notification will not be sent.",
        { position: "top-right" }
      );
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "careerRoadmapSlider"), {
        imageUrl: imageUrl || "",
        timestamp: new Date(),
        documentId: ""
      });

      const documentId = docRef.id;
      await updateDoc(doc(db, "careerRoadmapSlider", documentId), { documentId });

      toast.success("Career Roadmap Slider saved successfully!", {
        position: "top-right",
      });

      // Reset form
      setImageUrl("");
      setImageFile(null);
      setUploadedImage(false);
      setImageChosen(false);
      setNotification(false);
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
    setImageChosen(true);
    setUploadedImage(false);
    toast.info("Image selected successfully!", { position: "top-right" });
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    const storageRef = ref(storage, `careerRoadmapSlider/images/${Date.now()}_${imageFile.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadUrl);
      toast.success("Image uploaded successfully!", { position: "top-right" });
      setUploadedImage(true);
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error("Failed to upload image", { position: "top-right" });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <ToastContainer />
      <Card elevation={3} className="form-card">
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" className="page-title" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Career Roadmap Slider Management
          </Typography>
          
          <Grid container spacing={3}>


            {/* File Upload and Save/Notification Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="file-upload-card">
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                    Slider Image
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
                <Button
                  variant="contained"
                  onClick={uploadImage}
                  disabled={!imageChosen || uploadingImage || uploadedImage}
                  fullWidth
                  color={uploadedImage ? 'success' : 'primary'}
                >
                  {uploadingImage ? "Uploading..." : uploadedImage ? "Uploaded" : "Upload Image"}
                </Button>
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
                  sx={{ display: 'block', mb: 2 }}
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
                  {loading ? "Saving..." : "Save Career Roadmap Slider"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CarouselPage;
