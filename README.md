# 📚 Campus Book Store

A premium marketplace for campus students to buy and sell books.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/JitendraBisht7/Book-Store)

## 🚀 One-Click Deployment
This project is configured for one-click deployment using Render Blueprints. 

1. Click the **Deploy to Render** button above.
2. Render will automatically configure:
   - **Backend**: Node.js Web Service (Express/MongoDB)
   - **Frontend**: Vite Static Site (React/Tailwind)
3. When prompted, provide your `MONGO_URI` (from MongoDB Atlas).
4. The blueprint will handle linking the frontend to the backend automatically.

## 🛠 Features
- **Premium UI**: Modern, responsive design built with Tailwind CSS.
- **Smart Auth**: Secure login/registration with JWT.
- **Marketplace**: Complete buy flow, favoriting, and listing management.
- **Optimization**: Image handling with Cloudinary.

## 📁 Structure
- `/backend`: Node.js/Express API.
- `/web`: Vite/React frontend.
- `render.yaml`: Infrastructure as code for Render.
