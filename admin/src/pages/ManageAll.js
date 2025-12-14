import React, { useState } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import {
  Box, Card, CardContent, CardMedia, Typography, Button, Grid, 
  FormControl, InputLabel, Select, MenuItem, Modal, Chip,
  CircularProgress, IconButton, Tooltip, Paper,
  Dialog, TextField
} from "@mui/material";
import {
  ContentCopy, Visibility, Image, PictureAsPdf, VideoFile,
  Link as LinkIcon, DateRange, Person, Category, Delete, Edit,
  Add, Remove
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ManageAll.css";

// Add keyframes for animations
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  @keyframes dangerPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #ff1744); }
    50% { transform: scale(1.1); filter: drop-shadow(0 0 30px #ff1744) drop-shadow(0 0 40px #ff1744); }
  }
  @keyframes dangerRing {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes borderGlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes textGlow {
    0% { text-shadow: 0 0 30px rgba(255, 23, 68, 0.5); }
    100% { text-shadow: 0 0 40px rgba(255, 23, 68, 0.8), 0 0 60px rgba(255, 23, 68, 0.3); }
  }
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes colorChange {
    0% { background-color: #667eea; }
    25% { background-color: #764ba2; }
    50% { background-color: #4facfe; }
    75% { background-color: #00f2fe; }
    100% { background-color: #43e97b; }
  }
  @keyframes headerColorChange {
    0% { background: linear-gradient(135deg, #667eea, #764ba2); }
    25% { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    50% { background: linear-gradient(135deg, #43e97b, #38f9d7); }
    75% { background: linear-gradient(135deg, #a8edea, #fed6e3); }
    100% { background: linear-gradient(135deg, #667eea, #764ba2); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}

function ManageAll() {
  const [selectedType, setSelectedType] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDocument, setEditedDocument] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  const collectionTypes = [
    { value: "career_roadmaps", label: "Career Roadmap", icon: "🗺️", color: "#f57c00" },
    { value: "career_roadmap_sliders", label: "Career Roadmap Sliders", icon: "🎬", color: "#ff9800" },
    { value: "current_affairs", label: "Current Affairs", icon: "📊", color: "#d32f2f" },
    { value: "freeStudyMaterialGovernment", label: "Free Study Material - Government", icon: "🏛️", color: "#512da8" },
    { value: "freeStudyMaterialPolice", label: "Free Study Material - Police & Defence", icon: "👮", color: "#689f38" },
    { value: "freeStudyMaterialBanking", label: "Free Study Material - Banking", icon: "🏦", color: "#00796b" },
    { value: "freeStudyMaterialSelf", label: "Free Study Material - Self Improvement", icon: "📈", color: "#ff5722" },
    { value: "job_updates", label: "Job Updates", icon: "💼", color: "#1976d2" },
    { value: "news", label: "News", icon: "📰", color: "#388e3c" },
    { value: "notification_files", label: "Notification Files", icon: "🔔", color: "#9c27b0" },

    { value: "result_hallticket_updates", label: "Result & Hall Ticket Updates", icon: "🎓", color: "#5d4037" },
    { value: "sliders", label: "Sliders", icon: "🖼️", color: "#e64a19" },
    { value: "stories", label: "Stories", icon: "📖", color: "#1565c0" },
    { value: "student_updates", label: "Student Updates", icon: "👨🎓", color: "#fbc02d" },

  ];

  const deleteFromStorage = async (url) => {
    if (!url || !url.includes('firebase')) return;
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting from storage:', error);
    }
  };

  const extractStorageUrls = (obj) => {
    const urls = [];
    const traverse = (item) => {
      if (typeof item === 'string' && item.includes('firebase')) {
        urls.push(item);
      } else if (typeof item === 'object' && item !== null) {
        Object.values(item).forEach(traverse);
      } else if (Array.isArray(item)) {
        item.forEach(traverse);
      }
    };
    traverse(obj);
    return urls;
  };

  const handleDeleteAll = async () => {
    if (!selectedType) return;
    try {
      let response;
      if (selectedType === 'job_updates') {
        response = await fetch('/api/job-updates', { method: 'DELETE' });
      }
      // Add other types as needed
      
      if (response && response.ok) {
        setDocuments([]);
        toast.success('All documents deleted successfully!');
      } else {
        throw new Error('Delete all failed');
      }
    } catch (error) {
      console.error('Error deleting all documents:', error);
      toast.error('Failed to delete all documents');
    } finally {
      setDeleteAllConfirm(false);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    try {
      let response;
      if (selectedType === 'job_updates') {
        response = await fetch(`/api/job-updates/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'current_affairs') {
        response = await fetch(`/api/current-affairs/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'career_roadmaps') {
        response = await fetch(`/api/career-roadmaps/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'student_updates') {
        response = await fetch(`/api/student-updates/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'result_hallticket_updates') {
        response = await fetch(`/api/result-halltickets/${documentToDelete.id}`, { method: 'DELETE' });

      } else if (selectedType === 'stories') {
        response = await fetch(`/api/stories/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'sliders') {
        response = await fetch(`/api/sliders/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType.startsWith('freeStudyMaterial')) {
        response = await fetch(`/api/study-materials/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'news') {
        response = await fetch(`/api/news/${documentToDelete.id}`, { method: 'DELETE' });

      } else if (selectedType === 'notification_files') {
        response = await fetch(`/api/notification-files/${documentToDelete.id}`, { method: 'DELETE' });
      } else if (selectedType === 'career_roadmap_sliders') {
        response = await fetch(`/api/career-roadmap-sliders/${documentToDelete.id}`, { method: 'DELETE' });
      } else {
        const urls = extractStorageUrls(documentToDelete);
        await Promise.all(urls.map(deleteFromStorage));
        await deleteDoc(doc(db, selectedType, documentToDelete.id));
      }
      
      if (response && !response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
      
      setDocuments(prev => prev.filter(d => d.id !== documentToDelete.id));
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeleteConfirm(false);
      setDocumentToDelete(null);
    }
  };

  const handleEdit = (document) => {
    setEditedDocument({ ...document });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const { id, ...updateData } = editedDocument;
      if (selectedType === 'job_updates') {
        const response = await fetch(`/api/job-updates/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Job update updated successfully!');
        }
      } else if (selectedType === 'current_affairs') {
        const response = await fetch(`/api/current-affairs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Current affairs updated successfully!');
        }
      } else if (selectedType === 'career_roadmaps') {
        const response = await fetch(`/api/career-roadmaps/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Career roadmap updated successfully!');
        }
      } else if (selectedType === 'student_updates') {
        const response = await fetch(`/api/student-updates/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Student update updated successfully!');
        }
      } else if (selectedType === 'result_hallticket_updates') {
        const response = await fetch(`/api/result-halltickets/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Result/Hall ticket update updated successfully!');
        }

      } else if (selectedType === 'stories') {
        const response = await fetch(`/api/stories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Story updated successfully!');
        }
      } else if (selectedType === 'sliders') {
        const response = await fetch(`/api/sliders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Slider updated successfully!');
        }
      } else if (selectedType.startsWith('freeStudyMaterial')) {
        const response = await fetch(`/api/study-materials/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Study material updated successfully!');
        }
      } else if (selectedType === 'news') {
        const response = await fetch(`/api/news/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('News updated successfully!');
        }

      } else if (selectedType === 'notification_files') {
        const response = await fetch(`/api/notification-files/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Notification file updated successfully!');
        }
      } else if (selectedType === 'career_roadmap_sliders') {
        const response = await fetch(`/api/career-roadmap-sliders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (response.ok) {
          setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
          toast.success('Career roadmap slider updated successfully!');
        }
      } else {
        await updateDoc(doc(db, selectedType, id), updateData);
        setDocuments(prev => prev.map(d => d.id === id ? editedDocument : d));
        toast.success('Document updated successfully!');
      }
      setEditMode(false);
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const handleFieldChange = (key, value) => {
    setEditedDocument(prev => ({ ...prev, [key]: value }));
  };

  const fetchDocuments = async (collectionName) => {
    setLoading(true);
    try {
      if (collectionName === 'job_updates') {
        const response = await fetch('/api/job-updates');
        const data = await response.json();
        setDocuments(data.jobUpdates || []);
      } else if (collectionName === 'current_affairs') {
        const response = await fetch('/api/current-affairs');
        const data = await response.json();
        setDocuments(data.currentAffairs || []);
      } else if (collectionName === 'career_roadmaps') {
        const response = await fetch('/api/career-roadmaps');
        const data = await response.json();
        setDocuments(data.careerRoadmaps || []);
      } else if (collectionName === 'student_updates') {
        console.log('Fetching student updates...');
        const response = await fetch('/api/student-updates');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Student updates data:', data);
        setDocuments(data.studentUpdates || []);
        console.log('Documents set:', data.studentUpdates || []);
      } else if (collectionName === 'result_hallticket_updates') {
        const response = await fetch('/api/result-halltickets');
        const data = await response.json();
        setDocuments(data.resultHalltickets || []);

      } else if (collectionName === 'stories') {
        const response = await fetch('/api/stories');
        const data = await response.json();
        setDocuments(data.stories || []);
      } else if (collectionName === 'sliders') {
        const response = await fetch('/api/sliders');
        const data = await response.json();
        setDocuments(data.sliders || []);
      } else if (collectionName.startsWith('freeStudyMaterial')) {
        const response = await fetch('/api/study-materials');
        const data = await response.json();
        const filteredData = data.studyMaterials.filter(item => {
          let type = collectionName.replace('freeStudyMaterial', '').toLowerCase();
          if (type === 'police') type = 'police & defence';
          if (type === 'self') type = 'self improvement';
          return item.type === type;
        });
        setDocuments(filteredData || []);
      } else if (collectionName === 'news') {
        const response = await fetch('/api/news');
        const data = await response.json();
        setDocuments(data.news || []);

      } else if (collectionName === 'notification_files') {
        const response = await fetch('/api/notification-files');
        const data = await response.json();
        setDocuments(data.notificationFiles || []);
      } else if (collectionName === 'career_roadmap_sliders') {
        const response = await fetch('/api/career-roadmap-sliders');
        const data = await response.json();
        setDocuments(data.careerRoadmapSliders || []);
      } else {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        const docsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(docsList);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      console.error('Collection name was:', collectionName);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    if (type) {
      fetchDocuments(type);
    } else {
      setDocuments([]);
    }
  };

  const copyToClipboard = (text, label = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleDocumentClick = async (docId) => {
    try {
      if (selectedType === 'job_updates') {
        const response = await fetch(`/api/job-updates`);
        const data = await response.json();
        const jobUpdate = data.jobUpdates.find(job => job.id == docId);
        if (jobUpdate) {
          setSelectedDocument(jobUpdate);
          setShowModal(true);
        }
      } else if (selectedType === 'current_affairs') {
        const response = await fetch(`/api/current-affairs`);
        const data = await response.json();
        const currentAffair = data.currentAffairs.find(item => item.id == docId);
        if (currentAffair) {
          setSelectedDocument(currentAffair);
          setShowModal(true);
        }
      } else if (selectedType === 'career_roadmaps') {
        const response = await fetch(`/api/career-roadmaps`);
        const data = await response.json();
        const careerRoadmap = data.careerRoadmaps.find(item => item.id == docId);
        if (careerRoadmap) {
          setSelectedDocument(careerRoadmap);
          setShowModal(true);
        }
      } else if (selectedType === 'student_updates') {
        const response = await fetch(`/api/student-updates`);
        const data = await response.json();
        const studentUpdate = data.studentUpdates.find(item => item.id == docId);
        if (studentUpdate) {
          setSelectedDocument(studentUpdate);
          setShowModal(true);
        }
      } else if (selectedType === 'result_hallticket_updates') {
        const response = await fetch(`/api/result-halltickets`);
        const data = await response.json();
        const resultHallticket = data.resultHalltickets.find(item => item.id == docId);
        if (resultHallticket) {
          setSelectedDocument(resultHallticket);
          setShowModal(true);
        }

      } else if (selectedType === 'stories') {
        const response = await fetch(`/api/stories`);
        const data = await response.json();
        const story = data.stories.find(item => item.id == docId);
        if (story) {
          setSelectedDocument(story);
          setShowModal(true);
        }
      } else if (selectedType === 'sliders') {
        const response = await fetch(`/api/sliders`);
        const data = await response.json();
        const slider = data.sliders.find(item => item.id == docId);
        if (slider) {
          setSelectedDocument(slider);
          setShowModal(true);
        }
      } else if (selectedType.startsWith('freeStudyMaterial')) {
        const response = await fetch(`/api/study-materials`);
        const data = await response.json();
        const material = data.studyMaterials.find(item => item.id == docId);
        if (material) {
          setSelectedDocument(material);
          setShowModal(true);
        }
      } else if (selectedType === 'news') {
        const response = await fetch(`/api/news`);
        const data = await response.json();
        const newsItem = data.news.find(item => item.id == docId);
        if (newsItem) {
          setSelectedDocument(newsItem);
          setShowModal(true);
        }

      } else if (selectedType === 'notification_files') {
        const response = await fetch(`/api/notification-files`);
        const data = await response.json();
        const notificationFile = data.notificationFiles.find(item => item.id == docId);
        if (notificationFile) {
          setSelectedDocument(notificationFile);
          setShowModal(true);
        }
      } else if (selectedType === 'career_roadmap_sliders') {
        const response = await fetch(`/api/career-roadmap-sliders`);
        const data = await response.json();
        const slider = data.careerRoadmapSliders.find(item => item.id == docId);
        if (slider) {
          setSelectedDocument(slider);
          setShowModal(true);
        }
      } else {
        const docRef = doc(db, selectedType, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSelectedDocument({ id: docId, ...docSnap.data() });
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      toast.error("Failed to fetch document details");
    }
  };

  const getFieldIcon = (key, value) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('image') || keyLower.includes('icon') || keyLower.includes('banner')) return <Image />;
    if (keyLower.includes('pdf')) return <PictureAsPdf />;

    if (keyLower.includes('url') || keyLower.includes('link') || keyLower.includes('web')) return <LinkIcon />;
    if (keyLower.includes('date') || keyLower.includes('timestamp') || keyLower.includes('time')) return <DateRange />;
    if (keyLower.includes('category') || keyLower.includes('type')) return <Category />;
    if (keyLower.includes('title') || keyLower.includes('name')) return <Person />;
    if (keyLower.includes('description') || keyLower.includes('content') || keyLower.includes('detail')) return <Person />;
    return <Person />;
  };

  const handleArrayItemChange = (key, index, newValue) => {
    const newArray = [...editedDocument[key]];
    newArray[index] = newValue;
    handleFieldChange(key, newArray);
  };

  const handleArrayItemAdd = (key) => {
    const newArray = [...(editedDocument[key] || []), ''];
    handleFieldChange(key, newArray);
  };

  const handleArrayItemRemove = (key, index) => {
    const newArray = editedDocument[key].filter((_, i) => i !== index);
    handleFieldChange(key, newArray);
  };

  const handleObjectFieldChange = (key, objKey, newValue) => {
    const newObj = { ...editedDocument[key], [objKey]: newValue };
    handleFieldChange(key, newObj);
  };

  const renderValue = (key, value, isEditing = false) => {
    if (isEditing) {
      if (Array.isArray(value)) {
        return (
          <TextField
            fullWidth
            value={JSON.stringify(value)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(key, parsed);
              } catch {
                handleFieldChange(key, e.target.value);
              }
            }}
            placeholder={`Enter ${key}...`}
          />
        );
      }
      if (typeof value === 'object' && value !== null && !value.toDate) {

        return (
          <Box>
            {Object.entries(value).map(([objKey, objValue]) => (
              <Box key={objKey} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{objKey}:</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={objValue || ''}
                  onChange={(e) => handleObjectFieldChange(key, objKey, e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            ))}
          </Box>
        );
      }

      

      
      // For description fields, use multiline TextField
      const isDescriptionField = key.toLowerCase().includes('description') || 
                                key.toLowerCase().includes('content') || 
                                key.toLowerCase().includes('body') || 
                                key.toLowerCase().includes('detail');
      
      return (
        <TextField
          fullWidth
          multiline={isDescriptionField}
          rows={isDescriptionField ? 4 : 1}
          value={value || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          placeholder={isDescriptionField ? 'Enter description...' : `Enter ${key}...`}
        />
      );
    }

    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0)) {
      const isDescriptionField = key.toLowerCase().includes('description') || 
                                key.toLowerCase().includes('content') || 
                                key.toLowerCase().includes('body') || 
                                key.toLowerCase().includes('detail');
      
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2,
          bgcolor: isDescriptionField ? '#fff3e0' : '#f5f5f5',
          borderRadius: 2,
          border: isDescriptionField ? '2px dashed #ff9800' : '2px dashed #ccc'
        }}>
          <Typography variant="body2" sx={{ 
            color: isDescriptionField ? '#f57c00' : '#999',
            fontStyle: 'italic',
            fontWeight: 500
          }}>
            {isDescriptionField ? '📝 No description added yet' : '📭 Nothing here'}
          </Typography>
        </Box>
      );
    }
    
    if (typeof value === "boolean") {
      return <Chip label={value ? "True" : "False"} color={value ? "success" : "default"} size="small" />;
    }
    
    if (typeof value === "object" && value.toDate) {
      return (
        <Chip 
          icon={<DateRange />} 
          label={value.toDate().toLocaleString()} 
          color="info" 
          size="small" 
        />
      );
    }
    
    if (typeof value === "object") {

      return (
        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          {Object.entries(value).map(([objKey, objValue]) => (
            <Box key={objKey} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={objKey}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mr: 1, minWidth: 80 }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {String(objValue)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    
    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="primary" fontSize="small" />
          <Typography 
            component="a" 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </Typography>
        </Box>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          {value.map((item, index) => {
            let displayText;
            try {
              displayText = typeof item === 'object' ? JSON.stringify(item) : String(item);
            } catch (e) {
              displayText = String(item);
            }
            return (
              <Chip 
                key={index}
                label={`${index + 1}. ${displayText}`}
                variant="outlined"
                size="small"
                sx={{ m: 0.5, maxWidth: '100%' }}
              />
            );
          })}
        </Box>
      );
    }
    
    return <Typography variant="body2">{String(value)}</Typography>;
  };

  const getSelectedTypeInfo = () => {
    return collectionTypes.find(type => type.value === selectedType);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ToastContainer position="top-right" />
      
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
          📋 Manage All Collections
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Collection Type</InputLabel>
              <Select value={selectedType} onChange={handleTypeChange} label="Select Collection Type">
                <MenuItem value="">Choose a collection type...</MenuItem>
                {collectionTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{type.icon}</span>
                      <Typography>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {selectedType && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  icon={<span>{getSelectedTypeInfo()?.icon}</span>}
                  label={`${documents.length} documents`}
                  color="primary"
                  sx={{ fontSize: '1rem', p: 1 }}
                />
                {documents.length > 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => setDeleteAllConfirm(true)}
                    sx={{ ml: 1 }}
                  >
                    Delete All
                  </Button>
                )}
                {loading && <CircularProgress size={24} />}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {!loading && documents.length > 0 && (
        <Grid container spacing={2}>
          {documents.map((document) => {
            const imageUrl = document.imageUrl || document.image_url || document.bannerUrl || document.banner_url || document.iconUrl || document.icon_url || document.pdf_url || null;
            const displayImageUrl = imageUrl && !imageUrl.startsWith('http') ? `http://69.62.77.179:3000${imageUrl}` : imageUrl?.replace('https://test.gangainstitute.in', 'http://43.205.194.195:3000');
            

            
            return (
              <Grid key={document.id} item xs={12} sm={6} md={4} lg={2.4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  {displayImageUrl ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={displayImageUrl}
                      alt="Document image"
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <Box
                    sx={{
                      height: 140,
                      background: `linear-gradient(135deg, ${getSelectedTypeInfo()?.color || '#1976d2'}, ${getSelectedTypeInfo()?.color || '#1976d2'}88)`,
                      display: displayImageUrl ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem'
                    }}
                  >
                    {getSelectedTypeInfo()?.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {selectedType === 'career_roadmap_sliders' 
                        ? `Career Slider ${document.id}` 
                        : (document.title || document.name || `Document ${document.id.toString().slice(0, 8)}`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {(() => {
                        if (selectedType === 'sliders') {
                          return `Type: ${document.type || 'N/A'} | Page: ${document.page_type || 'N/A'}`;
                        }
                        if (selectedType === 'career_roadmap_sliders') {
                          return `URL: ${document.url || 'N/A'}`;
                        }
                        if (selectedType === 'career_roadmaps') {
                          let educationText = 'N/A';
                          try {
                            if (document.education_categories) {
                              const categories = typeof document.education_categories === 'string' 
                                ? JSON.parse(document.education_categories) 
                                : document.education_categories;
                              educationText = Array.isArray(categories) ? categories.join(', ') : 'N/A';
                            }
                          } catch (e) {
                            educationText = 'N/A';
                          }
                          return `Type: ${document.type || 'N/A'} | Education: ${educationText}`;
                        }
                        if (typeof document.description === 'object' && document.description?.paragraph1) {
                          return document.description.paragraph1;
                        }
                        if (typeof document.description === 'string') {
                          return document.description;
                        }
                        return document.content || 'No description available';
                      })()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Tooltip title="Copy ID">
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(document.id.toString(), 'Document ID')}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<Visibility />}
                      onClick={() => handleDocumentClick(document.id)}
                      sx={{ 
                        flex: 1,
                        background: `linear-gradient(135deg, ${getSelectedTypeInfo()?.color || '#1976d2'}, ${getSelectedTypeInfo()?.color || '#1976d2'}dd)`,
                        boxShadow: `
                          0 8px 16px ${getSelectedTypeInfo()?.color || '#1976d2'}40,
                          inset 0 2px 4px rgba(255,255,255,0.3),
                          inset 0 -2px 4px rgba(0,0,0,0.2)
                        `,
                        border: `2px solid ${getSelectedTypeInfo()?.color || '#1976d2'}`,
                        borderTop: `2px solid ${getSelectedTypeInfo()?.color || '#1976d2'}ee`,
                        borderBottom: `2px solid ${getSelectedTypeInfo()?.color || '#1976d2'}88`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          transition: 'left 0.5s ease'
                        },
                        '&:hover': {
                          background: `linear-gradient(135deg, ${getSelectedTypeInfo()?.color || '#1976d2'}ee, ${getSelectedTypeInfo()?.color || '#1976d2'}cc)`,
                          transform: 'translateY(-3px)',
                          boxShadow: `
                            0 12px 24px ${getSelectedTypeInfo()?.color || '#1976d2'}50,
                            inset 0 3px 6px rgba(255,255,255,0.4),
                            inset 0 -3px 6px rgba(0,0,0,0.3)
                          `,
                          '&::before': {
                            left: '100%'
                          }
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                          boxShadow: `
                            0 4px 8px ${getSelectedTypeInfo()?.color || '#1976d2'}30,
                            inset 0 1px 2px rgba(255,255,255,0.2),
                            inset 0 -1px 2px rgba(0,0,0,0.1)
                          `
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => {
                        setDocumentToDelete(document);
                        setDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {!loading && selectedType && documents.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center'
        }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${getSelectedTypeInfo()?.color || '#1976d2'}, ${getSelectedTypeInfo()?.color || '#1976d2'}88)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: '3rem'
          }}>
            {getSelectedTypeInfo()?.icon} Nothing Here
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.7 }}>
            No documents found in {getSelectedTypeInfo()?.label} collection
          </Typography>
        </Box>
      )}

      {/* View/Edit Modal */}
      <Modal 
        open={showModal} 
        onClose={() => { setShowModal(false); setEditMode(false); }}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '95%', maxWidth: 1200, maxHeight: '95vh', overflow: 'hidden',
          bgcolor: 'background.paper', borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column'
        }}>
          {selectedDocument && (
            <>
              {/* Header */}
              <Box sx={{ 
                p: 3, 
                background: `linear-gradient(135deg, ${getSelectedTypeInfo()?.color || '#1976d2'}, ${getSelectedTypeInfo()?.color || '#1976d2'}dd)`,
                color: 'white',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4">{getSelectedTypeInfo()?.icon}</Typography>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {editMode ? 'Edit Document' : 'Document Details'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {selectedType === 'career_roadmap_sliders' 
                        ? `Career Slider ${selectedDocument.id}` 
                        : (selectedDocument.title || selectedDocument.name || `Document ${selectedDocument.id.toString().slice(0, 8)}`)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!editMode ? (
                    <Button 
                      variant="contained" 
                      startIcon={<Edit />} 
                      onClick={() => handleEdit(selectedDocument)}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="contained" 
                        onClick={handleSave}
                        sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => setEditMode(false)}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
              
              {/* Content */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {/* Left Column */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(editMode ? editedDocument : selectedDocument)
                      .filter(([key]) => key !== 'id')
                      .filter((_, index) => index % 2 === 0)
                      .map(([key, value]) => (
                        <Card 
                          key={key}
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Box sx={{ 
                                p: 1, 
                                borderRadius: 2, 
                                bgcolor: `${getSelectedTypeInfo()?.color || '#1976d2'}15`,
                                color: getSelectedTypeInfo()?.color || '#1976d2'
                              }}>
                                {getFieldIcon(key, value)}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize', flex: 1 }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              {!editMode && value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0) && !(typeof value === 'object' && value !== null && !value.toDate && Object.keys(value).length === 0) && (
                                <Tooltip title={`Copy ${key}`}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => copyToClipboard(String(value), key)}
                                  >
                                    <ContentCopy fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                            <Box>
                              {renderValue(key, value, editMode)}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                  
                  {/* Right Column */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(editMode ? editedDocument : selectedDocument)
                      .filter(([key]) => key !== 'id')
                      .filter((_, index) => index % 2 === 1)
                      .map(([key, value]) => (
                        <Card 
                          key={key}
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Box sx={{ 
                                p: 1, 
                                borderRadius: 2, 
                                bgcolor: `${getSelectedTypeInfo()?.color || '#1976d2'}15`,
                                color: getSelectedTypeInfo()?.color || '#1976d2'
                              }}>
                                {getFieldIcon(key, value)}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize', flex: 1 }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              {!editMode && value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0) && !(typeof value === 'object' && value !== null && !value.toDate && Object.keys(value).length === 0) && (
                                <Tooltip title={`Copy ${key}`}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => copyToClipboard(String(value), key)}
                                  >
                                    <ContentCopy fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                            <Box>
                              {renderValue(key, value, editMode)}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirm} 
        onClose={() => setDeleteConfirm(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: '#fff',
            border: '3px solid #ff1744',
            boxShadow: '0 20px 60px rgba(255, 23, 68, 0.3)'
          }
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Title with small icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Typography sx={{ fontSize: '1.5rem', color: '#ff1744' }}>⚠️</Typography>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              color: '#ff1744'
            }}>
              Delete Document?
            </Typography>
          </Box>
          
          {/* Three Major Losses */}
          <Box sx={{ mb: 4 }}>
            {[
              'Document will be permanently deleted',
              'All associated files will be removed from storage', 
              'This action cannot be undone - no backup exists'
            ].map((text, index) => (
              <Typography key={index} sx={{ 
                color: '#666',
                fontSize: '0.95rem',
                mb: 1,
                textAlign: 'center'
              }}>
                • {text}
              </Typography>
            ))}
          </Box>
          
          {/* Two Action Buttons */}
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            justifyContent: 'center'
          }}>
            <Button 
              onClick={() => setDeleteConfirm(false)}
              variant="outlined"
              sx={{ 
                minWidth: 100,
                borderColor: '#ddd',
                color: '#666'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              variant="contained"
              sx={{
                minWidth: 100,
                bgcolor: '#ff1744',
                '&:hover': {
                  bgcolor: '#d50000'
                }
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <Dialog 
        open={deleteAllConfirm} 
        onClose={() => setDeleteAllConfirm(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: '#fff',
            border: '3px solid #ff1744',
            boxShadow: '0 20px 60px rgba(255, 23, 68, 0.3)'
          }
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Typography sx={{ fontSize: '2rem', color: '#ff1744' }}>🗑️</Typography>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              color: '#ff1744'
            }}>
              Delete ALL Documents?
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ 
              color: '#ff1744',
              fontSize: '1.1rem',
              mb: 2,
              textAlign: 'center',
              fontWeight: 600
            }}>
              ⚠️ WARNING: This will delete ALL {documents.length} documents!
            </Typography>
            {[
              'All documents will be permanently deleted',
              'All associated files will be removed from storage', 
              'IDs will be reset to start from 1',
              'This action cannot be undone - no backup exists'
            ].map((text, index) => (
              <Typography key={index} sx={{ 
                color: '#666',
                fontSize: '0.95rem',
                mb: 1,
                textAlign: 'center'
              }}>
                • {text}
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            justifyContent: 'center'
          }}>
            <Button 
              onClick={() => setDeleteAllConfirm(false)}
              variant="outlined"
              sx={{ 
                minWidth: 100,
                borderColor: '#ddd',
                color: '#666'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteAll}
              variant="contained"
              sx={{
                minWidth: 100,
                bgcolor: '#ff1744',
                '&:hover': {
                  bgcolor: '#d50000'
                }
              }}
            >
              Delete All
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default ManageAll;
