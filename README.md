# 📚 Campus Book Store

A premium marketplace for campus students to buy and sell books.

## � Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Cloudinary** account for image hosting

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

4. To build for production:
   ```bash
   npm run build
   ```

## 🚀 Deployment
This project is hosted on Render with a separate backend and frontend.

### Backend Deployment
- **Platform**: Render Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Frontend Deployment
- **Platform**: Render Static Site
- **Root Directory**: `web`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`


## 🛠 Features
- **Premium UI**: Modern, responsive design built with Tailwind CSS.
- **Smart Auth**: Secure login/registration with JWT.
- **Marketplace**: Complete buy flow, favoriting, and listing management.
- **Optimization**: Image handling with Cloudinary.

## 📁 Structure
- `/backend`: Node.js/Express API.
- `/web`: Vite/React frontend.
- `render.yaml`: Infrastructure as code for Render.
