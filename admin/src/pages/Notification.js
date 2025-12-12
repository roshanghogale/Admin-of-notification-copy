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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Chip,
  OutlinedInput
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function Notification() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(false);
  const [fileChosen, setFileChosen] = useState(false);

  const [isSpecific, setIsSpecific] = useState(false);
  const [otherType, setOtherType] = useState("");
  const [educationCategories, setEducationCategories] = useState([]);
  const [bachelorDegrees, setBachelorDegrees] = useState([]);
  const [mastersDegrees, setMastersDegrees] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [ageGroups, setAgeGroups] = useState([]);

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

  const ageGroupOptions = ["१४ ते १८", "१९ ते २५", "२६ ते ३१", "३२ पेक्षा जास्त"];

  // Education data
  const educationOptions = [
    "All", "10th", "12th", "Education", "Arts", "Commerce", "Engineering (Degree)", "Diploma (Polytechnic)",
    "Medical", "Dental", "ITI", "Pharmacy", "Agriculture",
    "Computer Science/IT", "Nursing", "Law", "Veterinary",
    "Journalism", "Management", "Hotel Management",
    "Animation & Multimedia", "Other B.Sc", "Other"
  ];

  const degreeMap = {
    "All": ["All"],
    "10th": [],
    "12th": [],
    "Education": ["B.Ed", "BA B.Ed", "Other"],
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
    "Education": ["M.Ed", "None"],
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

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  const handleWebUrlChange = (e) => setWebUrl(e.target.value);

  const handlePushNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let fcmTopics = [];
      
      if (isSpecific && otherType === "education") {
        if (educationCategories.includes("All")) {
          fcmTopics = ["all"];
        } else if (educationCategories.includes("10th") || educationCategories.includes("12th")) {
          fcmTopics = educationCategories.filter(cat => cat === "10th" || cat === "12th");
        } else {
          fcmTopics = bachelorDegrees.length > 0 ? bachelorDegrees : ["general"];
        }
      } else if (isSpecific && otherType === "location") {
        if (selectedDistrict === "All") {
          fcmTopics = ["all"];
        } else {
          fcmTopics = selectedTaluka ? [selectedTaluka] : ["general"];
        }
      } else if (isSpecific && otherType === "age group") {
        fcmTopics = ageGroups.length > 0 ? ageGroups : ["general"];
      } else {
        fcmTopics = ["general"];
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('documentId', webUrl);
      formData.append('isSpecific', isSpecific);
      formData.append('otherType', otherType);
      formData.append('educationCategories', JSON.stringify(isSpecific && otherType === "education" ? educationCategories : []));
      formData.append('bachelorDegrees', JSON.stringify(isSpecific && otherType === "education" && !educationCategories.includes("All") ? bachelorDegrees : []));
      formData.append('mastersDegrees', JSON.stringify(isSpecific && otherType === "education" && !educationCategories.includes("All") ? mastersDegrees : []));
      formData.append('district', isSpecific && otherType === "location" ? selectedDistrict : "");
      formData.append('taluka', isSpecific && otherType === "location" ? selectedTaluka : "");
      formData.append('ageGroups', JSON.stringify(isSpecific && otherType === "age group" ? ageGroups : []));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Store notification with image in database
      const storeResult = await axios.post(
        "http://localhost:3000/api/notification-files",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (storeResult.status === 201) {
        const storedNotification = storeResult.data.notificationFile;
        const finalImageUrl = storedNotification.image_url ? `http://localhost:3000${storedNotification.image_url}` : "";
        
        // Send Firebase notification
        for (const topic of fcmTopics) {
          const firebaseData = {
            topic: topic,
            data: {
              notificationType: "general_notification",
              title: title,
              body: body,
              imageUrl: finalImageUrl,
              documentId: webUrl,
              isSpecific: isSpecific.toString(),
              otherType: otherType,
              educationCategories: JSON.stringify(isSpecific && otherType === "education" ? educationCategories : []),
              bachelorDegrees: JSON.stringify(isSpecific && otherType === "education" && !educationCategories.includes("All") ? bachelorDegrees : []),
              mastersDegrees: JSON.stringify(isSpecific && otherType === "education" && !educationCategories.includes("All") ? mastersDegrees : []),
              district: isSpecific && otherType === "location" ? selectedDistrict : "",
              taluka: isSpecific && otherType === "location" ? selectedTaluka : "",
              ageGroups: JSON.stringify(isSpecific && otherType === "age group" ? ageGroups : []),
              timestamp: new Date().toISOString()
            }
          };

          await axios.post(
            "http://localhost:3000/api/firebase/send-notification",
            firebaseData
          );
        }
        
        toast.success("Notification sent successfully", {
          position: "top-right",
        });
        
        // Reset form
        setTitle("");
        setBody("");
        setWebUrl("");
        setImageUrl("");
        setImageFile(null);
        setFileChosen(false);
        setUploadedImage(false);
        setIsSpecific(false);
        setOtherType("");
        setEducationCategories([]);
        setBachelorDegrees([]);
        setMastersDegrees([]);
        setSelectedDistrict("");
        setSelectedTaluka("");
        setAgeGroups([]);
      } else {
        toast.error("Failed to send notification", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("An error occurred", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setFileChosen(true);
    setUploadedImage(false);
    toast.info("Image selected successfully!", { position: "top-right" });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <ToastContainer />
      <Card elevation={3} className="form-card">
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" className="page-title" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
            Manage Notifications
          </Typography>
          
          <Grid container spacing={3}>
            {/* Title and Body */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={handleTitleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Body"
                value={body}
                onChange={handleBodyChange}
                variant="outlined"
                required
              />
            </Grid>

            {/* Document ID and Other Type */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Document ID"
                value={webUrl}
                onChange={handleWebUrlChange}
                variant="outlined"
                placeholder="Enter the document ID"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
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

            {/* Education Selection (3 parts) */}
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
                          setBachelorDegrees([]);
                          setMastersDegrees([]);
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

            {/* Location Selection (2 parts) */}
            {isSpecific && otherType === "location" && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        setSelectedTaluka("");
                      }}
                      label="District"
                    >
                      {districts.map((district) => (
                        <MenuItem key={district} value={district}>{district}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!selectedDistrict || selectedDistrict === "Select District"}>
                    <InputLabel>Taluka</InputLabel>
                    <Select
                      value={selectedTaluka}
                      onChange={(e) => setSelectedTaluka(e.target.value)}
                      label="Taluka"
                    >
                      {selectedDistrict && talukaMap[selectedDistrict]?.map((taluka) => (
                        <MenuItem key={taluka} value={taluka}>{taluka}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Age Group Selection */}
            {isSpecific && otherType === "age group" && (
              <Grid item xs={12} md={12}>
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
            )}

            {/* File Upload and Controls */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="file-upload-card">
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary" fontWeight={600}>
                    Notification Image
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
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                  {fileChosen ? `Selected: ${imageFile?.name}` : "No image selected"}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                            setAgeGroups([]);
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="Is Specific"
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handlePushNotification}
                    disabled={loading}
                    fullWidth
                    className="submit-button"
                    sx={{ py: 2, fontSize: '1.1rem' }}
                  >
                    {loading ? "Sending..." : "Send Notification"}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Notification;