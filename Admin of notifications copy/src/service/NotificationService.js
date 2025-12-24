const admin = require("../util/firebase");

class NotificationService {
  static async sendNotificationToTopic(
    topic,
    title,
    body,
    imageUrl,
    documentId,
    customData = null
  ) {
    let data;
    
    if (customData) {
      // Convert all fields to strings for FCM
      data = {};
      Object.keys(customData).forEach(key => {
        data[key] = String(customData[key] || "");
      });
    } else {
      // Legacy format
      data = {
        title: String(title || ""),
        body: String(body || ""),
        image: String(imageUrl || ""),
        documentId: String(documentId || ""),
      };
    }
    
    const message = {
      data,
      topic: String(topic),
    };

    try {
      console.log("FCM Message Payload: ", message);
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationService;
