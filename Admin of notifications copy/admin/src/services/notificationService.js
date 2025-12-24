import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/firebase';

const notificationEndpoints = {
  jobUpdate: '/job-update',
  news: '/news',
  careerRoadmap: '/career-roadmap',
  currentAffairs: '/current-affairs',
  reels: '/reels',
  studyMaterialPolice: '/study-material-police',
  studyMaterialMpsc: '/study-material-mpsc',
  studyMaterialUpsc: '/study-material-upsc',
  resultHallticket: '/result-hallticket',
  sliders: '/sliders',
  stories: '/stories',
  studentUpdates: '/student-updates',
  top5: '/top5'
};

export const sendNotification = async (type, data) => {
  const endpoint = notificationEndpoints[type];
  if (!endpoint) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Notification error for ${type}:`, error);
    throw error;
  }
};

export default { sendNotification };