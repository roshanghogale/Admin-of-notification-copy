const NotificationService = require("../service/NotificationService");

const sendGenericNotification = async (req, res) => {
  try {
    const { title, body, topic, imageUrl, documentId } = req.body;
    
    if (!title || !body || !topic) {
      return res.status(400).json({ message: "Title, body, and topic are required", success: false });
    }
    
    console.log("Generic notification:", { title, body, topic });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Notification sent successfully", success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Error sending notification", success: false });
  }
};

const sendJobUpdateNotification = async (req, res) => {
  try {
    const { title, description, imageUrl, educationOption, bachelorDegrees, masterDegree, documentId } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required", success: false });
    }
    
    let topics = [];
    
    if (educationOption === "All") {
      topics = ["all"];
    } else if (educationOption === "10th" || educationOption === "12th") {
      topics = ["10th_12th"];
    } else if (bachelorDegrees && bachelorDegrees.length > 0) {
      topics = bachelorDegrees.map(degree => degree.toLowerCase().replace(/\s+/g, '_'));
    } else {
      topics = ["general"];
    }
    
    console.log("Job Update notification:", { title, description, educationOption, bachelorDegrees, topics });
    
    for (const topic of topics) {
      await NotificationService.sendNotificationToTopic(
        topic, 
        String(title), 
        String(description), 
        imageUrl ? String(imageUrl) : "", 
        documentId ? String(documentId) : ""
      );
    }
    
    res.status(200).json({ message: "Job update notification sent", success: true });
  } catch (error) {
    console.error("Error sending job update:", error);
    res.status(500).json({ message: "Error sending job update", success: false });
  }
};

const sendNewsNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "news";
    console.log("News notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "News notification sent", success: true });
  } catch (error) {
    console.error("Error sending news:", error);
    res.status(500).json({ message: "Error sending news", success: false });
  }
};

const sendCareerRoadmapNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "career_roadmap";
    console.log("Career Roadmap notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Career roadmap notification sent", success: true });
  } catch (error) {
    console.error("Error sending career roadmap:", error);
    res.status(500).json({ message: "Error sending career roadmap", success: false });
  }
};

const sendCurrentAffairsNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "current_affairs";
    console.log("Current Affairs notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Current affairs notification sent", success: true });
  } catch (error) {
    console.error("Error sending current affairs:", error);
    res.status(500).json({ message: "Error sending current affairs", success: false });
  }
};

const sendReelsNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "reels";
    console.log("Reels notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Reels notification sent", success: true });
  } catch (error) {
    console.error("Error sending reels:", error);
    res.status(500).json({ message: "Error sending reels", success: false });
  }
};

const sendStudyMaterialNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId, category } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = `study_material_${category || 'general'}`;
    console.log("Study Material notification:", { title, body, category });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Study material notification sent", success: true });
  } catch (error) {
    console.error("Error sending study material:", error);
    res.status(500).json({ message: "Error sending study material", success: false });
  }
};

const sendResultHallticketNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "result_hallticket";
    console.log("Result/Hallticket notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Result/Hallticket notification sent", success: true });
  } catch (error) {
    console.error("Error sending result/hallticket:", error);
    res.status(500).json({ message: "Error sending result/hallticket", success: false });
  }
};

const sendSlidersNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "sliders";
    console.log("Sliders notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Sliders notification sent", success: true });
  } catch (error) {
    console.error("Error sending sliders:", error);
    res.status(500).json({ message: "Error sending sliders", success: false });
  }
};

const sendStoriesNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "stories";
    console.log("Stories notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Stories notification sent", success: true });
  } catch (error) {
    console.error("Error sending stories:", error);
    res.status(500).json({ message: "Error sending stories", success: false });
  }
};

const sendStudentUpdatesNotification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "student_updates";
    console.log("Student Updates notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Student updates notification sent", success: true });
  } catch (error) {
    console.error("Error sending student updates:", error);
    res.status(500).json({ message: "Error sending student updates", success: false });
  }
};

const sendTop5Notification = async (req, res) => {
  try {
    const { title, body, imageUrl, documentId } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required", success: false });
    }
    
    const topic = "top5";
    console.log("Top 5 notification:", { title, body });
    
    await NotificationService.sendNotificationToTopic(
      topic, 
      String(title), 
      String(body), 
      imageUrl ? String(imageUrl) : "", 
      documentId ? String(documentId) : ""
    );
    res.status(200).json({ message: "Top 5 notification sent", success: true });
  } catch (error) {
    console.error("Error sending top 5:", error);
    res.status(500).json({ message: "Error sending top 5", success: false });
  }
};

module.exports = {
  sendGenericNotification,
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
  sendTop5Notification
};
