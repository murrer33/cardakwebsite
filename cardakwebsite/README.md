# Çardak

Çardak is a full-stack web application that provides a platform for creating and taking tests, sharing photos, and participating in daily forum discussions.

## Features

- **Tests:** Create custom tests with multiple choice, image-based, or open-ended questions. Take tests and view results.
- **Photos:** Upload and view images shared by the community.
- **Daily Short Forum:** Participate in discussions by posting short comments with a temporary username.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Firebase (Firestore, Storage)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 8.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cardakwebsite.git
   cd cardakwebsite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore and Storage
   - Update the Firebase configuration in `firebase.ts` with your project details

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The project is configured to be deployed on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## License

This project is licensed under the MIT License.
