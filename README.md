# Welcome to your Lovable Learning Path Organizer project

## Project info

PathWise Learning Path Organizer is a modern web application designed to help users manage their learning goals efficiently. Built with React, TypeScript, Redux, and Firebase, this app allows users to create, track, and organize learning modules with deadlines, resources, and progress tracking. It features offline support, PDF export, and a visually appealing dark-themed dashboard inspired by modern UI design trends.

# Learning Path Organizer

![Learning Path Organizer Dashboard]

**Learning Path Organizer** is a web application that helps users plan and track their learning goals. Whether you're learning web development, Python, or any other skill, this app provides a structured way to organize your learning path with modules, deadlines, and resources. It features a modern dark-themed UI, offline support, and seamless integration with Firebase for data persistence.

## Features

- **Module Management**: Add, edit, and delete learning modules with titles, deadlines, and resources.
- **Progress Tracking**: Monitor your completion rate with a progress bar and analytics.
- **Upcoming Deadlines**: View upcoming deadlines with a countdown of days left.
- **Learning Roadmap**: Visualize your learning journey with a roadmap section (currently a placeholder with a background image).
- **Offline Support**: Use the app offline with IndexedDB for local storage and sync with Firebase when online.
- **PDF Export**: Export your learning path as a PDF for easy sharing.
- **Dark Theme**: A sleek, dark-themed UI for a modern user experience.
- **Motivational Section**: Stay motivated with a "Keep Going!" section featuring an inspirational message and image.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore for data storage, Authentication for user management)
- **Offline Storage**: IndexedDB (via Dexie.js)
- **PDF Export**: jsPDF
- **Visualization**: React Flow (for roadmap visualization, currently replaced with a background image)
- **Styling**: Custom CSS with light/dark theme support

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VinithShetty/pathwise-organizer.git
   cd pathwise-organizer
Set Up Firebase:
Create a Firebase project at Firebase Console.
Enable Firestore and Authentication (Email/Password).
Copy your Firebase configuration and add it to src/services/firebase.ts:

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

## Usage
Sign In: Log in using your email and password via Firebase Authentication.
Add a Module: Click "Add Module" to create a new learning module with a title and deadline.
Track Progress: View your completion rate and upcoming deadlines on the dashboard.
Edit/Delete Modules: Expand a module card to edit or delete it.
Export as PDF: Click "Export as PDF" to download your learning path.
Offline Mode: The app works offline, and changes will sync with Firebase when you're back online.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Future Improvements
Enhanced Roadmap Visualization: Replace the static background image with an interactive React Flow visualization.
Category-based Progress: Allow users to categorize modules (e.g., Web Development, Python) and track progress per category.
Notifications: Implement push notifications for upcoming deadlines.
User Profiles: Add user profiles with avatars and personalized settings.
Advanced Analytics: Include detailed analytics, such as time spent on each module and learning streaks.

## How can I deploy this project?

Simply open (https://vercel.com) and deploy your website using github.

## Screenshots
Front Page: https://imgur.com/a/DA3sg5t
SignUp Page: https://imgur.com/a/zyjSnIQ
Analytics Page: https://imgur.com/a/gYpRH0E
Adding Path Page: https://imgur.com/a/8c4PdxX
