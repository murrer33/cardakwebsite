# Project Structure Documentation

## Overview

The Çardak web application is built using Next.js, React, and Firebase, providing a platform for creating and taking tests, sharing photos, and participating in daily forum discussions.

## Directory Structure

```
cardakwebsite/
├── app/                    # Next.js App Router folder
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation bar component
│   │   └── PhotoUpload.tsx # Photo upload form component
│   ├── fotograflar/        # Photos section
│   │   └── page.tsx        # Main photos page
│   ├── forum/              # Forum section
│   │   └── page.tsx        # Main forum page
│   ├── services/           # Firebase service layer
│   │   └── firebaseService.ts # Firebase interaction helpers
│   ├── testler/            # Tests section
│   │   ├── [id]/           # Dynamic route for individual tests
│   │   │   └── page.tsx    # Single test viewing and taking page
│   │   ├── olustur/        # Test creation route
│   │   │   └── page.tsx    # Test creation page
│   │   └── page.tsx        # Main tests listing page
│   ├── globals.css         # Global CSS styles
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── firebase.ts             # Firebase configuration
├── firestore.rules         # Firestore security rules
├── storage.rules           # Firebase Storage security rules
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies
├── vercel.json             # Vercel deployment configuration
└── README.md               # Project documentation
```

## Core Features

### Navigation (app/components/Navbar.tsx)
- Responsive navigation bar with links to all sections
- Mobile-friendly design with collapsible menu

### Home Page (app/page.tsx)
- Landing page with introduction and links to main features
- Featured cards for each section

### Tests Section
- **Listing Page** (app/testler/page.tsx): Displays all available tests
- **Test Creation** (app/testler/olustur/page.tsx): Form for creating custom tests with multiple question types
- **Test Taking** (app/testler/[id]/page.tsx): Interface for taking tests and viewing results

### Photos Section (app/fotograflar/page.tsx)
- Gallery of uploaded photos
- Photo upload functionality with preview
- Like functionality for photos

### Forum Section (app/forum/page.tsx)
- Daily discussion board
- Form for posting comments with temporary username
- Chronological display of posts

### Firebase Services (app/services/firebaseService.ts)
- Test management functions
- Photo upload and retrieval
- Forum post handling

## Configuration Files

### Firebase Configuration (firebase.ts)
- Firebase app initialization
- Firestore and Storage setup

### Security Rules
- **Firestore Rules** (firestore.rules): Access control for database
- **Storage Rules** (storage.rules): Access control for file storage

### Styling
- **Tailwind CSS** (tailwind.config.js): UI styling configuration
- **Global CSS** (app/globals.css): Global style variables and base styles

## Deployment

The project is configured for deployment on Vercel with:
- Custom headers for security
- Optimized region selection
- Build and installation commands 