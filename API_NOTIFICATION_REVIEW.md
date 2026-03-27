# 📱 Complete FCM Notification Data Structures

## Overview
All notifications are sent via Firebase Cloud Messaging (FCM) with the following structure:
```javascript
{
  topic: "topic_name",
  data: {
    // All fields must be strings for FCM compatibility
  }
}
```

**Total Pages with Notifications: 10**
1. Student Updates (StudentUpdates.js)
2. Career Roadmap (CareerRoadMapPage.js)
3. Current Affairs (CurrentAffairs.js)
4. News (NewsPage.js)
5. Stories (StoryPage.js)
6. Result/Hall Ticket (ResultHallTicketUpdates.js)
7. Study Materials (FreeStudyMaterialPage.js)
8. Sliders (SliderPage.js)
9. **Job Updates (App.js)** - Backend sends notification
10. General Notifications (Notification.js)

---

## 1. Student Updates (StudentUpdates.js)

**API Endpoint:** `POST /api/student-updates`

**FCM Notification Payload:**
```javascript
{
  topic: "all",
  data: {
    notificationType: "student_update",
    documentId: "123",
    title: "Maharashtra Police Recruitment 2024",
    education: "12th Pass",
    description: "Apply for 5000+ Police Constable posts",
    applicationLink: "https://mahapolice.gov.in/apply",
    lastDate: "2024-02-15",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 2. Career Roadmap (CareerRoadMapPage.js)

**API Endpoint:** `POST /api/career-roadmaps`

**FCM Notification Payload:**
```javascript
{
  topic: "Computer Science Engineering (CSE)", // or "all" or education category
  data: {
    notificationType: "career_roadmap",
    documentId: "456",
    title: "Software Engineer Career Path 2024",
    type: "career",
    educationCategories: "[\"Engineering (Degree)\"]",
    bachelorDegrees: "[\"Computer Science Engineering (CSE)\",\"Information Technology (IT)\"]",
    mastersDegrees: "[\"M.Tech\",\"MBA\"]",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 3. Current Affairs (CurrentAffairs.js)

**API Endpoint:** `POST /api/current-affairs`

**FCM Notification Payload (Immediate):**
```javascript
{
  topic: "current_affairs",
  data: {
    notificationType: "current_affairs",
    documentId: "789",
    title: "Daily Current Affairs - 15 Jan 2024",
    date: "2024-01-15",
    notificationDate: "",
    scheduledTime: "null",
    isScheduled: "false",
    bannerImageUrl: "http://localhost:3000/uploads/banners/banner123.jpg",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

**FCM Notification Payload (Scheduled):**
```javascript
{
  topic: "current_affairs",
  data: {
    notificationType: "current_affairs",
    documentId: "790",
    title: "Daily Current Affairs - 16 Jan 2024",
    date: "2024-01-16",
    notificationDate: "2024-01-16",
    scheduledTime: "2024-01-16 19:00:00",
    isScheduled: "true",
    bannerImageUrl: "http://localhost:3000/uploads/banners/banner124.jpg",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 4. News (NewsPage.js)

**API Endpoint:** `POST /api/news`

**FCM Notification Payload:**
```javascript
{
  topic: "news", // or education/location/age-based topic
  data: {
    notificationType: "news",
    documentId: "101",
    title: "New Education Policy Updates",
    titleDescription: "Major changes announced",
    subTitle: "Impact on students",
    type: "Breaking",
    date: "2024-01-15",
    description1: "The government has announced major updates...",
    description2: "These changes will affect students from...",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 5. Stories (StoryPage.js)

**API Endpoint:** `POST /api/stories`

**FCM Notification Payload:**
```javascript
{
  topic: "general", // or education/location/age/bharty-based topic
  data: {
    notificationType: "story",
    documentId: "202",
    iconUrl: "",
    title: "Success Story: IAS Topper 2024",
    bannerUrl: "",
    postDocumentId: "post_567",
    type: "post",
    otherType: "education",
    isMainStory: "true",
    educationCategories: "[\"Arts\",\"Commerce\"]",
    bachelorDegrees: "[\"BA\",\"B.Com\"]",
    mastersDegrees: "[\"MA\",\"M.Com\"]",
    selectedDistrict: "[\"Pune\",\"Mumbai City\"]",
    selectedTaluka: "[\"Pune City\",\"Mumbai City\"]",
    ageGroups: "[\"19 to 25\",\"26 to 31\"]",
    bhartyTypes: "[\"Government\"]",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 6. Result/Hall Ticket (ResultHallTicketUpdates.js)

**API Endpoint:** `POST /api/result-halltickets`

**FCM Notification Payload:**
```javascript
{
  topic: "all", // or education/age-based topic
  data: {
    notificationType: "result_hallticket",
    documentId: "303",
    title: "MPSC Prelims Result 2024",
    category: "government",
    type: "result",
    examDate: "2024-02-15",
    educationCategories: "[\"All\"]",
    bachelorDegrees: "[]",
    mastersDegrees: "[]",
    ageGroups: "[\"19 to 25\",\"26 to 31\"]",
    description1: "MPSC has declared the prelims result...",
    description2: "Candidates can check their results on...",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 7. Study Materials (FreeStudyMaterialPage.js)

**API Endpoint:** `POST /api/study-materials`

**FCM Notification Payload:**
```javascript
{
  topic: "government", // or "police & defence" or "banking"
  data: {
    notificationType: "study_material",
    documentId: "404",
    title: "MPSC Prelims Study Material 2024",
    type: "government",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 8. Sliders (SliderPage.js)

**API Endpoint:** `POST /api/sliders`

**FCM Notification Payload:**
```javascript
{
  topic: "general", // or education/location/age/bharty-based topic
  data: {
    notificationType: "slider",
    documentId: "505",
    title: "New Year Offer - 50% Off",
    postDocumentId: "post_890",
    webUrl: "https://example.com/offer",
    type: "promotion",
    pageType: "home",
    isSpecific: "true",
    otherType: "location",
    educationCategories: "[]",
    bachelorDegrees: "[]",
    mastersDegrees: "[]",
    selectedDistrict: "[\"Pune\"]",
    selectedTaluka: "[\"Pune City\"]",
    ageGroups: "[]",
    bhartyTypes: "[]",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 9. Job Updates (App.js)

**API Endpoint:** `POST /api/job-updates`

**FCM Notification Payload:**
```javascript
{
  topic: "all",
  data: {
    type: "job_update",
    id: "606",
    title: "Maharashtra Police Constable Recruitment 2024",
    salary: "25000-50000",
    last_date: "2024-02-15",
    post_name: "Police Constable",
    education_categories: "[\"12th\"]",
    bachelor_degrees: "[]",
    masters_degrees: "[]",
    age_requirement: "18-25 years",
    job_place: "Maharashtra",
    application_fees: "500",
    application_link: "https://mahapolice.gov.in/apply",
    job_type: "government",
    sub_type: "Maha",
    education_requirement: "12वी उत्तीर्ण",
    total_posts: "5000",
    note: "Physical test required",
    icon_url: "https://admin.mahaalert.cloud/uploads/icon123.jpg",
    image_url: "https://admin.mahaalert.cloud/uploads/banner456.jpg",
    pdf_url: "https://example.com/notification.pdf",
    selection_pdf_url: "https://example.com/selection.pdf",
    syllabus_pdf_url: "https://example.com/syllabus.pdf"
  }
}
```

**Note:** Backend handles notification sending. Frontend does NOT send duplicate notification.

---

## 10. General Notifications (Notification.js)

**API Endpoint:** `POST /api/notification-files`

**FCM Notification Payload:**
```javascript
{
  topic: "general", // or education/location/age-based topic
  data: {
    notificationType: "general_notification",
    title: "Important Announcement",
    body: "New features added to the app",
    imageUrl: "http://localhost:3000/uploads/notifications/notif123.jpg",
    documentId: "https://example.com/details",
    isSpecific: "true",
    otherType: "age group",
    educationCategories: "[]",
    bachelorDegrees: "[]",
    mastersDegrees: "[]",
    district: "Pune",
    taluka: "Pune City",
    ageGroups: "[\"19 to 25\"]",
    timestamp: "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📋 Key Points

### Document ID Sources
1. **Student Updates**: `response.data.studentUpdate?.id`
2. **Career Roadmap**: `response.data.careerRoadmap?.id`
3. **Current Affairs**: `response.data.data?.id`
4. **News**: `response.data.news?.id`
5. **Stories**: `response.data.story?.id`
6. **Result/Hall Ticket**: `result.resultHallticket?.id`
7. **Study Materials**: `response.data.studyMaterial?.id`
8. **Sliders**: `response.data.slider?.id`
9. **Job Updates**: `response.data.jobUpdate?.id` (Backend sends notification)
10. **General Notifications**: User-provided `webUrl` (by design)

### FCM Data Requirements
- All values MUST be strings
- Arrays are stringified: `JSON.stringify(array)`
- Booleans are stringified: `isMainStory.toString()`
- Numbers are stringified: `documentId.toString()`
- Null/undefined converted to empty strings: `value || ""`

### Topic-Based Routing
- **"all"**: All users
- **"general"**: General audience
- **Education topics**: Specific degrees (e.g., "Computer Science Engineering (CSE)")
- **Location topics**: Specific talukas (e.g., "Pune City")
- **Age topics**: Age groups (e.g., "19 to 25")
- **Bharty topics**: Job types (e.g., "Government", "Banking")

### Centralized Configuration
**File**: `admin/src/config/notificationConfig.js`
```javascript
export const NOTIFICATION_CONFIG = {
  API_URL: 'https://test.todaybharti.in/api/firebase/send-notification'
};
```

All pages import and use: `NOTIFICATION_CONFIG.API_URL`
