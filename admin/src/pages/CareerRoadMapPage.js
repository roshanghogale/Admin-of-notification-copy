import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  Paper
} from "@mui/material";
import {
  PhotoCamera,
  PictureAsPdf
} from "@mui/icons-material";
import CareerRoadmapSlider from "../components/CareerRoadmapSlider";

function CareerRoadMapPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [educationCategories, setEducationCategories] = useState([]);
  const [bachelorDegrees, setBachelorDegrees] = useState([]);
  const [mastersDegrees, setMastersDegrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [notification, setNotification] = useState(false);



  const educationOptions = [
    "All", "10th", "12th", "Edu (B.ed and D.ed)", "Arts", "Commerce", "Engineering (Degree)", "Diploma (Polytechnic)",
    "Medical", "Dental", "ITI", "Pharmacy", "Agriculture",
    "Computer Science/IT", "Nursing", "Law", "Veterinary",
    "Journalism", "Management", "Hotel Management",
    "Animation & Multimedia", "Other B.Sc", "Other"
  ];

  const degreeMap = {
    "All": ["All"],
    "10th": [],
    "12th": [],
    "Edu (B.ed and D.ed)": ["B.Ed", "BA B.Ed", "Other"],
    "Arts": ["BA", "BA (Hons)", "Home Science", "Social Work", "Journalism", "BA LLB", "Other"],
    "Commerce": ["B.Com", "B.Com (Hons)", "Chartered Accountancy (CA)", "Cost and Management Accountancy (CMA)", "Company Secretary (CS)", "Other"],
    "Engineering (Degree)": ["Computer Science Engineering (CSE)", "Information Technology (IT)", "Artificial Intelligence & Machine Learning (AIML)", "Data Science Engineering", "Cyber Security", "Robotics Engineering", "Software Engineering", "Computer Engineering", "Electronics & Communication (ECE)", "Electrical Engineering (EE)", "Electronics & Telecommunication (ENTC)", "Instrumentation Engineering", "Electrical & Electronics Engineering (EEE)", "Mechanical Engineering (ME)", "Automobile Engineering", "Mechatronics Engineering", "Production Engineering", "Civil Engineering (CE)", "Architecture (B.Arch)", "Structural Engineering (Specialization)", "Chemical Engineering", "Industrial Engineering", "Petroleum Engineering", "Mining Engineering", "Agricultural Engineering", "Food Technology", "Aerospace Engineering", "Aeronautical Engineering", "Marine Engineering", "Naval Architecture", "Environmental Engineering", "Textile Engineering", "Plastic Engineering", "Metallurgical Engineering", "Other"],
    "Diploma (Polytechnic)": ["Diploma in Computer Engineering", "Diploma in Information Technology", "Diploma in Computer Science", "Diploma in Artificial Intelligence", "Diploma in Cyber Security", "Diploma in Electronics & Telecommunication (ETC / ENTC)", "Diploma in Electrical Engineering", "Diploma in Electronics Engineering", "Diploma in Instrumentation Engineering", "Diploma in Electrical & Electronics Engineering (EEE)", "Diploma in Mechanical Engineering", "Diploma in Automobile Engineering", "Diploma in Mechatronics", "Diploma in Tool & Die Making", "Diploma in Production Engineering", "Diploma in Robotics", "Diploma in Civil Engineering", "Diploma in Architecture (D.Arch)", "Diploma in Structural Engineering", "Diploma in Construction Technology", "Diploma in Chemical Engineering", "Diploma in Industrial Engineering", "Diploma in Petrochemical Engineering", "Diploma in Petroleum Engineering", "Diploma in Mining Engineering", "Diploma in Aeronautical Engineering", "Diploma in Aerospace Engineering", "Diploma in Marine Engineering", "Diploma in Naval Architecture", "Diploma in Textile Engineering", "Diploma in Lab Technology", "Diploma in Radiology", "Diploma in X-Ray Technology", "Diploma in Engineering", "Advanced Diploma", "Other"],
    "Medical": ["MBBS", "BAMS", "BHMS", "BUMS", "Lab Technology", "Diploma in Radiology", "Diploma in X-Ray Technology", "Other"],
    "Dental": ["BDS", "Other"],
    "ITI": ["Electrician", "Wireman", "Electronics Mechanic", "Instrument Mechanic", "Electrical Maintenance", "Solar Technician", "Fitter", "Turner", "Machinist", "Mechanic Motor Vehicle (MMV)", "Diesel Mechanic", "Tool & Die Maker", "Foundryman", "Welder (Gas & Electric)", "Computer Operator (COPA)", "Desktop Publishing Operator (DTP)", "Carpenter", "Mechanic Diesel Engine", "Mechanic Motor Cycle", "Fashion Design Technology", "Plumber", "Painter", "Plastic Processing Operator", "Fire & Safety", "Interior Decoration", "Printing Technology", "Other"],
    "Pharmacy": ["B.Pharm", "D.Pharm", "Other"],
    "Agriculture": ["B.Sc Agri", "Diploma in Agriculture", "Agricultural Engineering", "Other"],
    "Computer Science/IT": ["BCA", "B.Sc IT", "B.Sc CS", "Other"],
    "Nursing": ["B.Sc Nursing", "GNM", "ANM", "Other"],
    "Law": ["LLB", "BA LLB", "BBA LLB", "Other"],
    "Veterinary": ["BVSc", "Other"],
    "Journalism": ["BA Journalism", "Mass Comm", "Other"],
    "Management": ["BBA", "BMS", "Aviation", "BBA LLB", "Other"],
    "Hotel Management": ["BHM", "Diploma in Hotel Management", "Hospitality", "Other"],
    "Animation & Multimedia": ["Animation", "Animation Design", "Other"],
    "Other B.Sc": ["Physics", "Chemistry", "Maths", "Biology", "Biotech", "Home Science", "MLT", "Radiology", "Stats", "Geology", "Env Science", "Other"],
    "Other": ["Planning", "Fashion", "Interior", "Fine Arts", "Painting", "Sculpture", "Applied Arts", "Music", "Dance", "Theatre", "Physiotherapy", "Social Work", "Other"]
  };

  const postGradMap = {
    "All": ["All"],
    "10th": [],
    "12th": [],
    "Edu (B.ed and D.ed)": ["M.Ed", "None"],
    "Arts": ["MA", "None"],
    "Commerce": ["M.Com", "MBA", "None"],
    "Engineering (Degree)": ["M.Tech", "M.E", "MBA", "None"],
    "Diploma (Polytechnic)": ["Advanced Diploma", "None"],
    "Medical": ["MD", "MS", "M.Sc", "None"],
    "Dental": ["MDS", "None"],
    "ITI": ["None"],
    "Pharmacy": ["M.Pharm", "None"],
    "Agriculture": ["M.Sc Agri", "None"],
    "Computer Science/IT": ["MCA", "M.Sc IT", "M.Tech", "None"],
    "Nursing": ["M.Sc Nursing", "None"],
    "Law": ["LLM", "None"],
    "Veterinary": ["MVSc", "None"],
    "Journalism": ["MA Journalism", "None"],
    "Management": ["MBA", "PGDM", "None"],
    "Hotel Management": ["MHM", "MBA Hospitality", "None"],
    "Animation & Multimedia": ["M.Sc Animation", "None"],
    "Other B.Sc": ["M.Sc", "None"],
    "Other": ["None"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.", { position: "top-right" });
      return;
    }

    if (!type) {
      toast.error("Type selection is required.", { position: "top-right" });
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
      formData.append('educationCategories', JSON.stringify(educationCategories));
      formData.append('bachelorDegrees', JSON.stringify(educationCategories.includes("All") ? [] : bachelorDegrees));
      formData.append('mastersDegrees', JSON.stringify(educationCategories.includes("All") ? [] : mastersDegrees));
      formData.append('notification', notification);
      
      if (imageFile) formData.append('image', imageFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      await axios.post('/api/career-roadmaps', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (notification) {
        let fcmTopics = [];
        if (educationCategories.includes("All")) {
          fcmTopics = ["all"];
        } else if (educationCategories.includes("10th") || educationCategories.includes("12th")) {
          fcmTopics = educationCategories.filter(cat => cat === "10th" || cat === "12th");
        } else {
          fcmTopics = bachelorDegrees.length > 0 ? bachelorDegrees : ["general"];
        }

        for (const topic of fcmTopics) {
          const firebaseData = {
            topic: topic,
            data: {
              notificationType: "career_roadmap",
              title: title,
              type: type,
              educationCategories: JSON.stringify(educationCategories),
              bachelorDegrees: JSON.stringify(educationCategories.includes("All") ? [] : bachelorDegrees),
              mastersDegrees: JSON.stringify(educationCategories.includes("All") ? [] : mastersDegrees),
              timestamp: new Date().toISOString()
            }
          };
          await axios.post("http://localhost:3000/api/firebase/send-notification", firebaseData);
        }
        toast.success("Career roadmap saved and notification sent!");
      } else {
        toast.success("Career roadmap saved successfully!");
      }

      // Reset form
      setTitle("");
      setType("");
      setEducationCategories([]);
      setBachelorDegrees([]);
      setMastersDegrees([]);
      setImageFile(null);
      setPdfFile(null);
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
    toast.info("Image selected successfully!", { position: "top-right" });
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    toast.info("PDF selected successfully!", { position: "top-right" });
  };





  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Card elevation={3} className="modern-card">
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Career Roadmap Management
          </Typography>
          <Grid container spacing={3}>
            {/* Title */}
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

            {/* Type Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="startup">Startup Roadmap</MenuItem>
                  <MenuItem value="career">Career Roadmap</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Education Requirements - Only show for Career type */}
            {type === 'career' && (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Education Categories</InputLabel>
                    <Select
                      multiple
                      value={educationCategories}
                      onChange={(e) => {
                        const value = e.target.value;
                        
                        // Handle empty selection
                        if (value.length === 0) {
                          setEducationCategories([]);
                          setBachelorDegrees([]);
                          setMastersDegrees([]);
                          return;
                        }
                        
                        const lastSelected = value[value.length - 1];
                        
                        if (lastSelected === "All") {
                          if (educationCategories.includes("All")) {
                            // All is already selected, unselect everything
                            setEducationCategories([]);
                            setBachelorDegrees([]);
                            setMastersDegrees([]);
                          } else {
                            // All not selected, select all options
                            setEducationCategories(["All"]);
                            setBachelorDegrees([]);
                            setMastersDegrees([]);
                          }
                        } else if (educationCategories.includes("All")) {
                          // If All was selected, replace with new selection
                          setEducationCategories([lastSelected]);
                          setBachelorDegrees([]);
                          setMastersDegrees([]);
                        } else {
                          // Multi-selection for all other options including 10th and 12th
                          setEducationCategories(value);
                          const validBachelors = bachelorDegrees.filter(degree => 
                            value.some(cat => degreeMap[cat]?.includes(degree))
                          );
                          const validMasters = mastersDegrees.filter(degree => 
                            value.some(cat => postGradMap[cat]?.includes(degree))
                          );
                          setBachelorDegrees(validBachelors || []);
                          setMastersDegrees(validMasters || []);
                        }
                      }}
                      input={<OutlinedInput label="Education Categories" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {educationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Checkbox checked={educationCategories.indexOf(option) > -1} />
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Bachelor Degrees</InputLabel>
                    <Select
                      multiple
                      value={bachelorDegrees}
                      onChange={(e) => {
                        const selectedBachelors = e.target.value;
                        const availableDegrees = [...new Set(educationCategories.flatMap(cat => degreeMap[cat] || []))].filter(degree => degree !== "All");
                        
                        if (selectedBachelors.includes("All")) {
                          if (bachelorDegrees.length === availableDegrees.length) {
                            setBachelorDegrees([]);
                          } else {
                            setBachelorDegrees(availableDegrees);
                          }
                          return;
                        }
                        
                        setBachelorDegrees(selectedBachelors);
                        
                        // Auto-select corresponding masters degrees
                        const autoMasters = selectedBachelors.flatMap(bachelor => {
                          const category = educationCategories.find(cat => degreeMap[cat]?.includes(bachelor));
                          return category ? postGradMap[category] || [] : [];
                        });
                        setMastersDegrees([...new Set([...mastersDegrees, ...autoMasters])]);
                      }}
                      input={<OutlinedInput label="Bachelor Degrees" />}
                      disabled={educationCategories.includes("All") || (educationCategories.includes("10th") || educationCategories.includes("12th")) && !educationCategories.some(cat => !['10th', '12th'].includes(cat)) || educationCategories.length === 0}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem key="All" value="All">
                        <Checkbox checked={bachelorDegrees.length === [...new Set(educationCategories.flatMap(cat => degreeMap[cat] || []))].filter(degree => degree !== "All").length && bachelorDegrees.length > 0} />
                        All
                      </MenuItem>
                      {[...new Set(educationCategories.flatMap(cat => degreeMap[cat] || []))].filter(degree => degree !== "All").map((degree) => (
                        <MenuItem key={degree} value={degree}>
                          <Checkbox checked={bachelorDegrees.indexOf(degree) > -1} />
                          {degree}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Masters Degrees</InputLabel>
                    <Select
                      multiple
                      value={mastersDegrees}
                      onChange={(e) => {
                        const selectedMasters = e.target.value;
                        const availableDegrees = [...new Set(educationCategories.flatMap(cat => postGradMap[cat] || []))].filter(degree => degree !== "All");
                        
                        if (selectedMasters.includes("All")) {
                          if (mastersDegrees.length === availableDegrees.length) {
                            setMastersDegrees([]);
                          } else {
                            setMastersDegrees(availableDegrees);
                          }
                          return;
                        }
                        
                        setMastersDegrees(selectedMasters);
                      }}
                      input={<OutlinedInput label="Masters Degrees" />}
                      disabled={educationCategories.includes("All") || (educationCategories.includes("10th") || educationCategories.includes("12th")) && !educationCategories.some(cat => !['10th', '12th'].includes(cat)) || educationCategories.length === 0}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem key="All" value="All">
                        <Checkbox checked={mastersDegrees.length === [...new Set(educationCategories.flatMap(cat => postGradMap[cat] || []))].filter(degree => degree !== "All").length && mastersDegrees.length > 0} />
                        All
                      </MenuItem>
                      {[...new Set(educationCategories.flatMap(cat => postGradMap[cat] || []))].filter(degree => degree !== "All").map((degree) => (
                        <MenuItem key={degree} value={degree}>
                          <Checkbox checked={mastersDegrees.indexOf(degree) > -1} />
                          {degree}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                File Uploads
              </Typography>
              <Grid container spacing={3}>
                {/* Image Upload */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Career Image
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
                      >
                        {imageFile ? `Selected: ${imageFile.name}` : "Select Image"}
                      </Button>
                    </label>
                  </Paper>
                </Grid>

                {/* PDF Upload */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Career PDF
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
                      >
                        {pdfFile ? `Selected: ${pdfFile.name}` : "Select PDF"}
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
                {loading ? "Saving..." : "Save Career Roadmap"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Career Roadmap Slider Section */}
      <Card elevation={3} className="modern-card" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Career Roadmap Slider Management
          </Typography>
          <CareerRoadmapSlider />
        </CardContent>
      </Card>
    </Box>
  );
}

export default CareerRoadMapPage;