# 📋 Todo List Application

A modern, full-stack task management application built with the MERN stack, featuring comprehensive authentication options and a polished user interface.

## 🌟 Overview

This application provides users with a seamless task management experience, combining secure authentication methods with intuitive CRUD operations. The frontend delivers a responsive, modern interface while the backend ensures robust data handling and security.

**🔗 Live Demo:** [View Application](https://notes-highway-delite.netlify.app/)

## ✨ Key Features

### Authentication & Security
- **Multi-modal Authentication**: Email/Password registration and Google OAuth integration
- **JWT Token Management**: Secure session handling with refresh tokens
- **Password Recovery**: Email-based password reset functionality via Nodemailer
- **Protected Routes**: Role-based access control for secure data access

### Task Management
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Status Management**: Mark tasks as complete/incomplete with visual indicators
- **Real-time Updates**: Immediate UI feedback for all task operations
- **Data Persistence**: Reliable MongoDB storage with proper error handling

### User Experience
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern UI Components**: Clean, accessible interface with React Icons
- **Smooth Navigation**: React Router v7 for seamless page transitions
- **Loading States**: User-friendly feedback during async operations

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite for optimal development experience
- **Language**: TypeScript for type safety and better developer experience
- **Styling**: TailwindCSS for utility-first styling
- **Routing**: React Router v7 for client-side navigation
- **Authentication**: @react-oauth/google for Google OAuth integration
- **HTTP Client**: Axios for API communication

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Email Service**: Nodemailer for password recovery emails
- **Security**: CORS, helmet, and express-rate-limit for enhanced security
- **Environment**: dotenv for environment variable management

### Deployment & DevOps
- **Frontend Hosting**: Netlify with automatic deployments
- **Backend Hosting**: Render with environment variable management
- **Database**: MongoDB Atlas for cloud database hosting
- **CI/CD**: Automated deployment pipelines

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB Atlas account or local MongoDB installation
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/todo-list-app.git
   cd todo-list-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both frontend and backend directories:

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:5173
   ```

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend development server (in new terminal)
   cd frontend
   npm run dev
   ```

## 📁 Project Structure

```
todo-list-app/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Helper functions
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Build TypeScript files
- `npm test` - Run test suite

## 🌐 Deployment

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **JWT Implementation**: Access and refresh token strategy
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Tarun Medisetti**
- GitHub: [@your-username](https://github.com/tarunmedisetti13)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the excellent framework
- MongoDB team for the robust database solution
- Tailwind CSS team for the utility-first CSS framework
- Google for OAuth integration capabilities

---

⭐ If you found this project helpful, please consider giving it a star!