// Centralized topic sanitization for FCM
// Removes all spaces, dots, parentheses, ampersands, slashes, and special characters

export const sanitizeTopic = (topic) => {
  if (!topic) return '';
  return topic
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/[()]/g, '')
    .replace(/&/g, '')
    .replace(/\//g, '')
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 900);
};

// Sanitize array of topics
export const sanitizeTopics = (topics) => {
  if (!Array.isArray(topics)) return [];
  return topics.map(sanitizeTopic).filter(t => t);
};
