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
- [x] Pagination not correctly disabled causes error
- [x] Properly clean up media recorded api on unmount. It remains in a ready to record state even on unrelated pages.
- [x] On IPhone the media recorded goes full screen making it harder to stop the video and see the topic
- [x] On selecting a menu item on mobile the sidebar should close
- [x] Download does not work on mobile (ios)
- [x] Manage recordings on mobile looks terrible and causes the sidebar to overflow

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
- Update project name. Check for domains

  - [x] Update in clerk
  - [x] Update in supabase
  - [x] Update repo name
  - [x] Update in vercel
  - [x] Update in code

## 2. Database Schema Design

- [x] Define a Prisma schema with the following models:
  - **Video**: Video records saved by users.
  - **Topic**: Details of AI-generated topics.
- [x] Migrate the schema to the PostgreSQL database.

~~## 3. AI-Generated Table Topics~~ (Moved to post MVP)

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

- [x] Add a contact page
  - [x] Should have options (issues, app feedback, other etc)
  - [x] Build endpoint to send email with node-mailer
- [x] Update message to HTML. Send user ID with message
- [x] Add contact page link to the sidebar
- [x] Add section to dashboard asking for app feedback and direct to the form
- [ ] Set up dedicated email for this app

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

- [x] Deploy the Next.js app on Vercel.
- [x] Ensure Clerk is configured correctly for the deployed domain including webhook URLs
- [x] Test the database connection with Supabase in the production environment.
- [x] Setup cloudflare webhook
- [x] Add meta data to all pages
- [ ] Video limit reached is not outputting a user friendly error on production

## 10. Testing and QA

- [ ] Test the app's functionality locally and in production.
- [ ] Perform end-to-end testing of:
  - Video recording and playback.
  - Database operations (saving and retrieving videos).
  - Authentication.

### Additional

## Legal

- [ ] Privacy page
- [ ] Terms page

## Bugs

- [x] Manage video page has padding issue on video card
- [ ] Error uploading large videos > 1:30. Prisma transaction is timing out.

## Post MVP updates

- Enhance video recording page:
  - [x] Countdown timer before recording.
  - [x] Better prominence of the table topic with animations (overlay the video. Start large and then reduce size)
  - [x] Refactor background and spinner colors to conform with the theming in global.css
  - [x] After recording is saved. Add section to link to that video
  - [ ] Refactor media recorder to use one video element for stream and one for playback
- Improve the traffic light indicator:

  - [x] Make it more visible
  - [x] Have a section that explains the traffic light system

- [ ] On recorder page warn that data will be lost on redirect or refresh (trigger alert dialog when navigating without saving)
- [ ] On recorder page add a warning banner that someone is exceeding their video limit and should delete or upgrade their account. ALSO the video still gets sent to cloudflare for some reason

- Contact form

  - [ ] Rate limiting to prevent abuse
  - [ ] Input sanitization before sending emails (DOMPurify)
  - [ ] Moving email templates to a separate file for better maintainability
  - [ ] Validate input client side before submission

- [ ] Update favicon

- [ ] Move save logic out of server actions and into an api route. There is an adjustable limit on server actions. See next.config but to be safe we should pass this data to a dedicated endpoint. This should also allow us to properly validate the file type on the server.
  - [ ] Test this by uploading a longer video
  - [ ] Show progress indicator in toast.promise

## Post MVP features

AI-Generated Table Topics

- [ ] Integrate an AI API (like Gemini) for generating random table topics.
- [ ] Create an API route / server action in Next.js to fetch a new table topic on demand.

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

- Add colour blind option in user settings that adds number to the color indicators on the traffic light system (green circle should have a 1, orange a 2 and red a 3). Don't forget to include these indicators in the guide section of the page too.
