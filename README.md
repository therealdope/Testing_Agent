# Testing Agent

Welcome to the **Testing Agent**! Click the link below to visit the live site:
> **Important**: Before Going to Live Website, make sure to set up and run the backend server locally.
> Backend repository: [Testing Agent Backend](https://github.com/therealdope/Testing_Agent_Backend)

[![🔍 Website](https://img.shields.io/badge/🔍-Live%20Website-blue)](https://testing-agent-skheni.vercel.app/)

---
### Video Preview

[![Watch the video](https://img.youtube.com/vi/7_ihqWgj3sg/0.jpg)](https://youtu.be/7_ihqWgj3sg?si=JsQfsBPiyXTIe72C)

###### Click on the thumbnail above to watch the video.

---
#### A web application that helps developers test their websites by comparing Figma designs with live websites and generating automated test cases.

Its not the best but not the least.

> **Important**: Before starting the frontend, make sure to set up and run the backend server locally. 
> Backend repository: [Testing Agent Backend](https://github.com/therealdope/Testing_Agent_Backend)

## Features

- User Authentication
- Figma Design Analysis
- Website Component Comparison
- Automated Test Case Generation
- Visual Regression Testing
- History Tracking of Test Results

## Tech Stack

- Frontend: Next.js 13+ (App Router)
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Styling: Tailwind CSS
- Backend Server: `https://github.com/therealdope/Testing_Agent_Backend`

## Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account
- Figma API access token

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string_Atlas
JWT_SECRET=your_jwt_secret
# local Backend Server
NEXT_PUBLIC_FLASK_API_URL=http://127.0.0.1:5000/testagent
```

## Installation

> If you don't want to setup Frontend, Just go to Live Website

1. Clone the repository:
```bash
git clone https://github.com/therealdope/Testing_Agent
cd Testing_Agent
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Usage

1. Sign up for an account
2. Input your Figma file ID and website URL
3. Run the comparison test
4. View the results in the dashboard
5. Access historical test results in the sidebar

## Deployment

This project is configured for deployment on Vercel. Make sure to:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request