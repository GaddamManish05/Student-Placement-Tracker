🚀 Smart Placement Tracker

A modern full-stack MERN application designed to streamline campus placement management for students and administrators. The platform helps students track applications, explore companies, monitor recruitment progress, and manage placement activities through a professional SaaS-style dashboard.

📌 Project Overview

Smart Placement Tracker is a centralized placement management platform built using the MERN stack with a modern React + Vite frontend architecture.

The application supports:

Student placement tracking
Company management
Application workflows
Recruitment analytics
Admin management system
Role-based authentication
Responsive SaaS dashboard UI
🛠️ Tech Stack
Frontend
React JSX
Vite
Tailwind CSS v4
Zustand
React Router DOM
Axios
React Icons
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcryptjs
Nodemailer
🎨 UI/UX Design

The frontend UI was inspired using Google Stitch AI and manually converted into reusable React components.

Design system includes:

Modern SaaS dashboard styling
Slate + white color palette
Blue accent colors
Responsive layouts
Reusable card components
Professional admin dashboards
Consistent typography and spacing
📂 Frontend Folder Structure
client/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── Components/
│   │   │
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │
│   │   ├── Common/
│   │   │   ├── Loader.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── SearchBar.jsx
│   │   │
│   │   ├── Cards/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── CompanyCard.jsx
│   │   │   ├── NotificationCard.jsx
│   │   │   ├── ApplicationCard.jsx
│   │   │
│   │   ├── Modals/
│   │       ├── CreateCompanyModal.jsx
│   │       ├── EditCompanyModal.jsx
│   │
│   ├── Pages/
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │
│   │   ├── Student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── CompanyDetails.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │
│   │   ├── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageCompanies.jsx
│   │       ├── ManageApplications.jsx
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── companyStore.js
│   │   ├── applicationStore.js
│   │   ├── notificationStore.js
│   │
│   ├── config/
│   │   ├── axios.js
│   │
│   ├── Styles/
│   │   ├── globals.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│
├── package.json
├── vite.config.js
🔐 Features
👨‍🎓 Student Features
Student Authentication
Placement Dashboard
Company Listings
Company Details View
Apply to Companies
Application Tracking
Placement Timeline
Notifications System
Profile Management
Resume Upload UI
👨‍💼 Admin Features
Admin Dashboard
Placement Analytics
Manage Companies
Manage Applications
Create Recruitment Drives
Update Application Status
Placement Statistics
Recruitment Workflow Management
🔑 Authentication System
JWT Authentication
HTTP-only Cookies
Protected Routes
Role-based Access
Secure Password Hashing using bcryptjs
📊 Dashboard Features
Placement Statistics
Recruitment Analytics
Application Tracking
Company Insights
Upcoming Drives
Timeline Tracking
Recent Activities
📦 Installation
Clone Repository
git clone <repository-url>
Backend Setup
cd server
npm install
Create .env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email
EMAIL_PASS=your_app_password
Run Backend
npm run dev
Frontend Setup
cd client
npm install
Run Frontend
npm run dev
⚡ Frontend Routing
Public Routes
/login
/register
Student Routes
/dashboard
/companies
/company/:id
/applications
/notifications
/profile
Admin Routes
/admin
/admin/companies
/admin/applications
📡 API Integration

Frontend communicates with backend using Axios.

Configured with:

withCredentials: true

for cookie-based authentication.

🧠 State Management

Zustand is used for:

Authentication State
Company State
Application State
Notification State
📈 Future Enhancements
Real-time notifications
Resume parsing
AI-based company recommendations
Interview scheduling
Placement prediction analytics
Cloud resume storage
Dark mode
Email automation improvements
🚀 Deployment
Frontend
Vercel
Netlify
Backend
Render
Railway
Cyclic
Database
MongoDB Atlas
👨‍💻 Author
G. Manish
B.Tech CSE Student
Aspiring Data Scientist & Full Stack Developer
📄 License

This project is developed for educational and placement management purposes.
