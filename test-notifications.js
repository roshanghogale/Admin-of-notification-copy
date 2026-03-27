const https = require('https');

const API_URL = 'https://admin.mahaalert.cloud/api/firebase/send-notification';

function sendRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(API_URL, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ data: JSON.parse(body || '{}') });
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const notifications = [
  {
    name: 'Student Update',
    data: {
      topic: 'all',
      data: {
        notificationType: 'student_update',
        documentId: 'test-student-123',
        title: 'UPSC Civil Services Exam 2024',
        education: 'Graduate',
        description: 'Complete details about UPSC exam application process',
        applicationLink: 'https://upsc.gov.in/apply',
        lastDate: '2024-02-15',
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'Career Roadmap',
    data: {
      topic: 'all',
      data: {
        notificationType: 'career_roadmap',
        documentId: 'test-career-123',
        title: 'Software Engineer Career Path',
        type: 'career',
        educationCategories: JSON.stringify(['Engineering (Degree)']),
        bachelorDegrees: JSON.stringify(['Computer Science Engineering (CSE)']),
        mastersDegrees: JSON.stringify(['M.Tech']),
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'Current Affairs',
    data: {
      topic: 'current_affairs',
      data: {
        notificationType: 'current_affairs',
        documentId: 'test-affairs-123',
        title: 'Daily Current Affairs - January 2024',
        date: '2024-01-15',
        notificationDate: '2024-01-15',
        scheduledTime: '',
        isScheduled: 'false',
        bannerImageUrl: 'https://example.com/affairs.jpg',
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'News',
    data: {
      topic: 'news',
      data: {
        notificationType: 'news',
        documentId: 'test-news-123',
        title: 'New Government Job Openings',
        titleDescription: 'Multiple positions available',
        subTitle: 'Apply before deadline',
        type: 'Breaking',
        date: '2024-01-15',
        description1: 'First paragraph with job details',
        description2: 'Second paragraph with application process',
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'Story',
    data: {
      topic: 'general',
      data: {
        notificationType: 'story',
        documentId: 'test-story-123',
        iconUrl: 'https://example.com/icon.jpg',
        title: 'Success Story: IAS Officer Journey',
        bannerUrl: 'https://example.com/banner.jpg',
        postDocumentId: 'post-123',
        type: 'news',
        otherType: '',
        isMainStory: 'true',
        educationCategories: JSON.stringify([]),
        bachelorDegrees: JSON.stringify([]),
        mastersDegrees: JSON.stringify([]),
        selectedDistrict: JSON.stringify([]),
        selectedTaluka: JSON.stringify([]),
        ageGroups: JSON.stringify([]),
        bhartyTypes: JSON.stringify([]),
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'Result/Hall Ticket',
    data: {
      topic: 'all',
      data: {
        notificationType: 'result_hallticket',
        documentId: 'test-result-123',
        title: 'SSC CGL 2024 Result',
        category: 'government',
        type: 'result',
        examDate: '2024-02-15',
        educationCategories: JSON.stringify(['12th']),
        bachelorDegrees: JSON.stringify([]),
        mastersDegrees: JSON.stringify([]),
        ageGroups: JSON.stringify(['18-25']),
        description1: 'Result has been declared',
        description2: 'Check your score online',
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'Study Material',
    data: {
      topic: 'government',
      data: {
        notificationType: 'study_material',
        documentId: 'test-study-123',
        title: 'UPSC Prelims Study Material 2024',
        type: 'government',
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'Slider',
    data: {
      topic: 'general',
      data: {
        notificationType: 'slider',
        documentId: 'test-slider-123',
        title: 'Featured Job Opening',
        postDocumentId: 'post-456',
        webUrl: 'https://example.com',
        type: 'promotion',
        pageType: 'home',
        isSpecific: 'false',
        otherType: '',
        educationCategories: JSON.stringify([]),
        bachelorDegrees: JSON.stringify([]),
        mastersDegrees: JSON.stringify([]),
        selectedDistrict: JSON.stringify([]),
        selectedTaluka: JSON.stringify([]),
        ageGroups: JSON.stringify([]),
        bhartyTypes: JSON.stringify([]),
        timestamp: new Date().toISOString()
      }
    }
  },
  {
    name: 'General Notification',
    data: {
      topic: 'general',
      data: {
        notificationType: 'general_notification',
        title: 'Important Announcement',
        body: 'Check out this important update',
        imageUrl: 'https://example.com/notification.jpg',
        documentId: 'https://example.com/details',
        isSpecific: 'false',
        otherType: '',
        educationCategories: JSON.stringify([]),
        bachelorDegrees: JSON.stringify([]),
        mastersDegrees: JSON.stringify([]),
        district: '',
        taluka: '',
        ageGroups: JSON.stringify([]),
        timestamp: new Date().toISOString()
      }
    }
  }
];

async function sendNotifications() {
  console.log('Starting notification test...\n');
  
  for (let i = 0; i < notifications.length; i++) {
    const notification = notifications[i];
    
    try {
      console.log(`[${i + 1}/${notifications.length}] Sending ${notification.name}...`);
      
      const response = await sendRequest(notification.data);
      
      console.log(`✓ ${notification.name} sent successfully`);
      console.log(`  Response: ${response.data.message || 'OK'}\n`);
      
      // Wait 3 seconds before sending next notification
      if (i < notifications.length - 1) {
        console.log('Waiting 3 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`✗ ${notification.name} failed`);
      console.error(`  Error: ${error.response?.data?.error || error.message}\n`);
    }
  }
  
  console.log('Test completed!');
}

sendNotifications();
