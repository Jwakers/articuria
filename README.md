# MVP To-Do List for Table Topics App

## 1. Project Setup

- [x] Initialize the Next.js project.
- [x] Set up Clerk for authentication and configure user sign-in/sign-up functionality.
- [x] Integrate Prisma and connect it to the Supabase-hosted PostgreSQL database.
- [ ] Set up end-to-end testing in the project and in the CI/CD pipeline
- [ ] Landing page

## 2. Database Schema Design

- [ ] Define a Prisma schema with the following models:
  - **User**: Information about the users.
  - **Topic**: Details of AI-generated topics.
  - **Video**: Video records saved by users.
- [ ] Migrate the schema to the PostgreSQL database.

## 3. AI-Generated Table Topics

- [ ] Integrate an AI API (like OpenAI) for generating random table topics.
- [ ] Create an API route in Next.js to fetch a new table topic on demand.

## 4. Video Recording and Playback

- [ ] Implement video recording functionality using a web-based library (e.g., `react-webcam` or MediaRecorder API).
- [ ] Allow users to preview and playback recorded videos before saving.

## 5. Saving Videos to the Database

- [ ] Set up file storage for videos (e.g., upload them to Supabase Storage or another storage provider like uploadthing).
- [ ] Link stored video URLs to the database using the Video model.

## 6. User Dashboard

- [ ] Create a dashboard where users can:
  - View their saved videos.
  - Watch previously recorded videos.
- [ ] Fetch and display user-specific data from the database using Prisma.

## 7. Authentication

- [ ] Protect routes so only signed-in users can access dashboard and video features.
- [ ] Configure role-based or user-based authorization if necessary.

## 8. UI/UX

- [ ] Design a clean and intuitive UI using TailwindCSS or a similar framework.
- [ ] Include key components like:
  - Landing page.
  - Sign-in/sign-up page (integrated with Clerk).
  - Dashboard for viewing and recording topics.

## 9. Hosting and Deployment

- [ ] Deploy the Next.js app on Vercel.
- [ ] Ensure Clerk is configured correctly for the deployed domain.
- [ ] Test the database connection with Supabase in the production environment.

## 10. Testing and QA

- [ ] Test the app's functionality locally and in production.
- [ ] Perform end-to-end testing of:
  - AI-generated topics.
  - Video recording and playback.
  - Database operations (saving and retrieving videos).
  - Authentication.

## 11. Optional Enhancements for MVP

- [ ] Add user profile customization (e.g., profile pictures).
- [ ] Allow users to delete or rename saved videos.
- [ ] Add timestamps or metadata to saved videos (e.g., topic name, date).
