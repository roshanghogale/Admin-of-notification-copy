const cron = require('node-cron');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const startNotificationScheduler = () => {
  console.log('Starting notification scheduler...');

  // Current Affairs notifications at 7:00 PM daily
  cron.schedule('0 19 * * *', async () => {
    console.log('=== CHECKING FOR CURRENT AFFAIRS NOTIFICATIONS AT 7:00 PM ===');
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await pool.query(`
        SELECT * FROM current_affairs 
        WHERE scheduled_notification_date = $1 
        AND notification_sent = FALSE
      `, [today]);

      for (const currentAffair of result.rows) {
        console.log('Sending scheduled Current Affairs notification for ID:', currentAffair.id);
        
        try {
          
          const NotificationService = require('./NotificationService');
          await NotificationService.sendNotificationToTopic(
            'currentaffairs',
            null,
            null,
            null,
            null,
            {
              type: 'current_affairs',
              id: currentAffair.id.toString(),
              title: currentAffair.title,
              body: `New current affairs: ${currentAffair.title}`,
              date: currentAffair.date ? currentAffair.date.toISOString().split('T')[0] : '',
              image_url: currentAffair.image_url || '',
              pdf_url: currentAffair.pdf_url || ''
            }
          );
          
          // Mark as sent
          await pool.query('UPDATE current_affairs SET notification_sent = TRUE WHERE id = $1', [currentAffair.id]);
          console.log('Current Affairs notification sent successfully for ID:', currentAffair.id);
        } catch (error) {
          console.error('Error sending Current Affairs notification:', error);
        }
      }
    } catch (error) {
      console.error('Error checking Current Affairs notifications:', error);
    }
  });

  console.log('Notification scheduler started successfully');
  console.log('- Current Affairs notifications: Daily at 7:00 PM');
};

module.exports = { startNotificationScheduler };