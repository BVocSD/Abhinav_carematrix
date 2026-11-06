# CareMatrix - Next-Gen Home Care Management System

CareMatrix is a modern, full-stack home-care application designed to streamline service bookings, caregiver management, and job applications. Built with **Next.js 15**, **Tailwind CSS**, and **Firebase**, it provides a secure and intuitive platform for both users and administrators.

## 🚀 Features

- **Global Authentication Gate**: Secure login and signup overlay required to access the platform.
- **Service Booking System**:
  - Interactive custom calendar for selecting dates (past dates disabled).
  - Caregiver selection with ratings and bios.
  - Real-time booking storage in Firebase Firestore.
- **Career Portal**:
  - Job listings and application submission.
  - Automated confirmation system for candidates.
- **Admin & Dashboard**:
  - Secure admin portal for managing bookings and applications.
  - User-specific dashboard for tracking service status.
- **Modern UI/UX**:
  - Built with Shadcn/UI components.
  - Responsive design for mobile and desktop.
  - Professional toast notifications for user feedback.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Firebase (Firestore, Auth)](https://firebase.google.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhinav404p/carematrix.git
   cd carematrix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:9010`.

## 🏗️ Deployment

The project is optimized for deployment on **Firebase App Hosting** or **Vercel**.

### Firebase Hosting
1. Initialize Firebase: `firebase init`
2. Deploy: `firebase deploy`

## 📄 License

This project is licensed under the MIT License.
