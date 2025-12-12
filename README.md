# Admin Notifications App

A comprehensive admin panel for managing notifications, built with React frontend and Node.js/Express backend.

## Features

- User management and authentication
- Notification management (push notifications, banners)
- Content management (news, current affairs, study materials)
- File upload handling (images, PDFs, videos)
- Career roadmap management
- Firebase integration for real-time notifications
- PostgreSQL database integration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Firebase project setup

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/roshanghogale/Admin-of-notifications.git
cd Admin-of-notifications
```

2. **Install backend dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd admin
npm install
cd ..
```

4. **Set up environment variables:**

   **Backend (.env):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and Firebase credentials.

   **Frontend (admin/.env):**
   ```bash
   cp admin/.env.example admin/.env
   ```
   Edit `admin/.env` with your Firebase configuration.

5. **Set up the database:**
```bash
node create-db.js
```

6. **Create uploads directory:**
```bash
mkdir -p uploads/notification-banners
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

- `/api/users` - User management
- `/api/notifications` - Notification management
- `/api/news` - News management
- `/api/current-affairs` - Current affairs management
- `/api/study-materials` - Study materials management
- `/api/career-roadmap` - Career roadmap management
- `/api/upload` - File upload handling

## Architecture

- **Frontend:** React app with Material-UI components
- **Backend:** Node.js/Express API server
- **Database:** PostgreSQL
- **File Storage:** Local uploads directory
- **Notifications:** Firebase Cloud Messaging
- **Port:** 3000 (configurable via PORT environment variable)

## Security Notes

- Never commit `.env` files to version control
- Keep Firebase private keys secure
- Use environment variables for all sensitive data
- Regularly update dependencies for security patches

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request# Admin-of-notifications
# Admin-of-notifications
