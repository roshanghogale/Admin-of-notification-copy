const express = require("express");
const {
  sendJobUpdateNotification,
  sendNewsNotification,
  sendCareerRoadmapNotification,
  sendCurrentAffairsNotification,
  sendReelsNotification,
  sendStudyMaterialNotification,
  sendResultHallticketNotification,
  sendSlidersNotification,
  sendStoriesNotification,
  sendStudentUpdatesNotification,
  sendTop5Notification,
  sendGenericNotification
} = require("../controllers/Firebasecontroller");

const router = express.Router();

// Generic notification endpoint
router.post("/send-notification", sendGenericNotification);

// Specific endpoints for each page type
router.post("/job-update", sendJobUpdateNotification);
router.post("/news", sendNewsNotification);
router.post("/career-roadmap", sendCareerRoadmapNotification);
router.post("/current-affairs", sendCurrentAffairsNotification);
router.post("/reels", sendReelsNotification);
router.post("/study-material-police", (req, res) => {
  req.body.category = "police";
  sendStudyMaterialNotification(req, res);
});
router.post("/study-material-mpsc", (req, res) => {
  req.body.category = "mpsc";
  sendStudyMaterialNotification(req, res);
});
router.post("/study-material-upsc", (req, res) => {
  req.body.category = "upsc";
  sendStudyMaterialNotification(req, res);
});
router.post("/result-hallticket", sendResultHallticketNotification);
router.post("/sliders", sendSlidersNotification);
router.post("/stories", sendStoriesNotification);
router.post("/student-updates", sendStudentUpdatesNotification);
router.post("/top5", sendTop5Notification);

module.exports = router;
