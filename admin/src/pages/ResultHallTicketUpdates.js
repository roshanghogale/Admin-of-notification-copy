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
  Add
} from "@mui/icons-material";

function ResultHallTicketUpdates() {
  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [examDate, setExamDate] = useState(null);
  const [educationCategories, setEducationCategories] = useState([]);
  const [bachelorDegrees, setBachelorDegrees] = useState([]);
  const [mastersDegrees, setMastersDegrees] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [websiteUrls, setWebsiteUrls] = useState([{ title: "", url: "" }]);
  const [iconFile, setIconFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);

  const ageGroupOptions = ["14 to 18", "19 to 25", "26 to 31", "32 and above"];

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
      toast.error("Title is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());

      formData.append('category', category);
      formData.append('type', type);
      formData.append('examDate', examDate);
      formData.append('educationCategories', JSON.stringify(educationCategories));
      formData.append('bachelorDegrees', JSON.stringify(educationCategories.includes("All") ? [] : bachelorDegrees));
      formData.append('mastersDegrees', JSON.stringify(educationCategories.includes("All") ? [] : mastersDegrees));
      formData.append('ageGroups', JSON.stringify(ageGroups));
      formData.append('description1', description1.trim());
      formData.append('description2', description2.trim());
      formData.append('websiteUrls', JSON.stringify(websiteUrls.filter(item => item.title.trim() && item.url.trim())));
      formData.append('notification', notification);
      
      if (iconFile) formData.append('icon', iconFile);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('/api/result-halltickets', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        if (notification) {
          let fcmTopics = [];
          if (educationCategories.includes("All")) {
            fcmTopics = ["all"];
          } else if (educationCategories.includes("10th") || educationCategories.includes("12th")) {
            fcmTopics = educationCategories.filter(cat => cat === "10th" || cat === "12th");
          } else {
            fcmTopics = [...new Set([...bachelorDegrees, ...ageGroups])].filter(t => t);
            if (fcmTopics.length === 0) fcmTopics = ["general"];
          }

          for (const topic of fcmTopics) {
            const firebaseData = {
              topic: topic,
              data: {
                notificationType: "result_hallticket",
                title: title,
  
                category: category,
                type: type,
                examDate: examDate,
                educationCategories: JSON.stringify(educationCategories),
                bachelorDegrees: JSON.stringify(educationCategories.includes("All") ? [] : bachelorDegrees),
                mastersDegrees: JSON.stringify(educationCategories.includes("All") ? [] : mastersDegrees),
                ageGroups: JSON.stringify(ageGroups),
                description1: description1,
                description2: description2,
                timestamp: new Date().toISOString()
              }
            };
            await axios.post("http://localhost:3000/api/firebase/send-notification", firebaseData);
          }
        }
        toast.success(notification ? "Result/Hall ticket update saved and notification sent!" : "Result/Hall ticket update saved successfully!");
        setTitle("");

        setCategory("");
        setType("");
        setExamDate(null);
        setEducationCategories([]);
        setBachelorDegrees([]);
        setMastersDegrees([]);
        setAgeGroups([]);
        setDescription1("");
        setDescription2("");
        setWebsiteUrls([{ title: "", url: "" }]);
        setIconFile(null);
        setImageFile(null);
        setNotification(false);
      } else {
        throw new Error('Failed to save result/hall ticket update');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save result/hall ticket update");
    } finally {
      setLoading(false);
    }
  };

  const handleIconChange = (e) => {
    setIconFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Card elevation={3} className="modern-card">
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Result / Hall Ticket Management
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
              <FormControl fullWidth>
                <InputLabel>Age Groups</InputLabel>
                <Select
                  multiple
                  value={ageGroups}
                  onChange={(e) => {
                    const value = e.target.value;
                    const availableAgeGroups = ageGroupOptions;
                    
                    if (value.includes("All")) {
                      if (ageGroups.length === availableAgeGroups.length) {
                        setAgeGroups([]);
                      } else {
                        setAgeGroups(availableAgeGroups);
                      }
                      return;
                    }
                    
                    setAgeGroups(value);
                  }}
                  input={<OutlinedInput label="Age Groups" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem key="All" value="All">
                    <Checkbox checked={ageGroups.length === ageGroupOptions.length && ageGroups.length > 0} />
                    All
                  </MenuItem>
                  {ageGroupOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={ageGroups.indexOf(option) > -1} />
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category and Type */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="government">Government</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="banking">Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="hallticket">Hall Ticket</MenuItem>
                  <MenuItem value="result">Result</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Exam Date"
                type="date"
                value={examDate || ""}
                onChange={(e) => setExamDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Education Requirements */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Education Categories</InputLabel>
                <Select
                  multiple
                  value={educationCategories}
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    if (value.length === 0) {
                      setEducationCategories([]);
                      setBachelorDegrees([]);
                      setMastersDegrees([]);
                      return;
                    }
                    
                    const lastSelected = value[value.length - 1];
                    
                    if (lastSelected === "All") {
                      if (educationCategories.includes("All")) {
                        setEducationCategories([]);
                        setBachelorDegrees([]);
                        setMastersDegrees([]);
                      } else {
                        setEducationCategories(["All"]);
                        setBachelorDegrees([]);
                        setMastersDegrees([]);
                      }
                    } else if (educationCategories.includes("All")) {
                      setEducationCategories([lastSelected]);
                      const selectedBachelors = degreeMap[lastSelected] || [];
                      const selectedMasters = postGradMap[lastSelected] || [];
                      setBachelorDegrees(selectedBachelors);
                      setMastersDegrees(selectedMasters);
                    } else {
                      setEducationCategories(value);
                      const selectedBachelors = [...new Set(value.flatMap(cat => degreeMap[cat] || []))];
                      const selectedMasters = [...new Set(value.flatMap(cat => postGradMap[cat] || []))];
                      setBachelorDegrees(selectedBachelors);
                      setMastersDegrees(selectedMasters);
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
                  }}
                  input={<OutlinedInput label="Bachelor Degrees" />}
                  disabled={educationCategories.includes("All") || educationCategories.includes("10th") || educationCategories.includes("12th") || educationCategories.length === 0}
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
                  disabled={educationCategories.includes("All") || educationCategories.includes("10th") || educationCategories.includes("12th") || educationCategories.length === 0}
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



            {/* Description Paragraphs */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description - Paragraph 1"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                variant="outlined"
                multiline
                rows={4}
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
                rows={4}
                placeholder="Enter second paragraph..."
              />
            </Grid>

            {/* Website URLs */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Website URLs
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Website Title"
                    value={websiteUrls[websiteUrls.length - 1]?.title || ""}
                    onChange={(e) => {
                      const newUrls = [...websiteUrls];
                      newUrls[newUrls.length - 1].title = e.target.value;
                      setWebsiteUrls(newUrls);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website URL"
                    value={websiteUrls[websiteUrls.length - 1]?.url || ""}
                    onChange={(e) => {
                      const newUrls = [...websiteUrls];
                      newUrls[newUrls.length - 1].url = e.target.value;
                      setWebsiteUrls(newUrls);
                    }}
                    variant="outlined"
                    type="url"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const lastItem = websiteUrls[websiteUrls.length - 1];
                      if (lastItem?.title.trim() && lastItem?.url.trim()) {
                        setWebsiteUrls([...websiteUrls, { title: "", url: "" }]);
                      }
                    }}
                    startIcon={<Add />}
                    fullWidth
                    size="large"
                  >
                    Add URL
                  </Button>
                </Grid>
              </Grid>
              
              {/* Display added URLs */}
              {websiteUrls.filter(item => item.title.trim() && item.url.trim()).length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Added URLs:
                  </Typography>
                  {websiteUrls.filter(item => item.title.trim() && item.url.trim()).map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        {item.title}: {item.url}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          const filteredUrls = websiteUrls.filter((_, i) => !(item.title === websiteUrls[i].title && item.url === websiteUrls[i].url));
                          setWebsiteUrls(filteredUrls.length > 0 ? filteredUrls : [{ title: "", url: "" }]);
                        }}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                File Uploads
              </Typography>
              <Grid container spacing={3}>
                {/* Icon Upload */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Icon
                    </Typography>
                    <input
                      type="file"
                      name="icon"
                      accept="image/*"
                      onChange={handleIconChange}
                      hidden
                      id="icon-upload"
                    />
                    <label htmlFor="icon-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Select Icon
                      </Button>
                    </label>
                    {iconFile && (
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Selected: {iconFile.name}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
                    <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                      Image
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
                {loading ? "Saving..." : "Save Result/Hall Ticket"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResultHallTicketUpdates;