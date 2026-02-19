# 📚 Campus Book Store

A premium marketplace for campus students to buy and sell books.

## 🚀 Deployment
This project is hosted on Render with a separate backend and frontend.

### Backend Setup
- **Platform**: Render Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Frontend Setup
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
