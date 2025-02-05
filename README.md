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
- [x] Download video (from cloudflare) on video page is not working. Behaviour is sporadic.
- [x] Redirect to home page after deleting account
- [x] Table topics indicator is not working correctly. Should show on one minute not be green the whole time.
- [ ] Error uploading large videos > 1:30. Prisma transaction is timing out.

## 1. Project Setup

- [x] Initialize the Next.js project.
- [x] Set up Clerk for authentication and configure user sign-in/sign-up functionality.
- [x] Integrate Prisma and connect it to the Supabase-hosted PostgreSQL database.
- [x] Landing page
  - [x] Move header and footer to layout (use a grid for the layout)
  - [x] Find a nicer background gradient and store in tailwind config
  - [x] Add light/dark toggle and infrastructure
- [x] Add a persistent sidebar menu (create topic, user dashboard, home) etc. This should be a layout level feature and only for logged in users.
- [x] Mobile menu / Header layout
- [ ] Update favicon

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
- [x] Add a memory limit on video uploads
  - [x] Move the whole upload function to a server action to safely limit upload size
- [x] Add a limit to how many videos a user can upload
- [ ] Compress recordings before upload

## 5. Saving Videos to the Database

- [x] Set up file storage for videos (e.g., upload them to Supabase Storage or another storage provider like uploadthing).
- [x] Link stored video URLs to the database using the Video model.
- [x] Move save video logic to a prisma transaction

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
- [x] Create root page for table topics (it should redirect to the manage page for now)
- [x] Download video functionality (useManageVideo)
- [x] Close the sidebar on mobile
- [x] Add duration to video table. Add this duration to the video list component
- [x] Set video ID to UUID rather than incremental number (it looks weird in the URL)
- [x] Add no recordings page component
- [x] Add pagination to recording list
- [x] Add proper dynamic dashboard stats rather than the current hardcoded values

## 6.5 Contact

- [ ] Add a contact page
  - [ ] Hidden fields: user ID
  - [ ] Should have options (issues, app feedback, other etc)
  - [ ] Build endpoint to send email with node-mailer
- [ ] Add a section on the dashboard where users can link to contact
- [ ] Contact page should be a protected routes

## 7. Authentication

- [x] Protect routes so only signed-in users can access dashboard and video features.
- [x] Redirect user on sign in
- [x] Create account limits and apply to the FE + BE
  - [x] Video upload limits
  - [x] Video length/size limit
- [x] On account deletion all data should be removed from the DB and cloudflare

## 8. UI/UX

- [x] Design a clean and intuitive UI using TailwindCSS or a similar framework.
- [x] Include key components like:
  - [x] Landing page.
  - [x] Sign-in/sign-up page (integrated with Clerk).
  - [x] Dashboard for viewing and recording topics.

## 9. Hosting and Deployment

- [ ] Deploy the Next.js app on Vercel.
- [ ] Ensure Clerk is configured correctly for the deployed domain including webhook URLs
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

- [ ] Privacy page
- [ ] Terms page

## Optional Enhancements for MVP

- [ ] Video expiry (automatic delete) on free accounts (use a webhook to manage the database / or a cron job and do it directly from the server)
- Enhance video recording page:
  - [ ] Countdown timer before recording.
  - [ ] Better prominence of the table topic with animations (overlay the video. Start large and then reduce size)
  - [ ] Center the video when recording starts
  - [ ] After recording is saved. Add section to link to that video
- Improve the traffic light indicator:
  - [ ] Make it more visible
  - [ ] Have a section that explains the traffic light system

## Post MVP features

- Speech helper
  Ability to record a speech.
  The speech can be transcribed for you.
  You can then edit the script.
  Show stats like approximate time to read, number of ums and ahs, pacing (number of pauses, words per minute etc).
  Enhance, change, add to or refine the speech with AI.
  Overlay the speech and scroll through it on the screen to help with rehearsing
  Memorization tests

- Table topics rating (like dislike)

- [ ] Save large videos with TUS (note need to use a tus client to accomplish this, check out the tus website as well as the Couldflare docs) https://developers.cloudflare.com/api/node/resources/stream/methods/create/

- Custom account management page
  - [ ] update image
  - [ ] Update name
  - [ ] delete account (removing the need for the webhook)
  - [ ] any other clerk functionality offered by the API

## Post MVP updates

- [ ] Move save logic out of server actions and into an api route. There is an adjustable limit on server actions. See next.config but to be safe we should pass this data to a dedicated endpoint. This should also allow us to properly validate the file type on the server.
  - [ ] Test this by uploading a longer video
  - [ ] Show progress indicator in toast.promise
- [ ] On recorder page warn that data will be lost on redirect or refresh (trigger alert dialog when navigating without saving)
