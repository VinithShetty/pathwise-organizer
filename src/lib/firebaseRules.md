
# Firebase Security Rules Information

This document provides information about required Firebase security rules for this application.

## Current Issue

The application is experiencing "Missing or insufficient permissions" errors when trying to write to Firestore collections. This means your security rules are too restrictive.

## How to Fix

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to "Firestore Database" in the left navigation
4. Click on the "Rules" tab

Replace your current rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /learning-paths/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /user-settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Explanation of These Rules

1. The first rule for `/learning-paths/{document=**}` allows:
   - Reading a document if the authenticated user's UID matches the `userId` field in the document
   - Updating/deleting a document if the authenticated user's UID matches the `userId` field
   - Creating a new document if the authenticated user's UID matches the `userId` field being set in the new document

2. The second rule for `/user-settings/{userId}` allows:
   - Reading and writing to a user-settings document only if the document ID matches the authenticated user's UID

3. The default rule denies all other access for security

## Temporary Solution

As a temporary solution, the application now uses localStorage as a fallback when Firestore operations fail. This allows you to continue using the app while you fix the Firestore permissions.

Your data will be stored locally in your browser until the Firebase permissions are fixed.
