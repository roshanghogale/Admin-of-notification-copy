import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Material-UI Components
import {
  Typography,
  Container,
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import {
  PhotoCamera,
  PictureAsPdf,
  Description,
  Close
} from "@mui/icons-material";

// Import your pages
import SliderPage from "./pages/SliderPage";
import JobUpdates from "./pages/StoryPage";
import CurrentAffairs from "./pages/CurrentAffairs";
import Notification from "./pages/Notification";
import ManageAll from "./pages/ManageAll";
import Details from "./pages/Details";
import CarrierRoadMapsPage from "./pages/CareerRoadMapPage";
import StudentUpdates from "./pages/StudentUpdates";
import ResultHallTicketUpdates from "./pages/ResultHallTicketUpdates";
import FreeStudyMaterialPage from "./pages/FreeStudyMaterialPage";
import NewsPage from "./pages/NewsPage";




import UsersList from "./pages/UsersList";

function App() {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [lastDate, setLastDate] = useState(null);
  const [postName, setPostName] = useState("");
  const [educationCategories, setEducationCategories] = useState([]);
  const [bachelorDegrees, setBachelorDegrees] = useState([]);
  const [mastersDegrees, setMastersDegrees] = useState([]);
  const [ageRequirement, setAgeRequirement] = useState("");
  const [jobPlace, setJobPlace] = useState("");
  const [applicationFees, setApplicationFees] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [type, setType] = useState("");
  const [subType, setSubType] = useState("");
  const [educationRequirement, setEducationRequirement] = useState("");
  const [totalPosts, setTotalPosts] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [selectedIconUrl, setSelectedIconUrl] = useState("");
  const [existingIcons, setExistingIcons] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [selectionPdf, setSelectionPdf] = useState(null);
  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [notification, setNotification] = useState(false);
  const [note, setNote] = useState("");
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);

  // Fetch existing icons on component mount
  React.useEffect(() => {
    const fetchExistingIcons = async () => {
      try {
        const response = await axios.get('/api/job-updates');
        const icons = response.data.jobUpdates
          .filter(job => job.icon_url)
          .map(job => ({ url: job.icon_url, title: job.title }))
          .filter((icon, index, self) => 
            index === self.findIndex(i => i.url === icon.url)
          );
        setExistingIcons(icons);
      } catch (error) {
        console.error('Error fetching existing icons:', error);
      }
    };
    fetchExistingIcons();
  }, []);

  const educationOptions = [
    "All", "10th", "12th", "Edu (B.ed and D.ed)", "Arts", "Commerce", "Engineering (Degree)", "Diploma (Polytechnic)",
    "Medical", "Dental", "ITI", "Pharmacy", "Agriculture",
    "Computer Science/IT", "Nursing", "Law", "Veterinary",
    "Journalism", "Management", "Hotel Management",
    "Animation & Multimedia", "Other B.Sc", "Other"
  ];

  const ageGroupOptions = ["14 to 18", "19 to 25", "26 to 31", "32 and above"];

  const subTypeOptions = {
    banking: ["Private", "Government"],
    private: ["Home", "Regular"],
    government: ["Maha", "Central"]
  };

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



  const handlePushNotification = async (e) => {
    e.preventDefault();

    // Validation for required fields
    const requiredFields = [
      { value: type, name: "Job Type" },
      { value: subType, name: "Sub Type" },
      { value: totalPosts.trim(), name: "Total Posts" },
      { value: postName.trim(), name: "Post Name" },
      { value: title.trim(), name: "Title" },
      { value: lastDate, name: "Last Date" },
      { value: applicationLink.trim(), name: "Apply Link" },
      { value: educationRequirement.trim(), name: "Education Requirement" },
      { value: educationCategories.length > 0, name: "Education Category" },
      { value: iconFile || selectedIconUrl, name: "Job Icon" },
      { value: imageFile, name: "Job Image/Banner" },
      { value: selectionPdf, name: "Selection PDF" }
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        toast.error(`${field.name} is required.`, { position: "top-right" });
        return;
      }
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
      
      // Add form fields
      formData.append('title', title.trim());
      formData.append('salary', salary.trim());
      if (lastDate) formData.append('lastDate', lastDate);
      formData.append('postName', postName.trim());
      formData.append('educationCategories', JSON.stringify(educationCategories));
      formData.append('bachelorDegrees', JSON.stringify(educationCategories.includes("All") ? [] : bachelorDegrees));
      formData.append('mastersDegrees', JSON.stringify(educationCategories.includes("All") ? [] : mastersDegrees));
      formData.append('ageRequirement', ageRequirement.trim());
      formData.append('jobPlace', jobPlace.trim());
      formData.append('applicationFees', applicationFees.trim());
      formData.append('applicationLink', applicationLink.trim());
      formData.append('type', type);
      formData.append('subType', subType);
      console.log('Frontend educationRequirement value:', educationRequirement);
      formData.append('educationRequirement', educationRequirement.trim());
      formData.append('totalPosts', totalPosts.trim());
      formData.append('note', note.trim());
      formData.append('notification', notification);
      console.log('Sending notification flag:', notification);
      
      // Add files
      if (iconFile) formData.append('icon', iconFile);
      else if (selectedIconUrl) formData.append('iconUrl', selectedIconUrl);
      if (imageFile) formData.append('image', imageFile);
      if (pdfFile) formData.append('pdf', pdfFile);
      if (selectionPdf) formData.append('selectionPdf', selectionPdf);
      if (syllabusPdf) formData.append('syllabusPdf', syllabusPdf);

      const response = await axios.post('/api/job-updates', formData, {
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
              notificationType: "job_update",
              title: title,
              salary: salary,
              lastDate: lastDate,
              postName: postName,
              educationCategories: JSON.stringify(educationCategories),
              bachelorDegrees: JSON.stringify(educationCategories.includes("All") ? [] : bachelorDegrees),
              mastersDegrees: JSON.stringify(educationCategories.includes("All") ? [] : mastersDegrees),
              ageRequirement: ageRequirement,
              subType: subType,
              educationRequirement: educationRequirement,
              totalPosts: totalPosts,
              note: note,
              timestamp: new Date().toISOString()
            }
          };
          await axios.post("http://localhost:3000/api/firebase/send-notification", firebaseData);
        }
        toast.success("Job update saved and notification sent!");
      } else {
        toast.success("Job update saved successfully!");
      }
      
      console.log('Job update response:', response.data);
      console.log('Notification checkbox was:', notification);

      // Reset form
      setTitle("");
      setSalary("");
      setLastDate(null);
      setPostName("");
      setEducationCategories([]);
      setBachelorDegrees([]);
      setMastersDegrees([]);
      setAgeRequirement("");
      setJobPlace("");
      setApplicationFees("");
      setApplicationLink("");
      setType("");
      setSubType("");
      setEducationRequirement("");
      setTotalPosts("");
      setNote("");
      setImageFile(null);
      setIconFile(null);
      setSelectedIconUrl("");
      setPdfFile(null);
      setSelectionPdf(null);
      setSyllabusPdf(null);
    } catch (error) {
      console.error("API error:", error);
      toast.error(`Failed to save data: ${error.response?.data?.error || error.message}`, {
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

  const handleIconChange = (e) => {
    setIconFile(e.target.files[0]);
    toast.info("Icon selected successfully!", { position: "top-right" });
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    toast.info("PDF selected successfully!", { position: "top-right" });
  };

  const handleSelectionPdfChange = (e) => {
    setSelectionPdf(e.target.files[0]);
    toast.info("Selection PDF selected successfully!", {
      position: "top-right",
    });
  };

  const handleSyllabusPdfChange = (e) => {
    setSyllabusPdf(e.target.files[0]);
    toast.info("Syllabus PDF selected successfully!", {
      position: "top-right",
    });
  };





  return (
    <Router>
      <ToastContainer />

      <Paper elevation={3} sx={{ p: 2, m: 2, borderRadius: 3 }} className="modern-card">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {[
            { to: "/", label: "Job Updates" },
            { to: "/current-affairs", label: "Current Affairs" },
            { to: "/carrier-roadmaps", label: "Career RoadMaps" },
            { to: "/student-updates", label: "Student Updates" },
            { to: "/randh-ticket", label: "R/H Ticket" },

            { to: "/job-updates", label: "Story" },
            { to: "/slider", label: "Slider" },
            { to: "/free-study-material", label: "Free Study Material" },
            { to: "/news", label: "News" },
            { to: "/notification", label: "Notification" },
            { to: "/manage-all", label: "Manage All" }
          ].map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              variant="outlined"
              size="small"
              className="nav-button"
              sx={{ 
                borderRadius: 3,
                '&.active': { 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Paper>

      <Container maxWidth="xl" className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <Card elevation={3} className="modern-card">
                <CardContent>
                  <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
                    Job Updates Management
                  </Typography>
                  <Grid container spacing={3}>
                    {/* Top Row - Job Type, Sub Type, Total Posts */}
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Job Type *</InputLabel>
                        <Select
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);
                            setSubType("");
                          }}
                          label="Job Type"
                        >
                          <MenuItem value="">Select Job Type</MenuItem>
                          <MenuItem value="banking">Banking</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                          <MenuItem value="government">Government</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Sub Type *</InputLabel>
                        <Select
                          value={subType}
                          onChange={(e) => setSubType(e.target.value)}
                          label="Sub Type"
                          disabled={!type}
                        >
                          <MenuItem value="">Select Sub Type</MenuItem>
                          {type && subTypeOptions[type]?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Total Posts *"
                        value={totalPosts}
                        onChange={(e) => setTotalPosts(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>

                    {/* Basic Information */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Post Name *"
                        value={postName}
                        onChange={(e) => setPostName(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>

                    {/* Job Details */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Age Group"
                        value={ageRequirement}
                        onChange={(e) => setAgeRequirement(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Job Place"
                        value={jobPlace}
                        onChange={(e) => setJobPlace(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Application Fees"
                        value={applicationFees}
                        onChange={(e) => setApplicationFees(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Last Date *"
                        type="date"
                        value={lastDate || ""}
                        onChange={(e) => {
                          console.log('Date selected:', e.target.value);
                          setLastDate(e.target.value);
                        }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          inputProps: {
                            placeholder: "dd/mm/yyyy"
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Apply Link *"
                        value={applicationLink}
                        onChange={(e) => setApplicationLink(e.target.value)}
                        variant="outlined"
                        type="url"
                        placeholder="https://..."
                      />
                    </Grid>

                    {/* Education Requirement Text Field */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="शिक्षण पात्रता (Education Requirement) *"
                        value={educationRequirement}
                        onChange={(e) => {
                          console.log('Education requirement input changed to:', e.target.value);
                          setEducationRequirement(e.target.value);
                        }}
                        variant="outlined"
                        multiline
                        rows={2}
                        placeholder="Enter education requirement text for app display..."
                      />
                    </Grid>
                    
                    {/* Note Field */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        variant="outlined"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    {/* Education Requirements */}
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Education Categories *</InputLabel>
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
                                const allBachelors = [...new Set(Object.values(degreeMap).flat())];
                                const allMasters = [...new Set(Object.values(postGradMap).flat())];
                                setBachelorDegrees(allBachelors);
                                setMastersDegrees(allMasters);
                              }
                            } else if (educationCategories.includes("All")) {
                              // If All was selected, replace with new selection
                              setEducationCategories([lastSelected]);
                              const selectedBachelors = degreeMap[lastSelected] || [];
                              const selectedMasters = postGradMap[lastSelected] || [];
                              setBachelorDegrees(selectedBachelors);
                              setMastersDegrees(selectedMasters);
                            } else {
                              // Multi-selection for all other options including 10th and 12th
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
                          disabled={(educationCategories.includes("10th") || educationCategories.includes("12th")) && !educationCategories.some(cat => !['10th', '12th'].includes(cat)) || educationCategories.includes("All") || educationCategories.length === 0}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                        >
                          <MenuItem key="All" value="All">
                            <Checkbox checked={false} />
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
                          disabled={(educationCategories.includes("10th") || educationCategories.includes("12th")) && !educationCategories.some(cat => !['10th', '12th'].includes(cat)) || educationCategories.includes("All") || educationCategories.length === 0}
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






                    {/* File Upload Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        File Uploads
                      </Typography>
                      <Grid container spacing={3}>
                        {/* Icon Upload */}
                        <Grid item xs={12} md={2.4}>
                          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%' }} className="file-upload-card">
                            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                              Job Icon *
                            </Typography>
                            
                            {/* Existing Icons Button and Dialog */}
                            {existingIcons.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => setIconDialogOpen(true)}
                                  fullWidth
                                  sx={{ mb: 1 }}
                                >
                                  Select Existing Icons
                                </Button>
                              </Box>
                            )}
                            
                            {/* OR Upload New */}
                            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>OR</Typography>
                            
                            <input
                              type="file"
                              name="icon"
                              accept="image/*"
                              onChange={(e) => {
                                handleIconChange(e);
                                setSelectedIconUrl("");
                              }}
                              hidden
                              id="icon-upload"
                            />
                            <label htmlFor="icon-upload">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<PhotoCamera />}
                                fullWidth
                                color={iconFile ? 'success' : 'primary'}
                                size="small"
                              >
                                {iconFile ? `Selected: ${iconFile.name}` : "Upload New Icon"}
                              </Button>
                            </label>
                            
                            {selectedIconUrl && (
                              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                Using existing icon
                              </Typography>
                            )}
                          </Paper>
                        </Grid>

                        {/* Image Upload */}
                        <Grid item xs={12} md={2.4}>
                          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%' }} className="file-upload-card">
                            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                              Job Image/Banner *
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

                        {/* Notification PDF Upload */}
                        <Grid item xs={12} md={2.4}>
                          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%' }} className="file-upload-card">
                            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                              Notification PDF
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

                        {/* Selection PDF Upload */}
                        <Grid item xs={12} md={2.4}>
                          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%' }} className="file-upload-card">
                            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                              Selection PDF *
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
                                variant="contained"
                                component="span"
                                startIcon={<Description />}
                                fullWidth
                                color={selectionPdf ? 'success' : 'primary'}
                              >
                                {selectionPdf ? `Selected: ${selectionPdf.name}` : "Select PDF"}
                              </Button>
                            </label>
                          </Paper>
                        </Grid>

                        {/* Syllabus PDF Upload */}
                        <Grid item xs={12} md={2.4}>
                          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%' }} className="file-upload-card">
                            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                              Syllabus PDF
                            </Typography>
                            <input
                              type="file"
                              name="syllabusPdf"
                              accept=".pdf"
                              onChange={handleSyllabusPdfChange}
                              hidden
                              id="syllabus-pdf-upload"
                            />
                            <label htmlFor="syllabus-pdf-upload">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<Description />}
                                fullWidth
                                color={syllabusPdf ? 'success' : 'primary'}
                              >
                                {syllabusPdf ? `Selected: ${syllabusPdf.name}` : "Select PDF"}
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
                        onClick={handlePushNotification}
                        disabled={loading}
                        fullWidth
                        className="submit-button"
                        sx={{ py: 2, fontSize: '1.1rem', height: '100%' }}
                      >
                        {loading ? "Saving..." : "Save Job Update"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            }
          />
          <Route path="/slider" element={<SliderPage />} />
          <Route path="/student-updates" element={<StudentUpdates />} />
          <Route path="/randh-ticket" element={<ResultHallTicketUpdates />} />
          <Route path="/job-updates" element={<JobUpdates />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/carrier-roadmaps" element={<CarrierRoadMapsPage />} />

          <Route path="/free-study-material" element={<FreeStudyMaterialPage />} />
          <Route path="/news" element={<NewsPage />} />


          <Route path="/users-list" element={<UsersList />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/manage-all" element={<ManageAll />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </Container>
      
      {/* Icon Selection Dialog */}
      <Dialog 
        open={iconDialogOpen} 
        onClose={() => setIconDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Select Existing Icon
          <IconButton onClick={() => setIconDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
            gap: 2, 
            p: 2
          }}>
            {existingIcons.map((icon, index) => (
              <Box
                key={index}
                onClick={() => {
                  setSelectedIconUrl(icon.url);
                  setIconFile(null);
                  setIconDialogOpen(false);
                  toast.success('Icon selected successfully!');
                }}
                sx={{
                  width: 100,
                  height: 100,
                  border: selectedIconUrl === icon.url ? '3px solid #1976d2' : '2px solid #ddd',
                  borderRadius: 2,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    borderColor: '#1976d2',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 16px rgba(25,118,210,0.3)'
                  }
                }}
              >
                <img 
                  src={icon.url} 
                  alt={`Icon ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {selectedIconUrl === icon.url && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(25,118,210,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      ✓ Selected
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIconDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Router>
  );
}

export default App;
