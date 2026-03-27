# Complete API & Notification Data Structure Documentation

## Overview
This document provides the complete data structure returned by all API endpoints and their corresponding notification payloads for the Maha Alert Admin system.

---

## 1. Student Updates

### API Endpoint
- **POST** `/api/student-updates`
- **GET** `/api/student-updates`
- **GET** `/api/student-updates/:id`

### API Response Structure
```json
{
  "message": "Student update created successfully",
  "studentUpdate": {
    "id": 1,
    "title": "UPSC Civil Services Exam 2024",
    "education": "Graduate",
    "description": "Complete details about UPSC exam",
    "application_link": "https://upsc.gov.in/apply",
    "last_date": "2024-03-15T00:00:00.000Z",
    "image_url": "http://localhost:3000/uploads/image123.jpg",
    "icon_url": "http://localhost:3000/uploads/icon123.png",
    "notification_pdf_url": "http://localhost:3000/uploads/notification.pdf",
    "selection_pdf_url": "http://localhost:3000/uploads/selection.pdf",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "student_update",
    "documentId": "1",
    "type": "student_update",
    "id": "1",
    "title": "UPSC Civil Services Exam 2024",
    "education": "Graduate",
    "description": "Complete details about UPSC exam",
    "application_link": "https://upsc.gov.in/apply",
    "last_date": "2024-03-15T00:00:00.000Z",
    "image_url": "http://localhost:3000/uploads/image123.jpg",
    "icon_url": "http://localhost:3000/uploads/icon123.png",
    "notification_pdf_url": "http://localhost:3000/uploads/notification.pdf",
    "selection_pdf_url": "http://localhost:3000/uploads/selection.pdf",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 2. Career Roadmap

### API Endpoint
- **POST** `/api/career-roadmaps`
- **GET** `/api/career-roadmaps`

### API Response Structure
```json
{
  "message": "Career roadmap created successfully",
  "careerRoadmap": {
    "id": 1,
    "title": "Software Engineer Career Path",
    "type": "Technology",
    "education_categories": ["Graduate", "Post Graduate"],
    "bachelor_degrees": ["B.Tech", "BCA"],
    "masters_degrees": ["M.Tech", "MCA"],
    "image_url": "http://localhost:3000/uploads/roadmap123.jpg",
    "pdf_url": "http://localhost:3000/uploads/roadmap.pdf",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "career_roadmap",
    "documentId": "1",
    "type": "career_roadmap",
    "id": "1",
    "title": "Software Engineer Career Path",
    "roadmap_type": "Technology",
    "education_categories": "[\"Graduate\",\"Post Graduate\"]",
    "bachelor_degrees": "[\"B.Tech\",\"BCA\"]",
    "masters_degrees": "[\"M.Tech\",\"MCA\"]",
    "image_url": "http://localhost:3000/uploads/roadmap123.jpg",
    "pdf_url": "http://localhost:3000/uploads/roadmap.pdf",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 3. Current Affairs

### API Endpoint
- **POST** `/api/current-affairs`
- **GET** `/api/current-affairs`

### API Response Structure
```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "title": "Daily Current Affairs - January 2024",
    "date": "2024-01-15T00:00:00.000Z",
    "image_url": "http://localhost:3000/uploads/affairs123.jpg",
    "pdf_url": "http://localhost:3000/uploads/affairs.pdf",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "current_affairs",
    "documentId": "1",
    "type": "current_affair",
    "id": "1",
    "title": "Daily Current Affairs - January 2024",
    "date": "2024-01-15T00:00:00.000Z",
    "image_url": "http://localhost:3000/uploads/affairs123.jpg",
    "pdf_url": "http://localhost:3000/uploads/affairs.pdf",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 4. News

### API Endpoint
- **POST** `/api/news`
- **GET** `/api/news`
- **GET** `/api/news/:id`

### API Response Structure
```json
{
  "message": "News created successfully",
  "news": {
    "id": 1,
    "title": "New Government Job Openings",
    "title_description": "Multiple positions available",
    "sub_title": "Apply before deadline",
    "type": "Government Jobs",
    "date": "2024-01-15",
    "description": {
      "titleDescription": "Multiple positions available",
      "subTitle": "Apply before deadline",
      "paragraph1": "First paragraph content",
      "paragraph2": "Second paragraph content"
    },
    "image_url": "http://localhost:3000/uploads/news123.jpg",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "news",
    "documentId": "1",
    "type": "news",
    "id": "1",
    "title": "New Government Job Openings",
    "title_description": "Multiple positions available",
    "sub_title": "Apply before deadline",
    "news_type": "Government Jobs",
    "date": "2024-01-15",
    "description": "{\"titleDescription\":\"Multiple positions available\",\"subTitle\":\"Apply before deadline\",\"paragraph1\":\"First paragraph content\",\"paragraph2\":\"Second paragraph content\"}",
    "image_url": "http://localhost:3000/uploads/news123.jpg",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 5. Stories

### API Endpoint
- **POST** `/api/stories`
- **GET** `/api/stories`
- **GET** `/api/stories/:id`

### API Response Structure
```json
{
  "message": "Story created successfully",
  "story": {
    "id": 1,
    "title": "Success Story: IAS Officer Journey",
    "post_document_id": "doc123",
    "web_url": null,
    "type": "success_story",
    "other_type": "",
    "is_main_story": true,
    "education_categories": ["Graduate", "Post Graduate"],
    "bachelor_degrees": ["Any"],
    "masters_degrees": [],
    "district": ["Mumbai", "Pune"],
    "taluka": ["Mumbai City"],
    "age_groups": ["18-25", "26-35"],
    "bharty_types": ["Open"],
    "icon_url": "http://localhost:3000/uploads/icon123.png",
    "banner_url": "http://localhost:3000/uploads/banner123.jpg",
    "video_url": "http://localhost:3000/uploads/video123.mp4",
    "media_type": "video",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "story",
    "documentId": "1",
    "type": "story",
    "id": "1",
    "title": "Success Story: IAS Officer Journey",
    "post_document_id": "doc123",
    "web_url": "",
    "story_type": "success_story",
    "other_type": "",
    "is_main_story": "true",
    "education_categories": "[\"Graduate\",\"Post Graduate\"]",
    "bachelor_degrees": "[\"Any\"]",
    "masters_degrees": "[]",
    "district": "[\"Mumbai\",\"Pune\"]",
    "taluka": "[\"Mumbai City\"]",
    "age_groups": "[\"18-25\",\"26-35\"]",
    "bharty_types": "[\"Open\"]",
    "icon_url": "http://localhost:3000/uploads/icon123.png",
    "banner_url": "http://localhost:3000/uploads/banner123.jpg",
    "video_url": "http://localhost:3000/uploads/video123.mp4",
    "media_type": "video",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 6. Result/Hall Ticket Updates

### API Endpoint
- **POST** `/api/result-halltickets`
- **GET** `/api/result-halltickets`
- **GET** `/api/result-halltickets/:id`

### API Response Structure
```json
{
  "message": "Result/Hall ticket update created successfully",
  "resultHallticket": {
    "id": 1,
    "title": "SSC CGL 2024 Result",
    "category": "SSC",
    "type": "Result",
    "exam_date": "2024-03-15T00:00:00.000Z",
    "education_requirement": {
      "categories": ["Graduate"],
      "bachelors": ["Any"],
      "masters": []
    },
    "website_urls": [
      "https://ssc.nic.in",
      "https://ssc.nic.in/result"
    ],
    "description": {
      "paragraph1": "Result declared for SSC CGL 2024",
      "paragraph2": "Check your result on official website"
    },
    "icon_url": "http://localhost:3000/uploads/icon123.png",
    "image_url": "http://localhost:3000/uploads/result123.jpg",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "result_hallticket",
    "documentId": "1",
    "type": "result_hallticket_update",
    "id": "1",
    "title": "SSC CGL 2024 Result",
    "category": "SSC",
    "update_type": "Result",
    "exam_date": "2024-03-15T00:00:00.000Z",
    "education_requirement": "{\"categories\":[\"Graduate\"],\"bachelors\":[\"Any\"],\"masters\":[]}",
    "website_urls": "[\"https://ssc.nic.in\",\"https://ssc.nic.in/result\"]",
    "description": "{\"paragraph1\":\"Result declared for SSC CGL 2024\",\"paragraph2\":\"Check your result on official website\"}",
    "icon_url": "http://localhost:3000/uploads/icon123.png",
    "image_url": "http://localhost:3000/uploads/result123.jpg",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 7. Study Materials

### API Endpoint
- **POST** `/api/study-materials`
- **GET** `/api/study-materials`
- **GET** `/api/study-materials/:id`

### API Response Structure
```json
{
  "message": "Study material created successfully",
  "studyMaterial": {
    "id": 1,
    "title": "UPSC Prelims Study Material 2024",
    "type": "UPSC",
    "image_url": "http://localhost:3000/uploads/study123.jpg",
    "pdf_url": "http://localhost:3000/uploads/study.pdf",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "study_material",
    "documentId": "1",
    "type": "study_material",
    "id": "1",
    "title": "UPSC Prelims Study Material 2024",
    "material_type": "UPSC",
    "image_url": "http://localhost:3000/uploads/study123.jpg",
    "pdf_url": "http://localhost:3000/uploads/study.pdf",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 8. Sliders

### API Endpoint
- **POST** `/api/sliders`
- **GET** `/api/sliders`
- **GET** `/api/sliders/:id`
- **GET** `/api/sliders/home`
- **GET** `/api/sliders/banking`
- **GET** `/api/sliders/government`
- **GET** `/api/sliders/private`

### API Response Structure
```json
{
  "message": "Slider created successfully",
  "slider": {
    "id": 1,
    "title": "Featured Job Opening",
    "post_document_id": "job123",
    "web_url": null,
    "type": "job",
    "page_type": "home",
    "is_specific": true,
    "other_type": "",
    "education_categories": ["Graduate"],
    "bachelor_degrees": ["B.Tech", "BCA"],
    "masters_degrees": [],
    "district": ["Mumbai"],
    "taluka": ["Mumbai City"],
    "age_groups": ["18-25"],
    "bharty_types": ["Open"],
    "image_url": "http://localhost:3000/uploads/slider123.jpg",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "all",
  "data": {
    "notificationType": "slider",
    "documentId": "1",
    "type": "slider",
    "id": "1",
    "title": "Featured Job Opening",
    "post_document_id": "job123",
    "web_url": "",
    "slider_type": "job",
    "page_type": "home",
    "is_specific": "true",
    "other_type": "",
    "education_categories": "[\"Graduate\"]",
    "bachelor_degrees": "[\"B.Tech\",\"BCA\"]",
    "masters_degrees": "[]",
    "district": "[\"Mumbai\"]",
    "taluka": "[\"Mumbai City\"]",
    "age_groups": "[\"18-25\"]",
    "bharty_types": "[\"Open\"]",
    "image_url": "http://localhost:3000/uploads/slider123.jpg",
    "created_at": "2024-01-15T10:30:00.000Z",
    "timestamp": "1705315800000"
  }
}
```

---

## 9. General Notifications

### API Endpoint
- **POST** `/api/notification-files`
- **GET** `/api/notification-files`

### API Response Structure
```json
{
  "notificationFile": {
    "id": 1,
    "title": "Important Announcement",
    "body": "Check out this important update",
    "image_url": "/uploads/notification123.jpg",
    "document_id": "https://example.com/details",
    "is_specific": true,
    "other_type": "announcement",
    "education_categories": ["Graduate"],
    "bachelor_degrees": ["Any"],
    "masters_degrees": [],
    "district": ["Mumbai"],
    "taluka": ["Mumbai City"],
    "age_groups": ["18-25"],
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Notification Data Structure
```json
{
  "topic": "education_Graduate",
  "data": {
    "notificationType": "general",
    "documentId": "https://example.com/details",
    "title": "Important Announcement",
    "body": "Check out this important update",
    "imageUrl": "http://localhost:3000/uploads/notification123.jpg",
    "timestamp": "1705315800000"
  }
}
```

---

## Topic-Based Routing Logic

### Education-Based Topics
- Format: `education_{category}`
- Examples: `education_Graduate`, `education_10th`, `education_12th`
- Applied when: `educationCategories` array is not empty

### Location-Based Topics
- Format: `location_{district}_{taluka}`
- Examples: `location_Mumbai_MumbaiCity`, `location_Pune_PuneCity`
- Applied when: `district` and `taluka` arrays are not empty

### Age-Based Topics
- Format: `age_{ageGroup}`
- Examples: `age_18-25`, `age_26-35`
- Applied when: `ageGroups` array is not empty

### Bharty Type Topics
- Format: `bharty_{type}`
- Examples: `bharty_Open`, `bharty_OBC`
- Applied when: `bhartyTypes` array is not empty

### Default Topics
- `all` - Used when no specific targeting is set
- `general` - Used for general notifications

---

## Data Type Conversions

### FCM Requirement
All notification data fields MUST be strings for Firebase Cloud Messaging compatibility.

### Conversion Rules
1. **Numbers** → Strings: `id: 1` becomes `"id": "1"`
2. **Booleans** → Strings: `is_main_story: true` becomes `"is_main_story": "true"`
3. **Objects/Arrays** → JSON Strings: `{key: "value"}` becomes `"{\"key\":\"value\"}"`
4. **Null/Undefined** → Empty Strings: `null` becomes `""`
5. **Dates** → ISO Strings: `Date` becomes `"2024-01-15T10:30:00.000Z"`

### Example Conversion
```javascript
// Before conversion (Database format)
{
  id: 1,
  is_main_story: true,
  education_categories: ["Graduate", "Post Graduate"],
  created_at: new Date("2024-01-15")
}

// After conversion (FCM format)
{
  "id": "1",
  "is_main_story": "true",
  "education_categories": "[\"Graduate\",\"Post Graduate\"]",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

## Notification Flow

### Backend Flow
1. Admin creates content via API endpoint
2. Controller saves data to PostgreSQL database
3. Database returns complete record with auto-generated ID
4. If `notification: true`, controller calls NotificationService
5. NotificationService converts all data to strings
6. NotificationService determines topic based on targeting
7. FCM sends data-only notification to topic subscribers

### Frontend Flow
1. Admin submits form with content
2. Frontend receives API response with document ID
3. Frontend extracts `response.data.{entityName}.id`
4. Frontend sends notification with captured document ID
5. Notification includes `notificationType` and `documentId`

### Dual Notification System
- **Backend**: Sends notification immediately after database save
- **Frontend**: Sends notification after receiving API response
- **Purpose**: Ensures notification delivery even if one system fails
- **Deduplication**: Mobile app should handle duplicate notifications

---

## Verification Checklist

### API Endpoints ✅
- [x] Student Updates - Returns complete data with ID
- [x] Career Roadmap - Returns complete data with ID
- [x] Current Affairs - Returns complete data with ID
- [x] News - Returns complete data with ID
- [x] Stories - Returns complete data with ID
- [x] Result/Hall Ticket - Returns complete data with ID
- [x] Study Materials - Returns complete data with ID
- [x] Sliders - Returns complete data with ID
- [x] General Notifications - Returns complete data with ID

### Frontend Pages ✅
- [x] StudentUpdates.js - Captures and sends document ID
- [x] CareerRoadMapPage.js - Captures and sends document ID
- [x] CurrentAffairs.js - Captures and sends document ID
- [x] NewsPage.js - Captures and sends document ID
- [x] StoryPage.js - Captures and sends document ID
- [x] ResultHallTicketUpdates.js - Captures and sends document ID
- [x] FreeStudyMaterialPage.js - Captures and sends document ID
- [x] SliderPage.js - Captures and sends document ID
- [x] Notification.js - Uses user-provided URL (by design)

### Backend Controllers ✅
- [x] StudentUpdateController - Sends notification with complete data
- [x] CareerRoadmapController - Sends notification with complete data
- [x] CurrentAffairsController - Sends notification with complete data
- [x] NewsController - Sends notification with complete data
- [x] StoriesController - Sends notification with complete data
- [x] ResultHallticketController - Sends notification with complete data
- [x] StudyMaterialsController - Sends notification with complete data
- [x] SlidersController - Sends notification with complete data
- [x] NotificationFilesController - Saves to database with complete data

### NotificationService ✅
- [x] Converts all data fields to strings
- [x] Handles topic-based routing
- [x] Sends data-only messages (no notification payload)
- [x] Supports education, location, age, and bharty type targeting

---

## Mobile App Integration Guide

### Receiving Notifications
```javascript
// FCM Data Message Handler
messaging().onMessage(async remoteMessage => {
  const data = remoteMessage.data;
  
  // Extract notification type and document ID
  const notificationType = data.notificationType;
  const documentId = data.documentId;
  
  // Route to appropriate screen
  switch(notificationType) {
    case 'student_update':
      navigation.navigate('StudentUpdateDetail', { id: documentId });
      break;
    case 'career_roadmap':
      navigation.navigate('CareerRoadmapDetail', { id: documentId });
      break;
    case 'current_affairs':
      navigation.navigate('CurrentAffairsDetail', { id: documentId });
      break;
    case 'news':
      navigation.navigate('NewsDetail', { id: documentId });
      break;
    case 'story':
      navigation.navigate('StoryDetail', { id: documentId });
      break;
    case 'result_hallticket':
      navigation.navigate('ResultDetail', { id: documentId });
      break;
    case 'study_material':
      navigation.navigate('StudyMaterialDetail', { id: documentId });
      break;
    case 'slider':
      navigation.navigate('SliderDetail', { id: documentId });
      break;
    case 'general':
      // Open web URL
      Linking.openURL(documentId);
      break;
  }
});
```

### Topic Subscription
```javascript
// Subscribe to topics based on user preferences
const subscribeToTopics = async (userPreferences) => {
  // Education topics
  if (userPreferences.educationCategories) {
    for (const category of userPreferences.educationCategories) {
      await messaging().subscribeToTopic(`education_${category}`);
    }
  }
  
  // Location topics
  if (userPreferences.district && userPreferences.taluka) {
    const topic = `location_${userPreferences.district}_${userPreferences.taluka}`;
    await messaging().subscribeToTopic(topic);
  }
  
  // Age topics
  if (userPreferences.ageGroup) {
    await messaging().subscribeToTopic(`age_${userPreferences.ageGroup}`);
  }
  
  // Bharty type topics
  if (userPreferences.bhartyType) {
    await messaging().subscribeToTopic(`bharty_${userPreferences.bhartyType}`);
  }
  
  // Default topics
  await messaging().subscribeToTopic('all');
  await messaging().subscribeToTopic('general');
};
```

### Fetching Complete Data
```javascript
// Fetch complete data using document ID
const fetchDetailData = async (notificationType, documentId) => {
  const endpoints = {
    'student_update': `/api/student-updates/${documentId}`,
    'career_roadmap': `/api/career-roadmaps/${documentId}`,
    'current_affairs': `/api/current-affairs/${documentId}`,
    'news': `/api/news/${documentId}`,
    'story': `/api/stories/${documentId}`,
    'result_hallticket': `/api/result-halltickets/${documentId}`,
    'study_material': `/api/study-materials/${documentId}`,
    'slider': `/api/sliders/${documentId}`
  };
  
  const endpoint = endpoints[notificationType];
  if (!endpoint) return null;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return await response.json();
};
```

---

## Summary

### System Status: ✅ FULLY OPERATIONAL

All 9 content types are properly configured:
1. ✅ API endpoints return complete data with database IDs
2. ✅ Frontend pages capture document IDs from API responses
3. ✅ Backend controllers send notifications with complete data
4. ✅ NotificationService converts data to FCM-compatible format
5. ✅ Topic-based routing works for targeted notifications
6. ✅ Mobile app can fetch complete data using document IDs

### Key Features
- **Complete Data**: All endpoints return full records with IDs
- **Dual Notifications**: Backend and frontend both send notifications
- **Topic Routing**: Smart targeting based on user preferences
- **FCM Compatible**: All data converted to strings
- **Mobile Ready**: Document IDs enable data fetching on mobile

### Last Updated
January 2024
