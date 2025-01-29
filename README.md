# MVP To-Do List for Table Topics App

## 0. Bugs and refactor

- [x] Fix code review issues
- [x] Fix clerk sign up
- [x] Get a large fixed store of table topics (Will eventually be evolved to use AI generated topics)
- [x] remove naming feature for the video download
- [x] Timer indicator is not working when recording video
- [x] Issue starting a new recording (generate topic button) when there is already a recorded video
- [x] Home page sign up button does not work
- [x] Add all routes to a constant and replace hard coded instances
- [x] User should be redirected to dashboard on sign in/up
- [ ] Fix clerk button pop-in
- [ ] Make videos more secure in cloudflare using requireSignedURLs.

## 1. Project Setup

- [x] Initialize the Next.js project.
- [x] Set up Clerk for authentication and configure user sign-in/sign-up functionality.
- [x] Integrate Prisma and connect it to the Supabase-hosted PostgreSQL database.
- [x] Landing page
  - [x] Move header and footer to layout (use a grid for the layout)
  - [x] Find a nicer background gradient and store in tailwind config
  - [x] Add light/dark toggle and infrastructure
- [x] Add a persistent sidebar menu (create topic, user dashboard, home) etc. This should be a layout level feature and only for logged in users.
- [ ] Mobile menu

## 2. Database Schema Design

- [x] Define a Prisma schema with the following models:
  - **Video**: Video records saved by users.
  - **Topic**: Details of AI-generated topics.
- [x] Migrate the schema to the PostgreSQL database.

## 3. AI-Generated Table Topics

- [ ] Integrate an AI API (like OpenAI) for generating random table topics.
- [ ] Create an API route in Next.js to fetch a new table topic on demand.

## 4. Video Recording and Playback

- [x] Implement video recording functionality using a web-based library (e.g., `react-webcam` or MediaRecorder API).
- [x] Allow users to preview and playback recorded videos before saving.
- [x] Save topics to DB
- [x] Set up cloudflare
- [x] Save video to DB / Reference user ID
- [x] Add loading indicators / transition when videos are uploading
- [x] Add toast message for successfully uploading
- [x] Add error messages on the front end
- [x] Add toast component for error handling and messaging
- [x] Delete recording toast should be swapped out for a more visible modal
- [ ] Compress recordings before upload
- [x] Add a memory limit on video uploads
  - [ ] Move the whole upload function to a server action to safely limit upload size
- [ ] Add a limit to how many videos a user can upload

## 5. Saving Videos to the Database

- [x] Set up file storage for videos (e.g., upload them to Supabase Storage or another storage provider like uploadthing).
- [x] Link stored video URLs to the database using the Video model.

## 6. User Dashboard

- Create a dashboard where users can:
  - [x] View their saved videos.
  - [x] Watch previously recorded videos.
  - Manage videos
    - [x] Delete videos
- [x] Fetch and display user-specific data from the database using Prisma.
- [x] Add account to the sidebar proper including profile image
- [x] Add breadcrumb next to the sidebar icon as per example
- [x] Add theme toggle to the dashboard
- [x] Add manage account button to dashboard menu
- [ ] Close the sidebar on mobile
- [x] Create root page for table topics (it should redirect to the manage page for now)
- [x] Download video functionality (useManageVideo)
- [ ] Add index number of videos next to the manage videos menu item
- [ ] Add duration to video table. Add this duration to the manage table
- [ ] Set video ID to UUID rather than incremental number (it looks weird in the URL)
- [ ] Add no recordings page component

## 7. Authentication

- [x] Protect routes so only signed-in users can access dashboard and video features.
- [x] Redirect user on sign in
- [ ] Create account limits and apply to the FE + BE
- [ ] On account deletion all data should be removed from the DB and cloudflare

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

### Additional

## Legal

- Privacy page
- Terms page

## Optional Enhancements for MVP

- [ ] Add user profile customization (e.g., profile pictures).
- [ ] Allow users to delete or rename saved videos.
- [ ] Add timestamps or metadata to saved videos (e.g., topic name, date).
