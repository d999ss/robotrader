# RoboTrader

A modern marketplace for buying and selling robots. Think AutoTrader, but for robots!

## Features

- User authentication and profiles
- Detailed robot listings with images and specifications
- Advanced search and filtering
- Secure messaging between buyers and sellers
- Favorite listings and saved searches
- Price comparison tools
- Robot condition reports
- Seller ratings and reviews

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Image Storage: AWS S3 (configured separately)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development servers:
   ```bash
   npm run dev:full
   ```

## Project Structure

```
robotrader/
├── client/              # React frontend
├── server/              # Express backend
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Custom middleware
└── uploads/            # Temporary file uploads
```
