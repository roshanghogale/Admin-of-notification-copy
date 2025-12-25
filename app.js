require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const csrf = require('csurf');
const firebaseRoute = require("./src/routes/FirebaseRoute");
const userRoute = require("./src/routes/UserRoute");
const jobUpdateRoute = require("./src/routes/JobUpdateRoute");
const currentAffairsRoute = require("./src/routes/CurrentAffairsRoute");
const careerRoadmapRoute = require("./src/routes/CareerRoadmapRoute");
const studentUpdateRoute = require("./src/routes/StudentUpdateRoute");
const resultHallticketRoute = require("./src/routes/ResultHallticketRoute");

const storiesRoute = require("./src/routes/StoriesRoute");
const slidersRoute = require("./src/routes/SlidersRoute");
const studyMaterialsRoute = require("./src/routes/StudyMaterialsRoute");
const newsRoute = require("./src/routes/NewsRoute");
const queryRoute = require("./src/routes/QueryRoute");
const notificationBannerRoute = require("./src/routes/NotificationBannerRoute");
const notificationFilesRoute = require("./src/routes/NotificationFilesRoute");
const notificationUploadRoute = require("./src/routes/NotificationUploadRoute");
const careerRoadmapSlidersRoute = require("./src/routes/CareerRoadmapSlidersRoute");
const { initializeUserTable } = require('./src/controllers/UserController');
const { initializeJobUpdateTable } = require('./src/controllers/JobUpdateController');
const { initializeCurrentAffairsTable } = require('./src/controllers/CurrentAffairsController');
const { initializeCareerRoadmapsTable } = require('./src/controllers/CareerRoadmapController');
const { initializeStudentUpdatesTable } = require('./src/controllers/StudentUpdateController');
const { initializeResultHallticketTable } = require('./src/controllers/ResultHallticketController');

const { initializeStoriesTable } = require('./src/controllers/StoriesController');
const { initializeSlidersTable } = require('./src/controllers/SlidersController');
const { initializeStudyMaterialsTable } = require('./src/controllers/StudyMaterialsController');
const { initializeNewsTable } = require('./src/controllers/NewsController');
const { initializeQueriesTable } = require('./src/controllers/QueryController');
const { initializeNotificationBannersTable } = require('./src/controllers/NotificationBannerController');
const { startNotificationScheduler } = require('./src/service/NotificationScheduler');
const { createNotificationFilesTable } = require('./src/controllers/NotificationFilesController');
const { createCareerRoadmapSlidersTable } = require('./src/controllers/CareerRoadmapSlidersController');

app.use(bodyParser.json());
app.use(cors());

// CSRF Protection (disabled for API endpoints, enable for web forms)
// app.use(csrf({ cookie: true }));

// API routes
app.use("/api/firebase", firebaseRoute);
app.use("/api/users", userRoute);
app.use("/api/job-updates", jobUpdateRoute);
app.use("/api/current-affairs", currentAffairsRoute);
app.use("/api/career-roadmaps", careerRoadmapRoute);
app.use("/api/student-updates", studentUpdateRoute);
app.use("/api/result-halltickets", resultHallticketRoute);

app.use("/api/stories", storiesRoute);
app.use("/api/sliders", slidersRoute);
app.use("/api/study-materials", studyMaterialsRoute);
app.use("/api/news", newsRoute);
app.use("/api/queries", queryRoute);
app.use("/api/notification-banners", notificationBannerRoute);
app.use("/api/notification-files", notificationFilesRoute);
app.use("/api/notification-files", notificationUploadRoute);
app.use("/api/career-roadmap-sliders", careerRoadmapSlidersRoute);

// Public endpoint for Android app to fetch job updates
app.get('/public/job-updates', async (req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'OneRoadMap',
      password: process.env.DB_PASSWORD || 'roshan',
      port: process.env.DB_PORT || 5432,
    });
    
    const result = await pool.query(
      'SELECT * FROM job_updates ORDER BY created_at DESC'
    );
    
    res.status(200).json({ 
      success: true,
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching job updates for Android app:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads', {
  maxAge: '86400000', // 1 day in milliseconds
  etag: true
}));

// Serve React app
app.use(express.static(path.join(__dirname, 'admin/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/build', 'index.html'));
});

// Initialize database tables (optional - only if DB is available)
initializeUserTable().catch(err => {
  console.log('Users table initialization failed, continuing...');
});
initializeJobUpdateTable().catch(err => {
  console.log('Job updates table initialization failed, continuing...');
});
initializeCurrentAffairsTable().catch(err => {
  console.log('Current affairs table initialization failed, continuing...');
});
initializeCareerRoadmapsTable().catch(err => {
  console.log('Career roadmaps table initialization failed, continuing...');
});
initializeStudentUpdatesTable().catch(err => {
  console.log('Student updates table initialization failed, continuing...');
});
initializeResultHallticketTable().catch(err => {
  console.log('Result/Hall ticket updates table initialization failed, continuing...');
});

initializeStoriesTable().catch(err => {
  console.log('Stories table initialization failed, continuing...');
});
initializeSlidersTable().catch(err => {
  console.log('Sliders table initialization failed, continuing...');
});
initializeStudyMaterialsTable().catch(err => {
  console.log('Study materials table initialization failed, continuing...');
});
initializeNewsTable().catch(err => {
  console.log('News table initialization failed, continuing...');
});
initializeQueriesTable().catch(err => {
  console.log('Queries table initialization failed, continuing...');
});
initializeNotificationBannersTable().catch(err => {
  console.log('Notification banners table initialization failed, continuing...');
});

// Start notification scheduler
startNotificationScheduler();
createNotificationFilesTable().catch(err => {
  console.log('Notification files table initialization failed, continuing...');
});
createCareerRoadmapSlidersTable().catch(err => {
  console.log('Career roadmap sliders table initialization failed, continuing...');
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
