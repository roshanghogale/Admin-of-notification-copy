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
  MenuItem,
  Chip,
  OutlinedInput
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function SliderPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [postDocumentId, setPostDocumentId] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [pageType, setPageType] = useState("");
  const [isSpecific, setIsSpecific] = useState(false);
  const [otherType, setOtherType] = useState("");
  const [educationCategories, setEducationCategories] = useState([]);
  const [bachelorDegrees, setBachelorDegrees] = useState([]);
  const [mastersDegrees, setMastersDegrees] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [ageGroups, setAgeGroups] = useState([]);

  const ageGroupOptions = ["14 to 18", "19 to 25", "26 to 31", "32 and above"];
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);

  // File states
  const [imageFile, setImageFile] = useState(null);

  // Preview states
  const [imagePreview, setImagePreview] = useState("");

  // District and Taluka data
  const districts = [
    "Select District", "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
    "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia",
    "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
    "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad",
    "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli",
    "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ];

  const talukaMap = {
    "Ahmednagar": ["Select Taluka", "Akole", "Jamkhed", "Karjat", "Kopargaon", "Nagar", "Newasa", "Parner", "Pathardi", "Rahata", "Rahuri", "Sangamner", "Shevgaon", "Shrigonda", "Shrirampur"],
    "Akola": ["Select Taluka", "Akola", "Akot", "Balapur", "Barshitakli", "Murtizapur", "Patur", "Telhara"],
    "Amravati": ["Select Taluka", "Achalpur", "Amravati", "Anjangaon Surji", "Chandurbazar", "Chikhaldara", "Daryapur", "Dhamangaon Railway", "Morshi", "Warud"],
    "Aurangabad": ["Select Taluka", "Aurangabad", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon", "Vaijapur"],
    "Beed": ["Select Taluka", "Ambejogai", "Ashti", "Beed", "Georai", "Kaij", "Majalgaon", "Parli", "Patoda", "Shirur (Kasar)", "Wadwani"],
    "Bhandara": ["Select Taluka", "Bhandara", "Lakhandur", "Lakhani", "Mohadi", "Pauni", "Sakoli", "Tumsar"],
    "Buldhana": ["Select Taluka", "Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Khamgaon", "Lonar", "Malkapur", "Mehkar", "Motala", "Nandura", "Sangrampur", "Shegaon", "Sindkhed Raja"],
    "Chandrapur": ["Select Taluka", "Ballarpur", "Bhadrawati", "Brahmapuri", "Chandrapur", "Chimur", "Gondpipri", "Korpana", "Mul", "Nagbhid", "Pombhurna", "Rajura", "Saoli", "Sindewahi", "Warora"],
    "Dhule": ["Select Taluka", "Dhule", "Sakri", "Shirpur", "Sindkheda"],
    "Gadchiroli": ["Select Taluka", "Aheri", "Armori", "Bhamragad", "Chamorshi", "Desaiganj", "Dhanora", "Etapalli", "Gadchiroli", "Korchi", "Kurkheda", "Mulchera", "Sironcha"],
    "Gondia": ["Select Taluka", "Amgaon", "Arjuni Morgaon", "Deori", "Gondia", "Goregaon", "Sadak-Arjuni", "Salekasa", "Tirora"],
    "Hingoli": ["Select Taluka", "Aundha Nagnath", "Basmath", "Hingoli", "Kalamnuri", "Sengaon"],
    "Jalgaon": ["Select Taluka", "Amalner", "Bhadgaon", "Bhusawal", "Chalisgaon", "Chopda", "Dharangaon", "Erandol", "Jalgaon", "Jamner", "Muktainagar", "Pachora", "Parola", "Raver", "Yawal"],
    "Jalna": ["Select Taluka", "Ambad", "Badnapur", "Bhokardan", "Ghansawangi", "Jaffrabad", "Jalna", "Mantha", "Partur"],
    "Kolhapur": ["Select Taluka", "Ajra", "Bhudargad", "Chandgad", "Gadhinglaj", "Hatkanangle", "Kagal", "Karvir", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"],
    "Latur": ["Select Taluka", "Ahmadpur", "Ausa", "Chakur", "Deoni", "Jalkot", "Latur", "Nilanga", "Renapur", "Shirur-Anantpal", "Udgir"],
    "Mumbai City": ["Select Taluka", "Mumbai City"],
    "Mumbai Suburban": ["Select Taluka", "Andheri", "Borivali", "Kurla"],
    "Nagpur": ["Select Taluka", "Hingna", "Kamptee", "Katol", "Kuhi", "Nagpur Rural", "Nagpur Urban", "Narkhed", "Parseoni", "Ramtek", "Saoner", "Umred"],
    "Nanded": ["Select Taluka", "Ardhapur", "Bhokar", "Biloli", "Deglur", "Dharmabad", "Hadgaon", "Himayatnagar", "Kandhar", "Kinwat", "Loha", "Mahur", "Mudkhed", "Mukhed", "Naigaon", "Nanded", "Umri"],
    "Nandurbar": ["Select Taluka", "Akkalkuwa", "Akrani", "Nandurbar", "Navapur", "Shahada", "Talode"],
    "Nashik": ["Select Taluka", "Baglan", "Chandwad", "Deola", "Dindori", "Igatpuri", "Kalwan", "Malegaon", "Nandgaon", "Nashik", "Niphad", "Peth", "Sinnar", "Surgana", "Trimbakeshwar", "Yeola"],
    "Osmanabad": ["Select Taluka", "Bhum", "Kalamb", "Lohara", "Osmanabad", "Paranda", "Tuljapur", "Umarga", "Washi"],
    "Palghar": ["Select Taluka", "Dahanu", "Jawhar", "Mokhada", "Palghar", "Talasari", "Vada", "Vikramgad", "Vasai"],
    "Parbhani": ["Select Taluka", "Gangakhed", "Jintur", "Manwath", "Palam", "Parbhani", "Pathri", "Purna", "Sailu", "Sonpeth"],
    "Pune": ["Select Taluka", "Ambegaon", "Baramati", "Bhor", "Daund", "Haveli", "Indapur", "Junnar", "Khed", "Maval", "Mulshi", "Pune City", "Purandar", "Shirur", "Velhe"],
    "Raigad": ["Select Taluka", "Alibag", "Karjat", "Khalapur", "Mahad", "Mangaon", "Mhasla", "Murud", "Panvel", "Pen", "Poladpur", "Roha", "Shrivardhan", "Sudhagad", "Tala", "Uran"],
    "Ratnagiri": ["Select Taluka", "Chiplun", "Dapoli", "Guhagar", "Khed", "Lanja", "Mandangad", "Ratnagiri", "Sangameshwar"],
    "Sangli": ["Select Taluka", "Atpadi", "Jath", "Kadegaon", "Kavathemahankal", "Khanapur", "Miraj", "Palus", "Shirala", "Tasgaon", "Walwa"],
    "Satara": ["Select Taluka", "Jaoli", "Karad", "Khandala", "Khatav", "Koregaon", "Mahabaleshwar", "Man", "Patan", "Phaltan", "Satara", "Wai"],
    "Sindhudurg": ["Select Taluka", "Devgad", "Dodamarg", "Kankavli", "Kudal", "Malwan", "Sawantwadi", "Vaibhavvadi", "Vengurla"],
    "Solapur": ["Select Taluka", "Akkalkot", "Barshi", "Karmala", "Madha", "Malshiras", "Mangalvedhe", "Mohol", "Pandharpur", "Sangole", "Solapur North", "Solapur South"],
    "Thane": ["Select Taluka", "Ambernath", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Thane", "Ulhasnagar"],
    "Wardha": ["Select Taluka", "Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo", "Wardha"],
    "Washim": ["Select Taluka", "Karanja", "Malegaon", "Mangrulpir", "Manora", "Risod", "Washim"],
    "Yavatmal": ["Select Taluka", "Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Mahagaon", "Maregaon", "Ner", "Pandharkaoda", "Pusad", "Ralegaon", "Umarkhed", "Wani", "Yavatmal", "Zari-Jamani"]
  };

  // Education data
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
      formData.append('postDocumentId', postDocumentId);
      formData.append('webUrl', webUrl);
      formData.append('type', type);
      formData.append('pageType', pageType);
      formData.append('isSpecific', isSpecific);
      formData.append('otherType', isSpecific ? otherType : '');
      formData.append('educationCategories', JSON.stringify(isSpecific && otherType === 'education' ? educationCategories : []));
      formData.append('bachelorDegrees', JSON.stringify(isSpecific && otherType === 'education' && !educationCategories.includes("All") ? bachelorDegrees : []));
      formData.append('mastersDegrees', JSON.stringify(isSpecific && otherType === 'education' && !educationCategories.includes("All") ? mastersDegrees : []));
      formData.append('selectedDistrict', isSpecific && otherType === 'location' ? (Array.isArray(selectedDistrict) && selectedDistrict.length === districts.filter(d => d !== "Select District").length ? 'All' : JSON.stringify(selectedDistrict)) : '');
      formData.append('selectedTaluka', isSpecific && otherType === 'location' ? (Array.isArray(selectedDistrict) && selectedDistrict.length === districts.filter(d => d !== "Select District").length ? 'All' : JSON.stringify(selectedTaluka)) : '');
      formData.append('ageGroups', JSON.stringify(isSpecific && otherType === 'age group' ? ageGroups : []));
      formData.append('notification', notification);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('/api/sliders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (notification) {
        let fcmTopics = [];
        if (isSpecific && otherType === 'education') {
          if (educationCategories.includes("All")) {
            fcmTopics = ["all"];
          } else if (educationCategories.includes("10th") || educationCategories.includes("12th")) {
            fcmTopics = educationCategories.filter(cat => cat === "10th" || cat === "12th");
          } else {
            fcmTopics = bachelorDegrees.length > 0 ? bachelorDegrees : ["general"];
          }
        } else if (isSpecific && otherType === 'location') {
          if (Array.isArray(selectedDistrict) && selectedDistrict.length === districts.filter(d => d !== "Select District").length) {
            fcmTopics = ["all"];
          } else {
            fcmTopics = Array.isArray(selectedTaluka) ? selectedTaluka : ["general"];
          }
        } else if (isSpecific && otherType === 'age group') {
          fcmTopics = ageGroups.length > 0 ? ageGroups : ["general"];
        } else {
          fcmTopics = ["general"];
        }

        for (const topic of fcmTopics) {
          const firebaseData = {
            topic: topic,
            data: {
              notificationType: "slider",
              title: title,
              postDocumentId: postDocumentId,
              webUrl: webUrl,
              type: type,
              pageType: pageType,
              isSpecific: isSpecific.toString(),
              otherType: otherType,
              educationCategories: JSON.stringify(isSpecific && otherType === 'education' ? educationCategories : []),
              bachelorDegrees: JSON.stringify(isSpecific && otherType === 'education' && !educationCategories.includes("All") ? bachelorDegrees : []),
              mastersDegrees: JSON.stringify(isSpecific && otherType === 'education' && !educationCategories.includes("All") ? mastersDegrees : []),
              selectedDistrict: isSpecific && otherType === 'location' ? (Array.isArray(selectedDistrict) && selectedDistrict.length === districts.filter(d => d !== "Select District").length ? 'All' : JSON.stringify(selectedDistrict)) : '',
              selectedTaluka: isSpecific && otherType === 'location' ? (Array.isArray(selectedDistrict) && selectedDistrict.length === districts.filter(d => d !== "Select District").length ? 'All' : JSON.stringify(selectedTaluka)) : '',
              ageGroups: JSON.stringify(isSpecific && otherType === 'age group' ? ageGroups : []),
              timestamp: new Date().toISOString()
            }
          };
          await axios.post("https://admin.mahaalert.cloud/api/firebase/send-notification", firebaseData);
        }
      }
      toast.success("Slider saved successfully!", { position: "top-right" });

      // Reset form
      setTitle("");
      setPostDocumentId("");
      setWebUrl("");
      setType("");
      setPageType("");
      setIsSpecific(false);
      setOtherType("");
      setEducationCategories([]);
      setBachelorDegrees([]);
      setMastersDegrees([]);
      setSelectedDistrict("");
      setSelectedTaluka("");
      setAgeGroups([]);
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
            Slider Management
          </Typography>
          
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Page Type</InputLabel>
                <Select
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                  label="Page Type"
                >
                  <MenuItem value="">Select Page Type</MenuItem>
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="chat">Chat</MenuItem>
                  <MenuItem value="banking jobs">Banking Jobs</MenuItem>
                  <MenuItem value="private jobs">Private Jobs</MenuItem>
                  <MenuItem value="government jobs">Government Jobs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="post">Post</MenuItem>
                  <MenuItem value="news">News</MenuItem>
                  <MenuItem value="promotion">Promotion</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              {type === "promotion" ? (
                <TextField
                  fullWidth
                  label="Enter Web URL"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  variant="outlined"
                  type="url"
                />
              ) : (
                <TextField
                  fullWidth
                  label={`Enter ${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Document ID`}
                  value={postDocumentId}
                  onChange={(e) => setPostDocumentId(e.target.value)}
                  variant="outlined"
                />
              )}
            </Grid>

            {/* Checkboxes and Other Type Row */}
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '56px', display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSpecific}
                      onChange={(e) => {
                        setIsSpecific(e.target.checked);
                        if (!e.target.checked) {
                          setOtherType("");
                          setEducationCategories([]);
                          setBachelorDegrees([]);
                          setMastersDegrees([]);
                          setSelectedDistrict("");
                          setSelectedTaluka("");
                        }
                      }}
                      color="primary"
                    />
                  }
                  label="Is Specific"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ height: '56px' }}>
                <InputLabel>Other Type</InputLabel>
                <Select
                  value={otherType}
                  onChange={(e) => {
                    setOtherType(e.target.value);
                    setEducationCategories([]);
                    setBachelorDegrees([]);
                    setMastersDegrees([]);
                    setSelectedDistrict("");
                    setSelectedTaluka("");
                    setAgeGroups([]);
                  }}
                  label="Other Type"
                  disabled={!isSpecific}
                >
                  <MenuItem value="">Select Other Type</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="location">Location</MenuItem>
                  <MenuItem value="age group">Age Group</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Education/Location Row */}
            {isSpecific && otherType === "education" && (
              <>
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
                          setEducationCategories(["All"]);
                          const allBachelors = [...new Set(Object.values(degreeMap).flat())];
                          const allMasters = [...new Set(Object.values(postGradMap).flat())];
                          setBachelorDegrees(allBachelors);
                          setMastersDegrees(allMasters);
                        } else if (lastSelected === "10th_12th") {
                          setEducationCategories(["10th_12th"]);
                          setBachelorDegrees([]);
                          setMastersDegrees([]);
                        } else if (educationCategories.includes("All") || educationCategories.includes("10th_12th")) {
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
              </>
            )}
            {isSpecific && otherType === "location" && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      multiple
                      value={Array.isArray(selectedDistrict) ? selectedDistrict : []}
                      onChange={(e) => {
                        const value = e.target.value;
                        const allDistricts = districts.filter(d => d !== "Select District");
                        
                        if (value.includes("All")) {
                          if (Array.isArray(selectedDistrict) && selectedDistrict.length === allDistricts.length) {
                            setSelectedDistrict([]);
                            setSelectedTaluka([]);
                          } else {
                            setSelectedDistrict(allDistricts);
                            const allTalukas = [...new Set(allDistricts.flatMap(dist => talukaMap[dist] ? talukaMap[dist].filter(t => t !== "Select Taluka") : []))];
                            setSelectedTaluka(allTalukas);
                          }
                        } else {
                          setSelectedDistrict(value);
                          const allTalukas = [...new Set(value.flatMap(dist => talukaMap[dist] ? talukaMap[dist].filter(t => t !== "Select Taluka") : []))];
                          setSelectedTaluka(allTalukas);
                        }
                      }}
                      input={<OutlinedInput label="District" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem key="All" value="All">
                        <Checkbox checked={Array.isArray(selectedDistrict) && selectedDistrict.length === districts.filter(d => d !== "Select District").length && selectedDistrict.length > 0} />
                        All
                      </MenuItem>
                      {districts.filter(d => d !== "Select District").map((district) => (
                        <MenuItem key={district} value={district}>
                          <Checkbox checked={Array.isArray(selectedDistrict) && selectedDistrict.indexOf(district) > -1} />
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!Array.isArray(selectedDistrict) || selectedDistrict.length === 0}>
                    <InputLabel>Taluka</InputLabel>
                    <Select
                      multiple
                      value={Array.isArray(selectedTaluka) ? selectedTaluka : []}
                      onChange={(e) => {
                        const value = e.target.value;
                        const availableTalukas = Array.isArray(selectedDistrict) && [...new Set(selectedDistrict.flatMap(dist => talukaMap[dist] ? talukaMap[dist].filter(t => t !== "Select Taluka") : []))];
                        
                        if (value.includes("All")) {
                          if (Array.isArray(selectedTaluka) && selectedTaluka.length === availableTalukas.length) {
                            setSelectedTaluka([]);
                          } else {
                            setSelectedTaluka(availableTalukas);
                          }
                        } else {
                          setSelectedTaluka(value);
                        }
                      }}
                      input={<OutlinedInput label="Taluka" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem key="All" value="All">
                        <Checkbox checked={Array.isArray(selectedTaluka) && Array.isArray(selectedDistrict) && selectedTaluka.length === [...new Set(selectedDistrict.flatMap(dist => talukaMap[dist] ? talukaMap[dist].filter(t => t !== "Select Taluka") : []))].length && selectedTaluka.length > 0} />
                        All
                      </MenuItem>
                      {Array.isArray(selectedDistrict) && [...new Set(selectedDistrict.flatMap(dist => talukaMap[dist] ? talukaMap[dist].filter(t => t !== "Select Taluka") : []))].map((taluka) => (
                        <MenuItem key={taluka} value={taluka}>
                          <Checkbox checked={Array.isArray(selectedTaluka) && selectedTaluka.indexOf(taluka) > -1} />
                          {taluka}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            {isSpecific && otherType === "age group" && (
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Age Groups</InputLabel>
                  <Select
                    multiple
                    value={ageGroups}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.includes("All")) {
                        setAgeGroups([]);
                      } else {
                        setAgeGroups(value);
                      }
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
                      <Checkbox checked={false} />
                      All (Unselect All)
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
            )}

            {/* File Upload and Save Button Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} className="file-upload-card">
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
                {imagePreview && (
                  <Box sx={{ mt: 1 }}>
                    <img src={imagePreview} alt="Image preview" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                  </Box>
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
                {loading ? "Saving..." : "Save Slider"}
              </Button>
            </Grid>


          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SliderPage;