// Basic internationalization setup
const translations = {
  en: {
    'Job Updates': 'Job Updates',
    'Current Affairs': 'Current Affairs',
    'Career RoadMaps': 'Career RoadMaps',
    'StudentUpdates': 'StudentUpdates',
    'R/H Ticket': 'R/H Ticket',
    'Reel': 'Reel',
    'Story': 'Story',
    'Carousel': 'Carousel',
    'Slider': 'Slider',
    'Notification': 'Notification',
    'Manage All': 'Manage All',
    'Title': 'Title',
    'Details': 'Details',
    'Send Notification': 'Send Notification',
    'Sending...': 'Sending...',
    'Select Image': 'Select Image',
    'Upload Image': 'Upload Image',
    'Uploading...': 'Uploading...',
    'Uploaded': 'Uploaded'
  }
};

export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || key;
};

export default translations;