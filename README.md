# Articuria

## 0. Bugs and Refactor

- [x] Log out button in user menu does not work
- [x] Traffic light system in accordions looks rough
- [x] Alert dialogs transition in from teh side of the screen
- [ ] Generating a second topic causes the video stream to fail.
- [ ] contact page needs a loading.tsx
- [ ] If the user does not save a video for a topic they will see the same one again
- [x] Clicking the sign out button in the user menu causes a client error (need to use clerk to refresh the session or redirect to the home page)
- [x] Subscription drawer gradient is bugged (more noticeable in light mode)
- [x] Signed out users can click upgrade now on the home page and see the subscription drawer

## 1. Updates

- [x] Remove "Coming soon" from transcript and report features. Also appears on the billing and subscription page (including in stripe dashboard)
- [ ] On recorder page, warn that data will be lost on redirect or refresh (trigger alert dialog when navigating without saving). This is complex and cannot be handled with the beforeunload event. Next.js uses 'soft' navigation so the event does not fire. Need to find a way to intercept route changes before they happen.
- [ ] Enable a paid plan on mux
- [x] Update favicon (can use the mic icon for now or just an "A" in a black background).
- [x] add (create) logo to Stripe branding section
- [x] Check and update whether preview deployments causes database migration to the production DB (this must be prevented if so)
- [x] Improve the home page
- [x] Add privacy and terms of service page
- [x] Upgrade tailwind
- [x] Implement brand colors across code base not just for special elements
- [ ] Refactor report and translation to work in complete isolation (the files are too crowded)
- [ ] Generate transcript with open ai removing assembly ai from the project
  - [ ] Stream the transcript to the client
- [ ] Provide open ai with table topic audio for a better review
- [ ] Table topic report is quite generous, event for a totally shit video. Perhaps have it review duration in conjunction with what a normal table topic should be
  - [ ] Feedback should only be given on topics longer than one minute?
- [x] With the stripe getReceiptUrl function, validate the charge belongs to the user
- [ ] Add pagination back to the video list page
- [ ] Setup eslint validation locally with existing config (same that applies to vercel builds)
- [ ] Check for existing topics the user has already done or suitable existing topics in the database before generating a new one
- [ ] update all user fields in schema to be a reference to the users table
- [ ] Set up a trello board for tasks
- [ ] Create actual read me from code rabbit or AI tool

# Convex refactor

- [x] IMPORTANT: Set up cron jobs to populate missing video data or other means to fill missing data
- [x] Utility function to return user data and account limits
- [x] Remove old prisma code and env variables (including from PROD)
- [x] Refactor mux webhook to convex httpAction
- [x] Refactor mux server actions into convex actions
- [x] Refactor openai server actions to convex actions
- [x] Review with code rabbit before PR
- [x] Populate env variables and webhook URLs for production including signing secrets
- [x] Remove redundant env vars (including cloudflare) from vercel and vercel env pull to local
- [ ] Refactor and abstract the transcript and report sections of the video page.
- [ ] Research convex caching and make adjustments to code
- [x] Fully read all important parts of the convex docs, best practice, dev guides, etc and task out any improvements
  - [x] Refactor to a shared code pattern (e.g. convex/model/videos.ts import these into convex/videos.ts which should contain much less code): https://docs.convex.dev/understanding/best-practices/#use-helper-functions-to-write-shared-code
  - [ ] Replace all instances of .filter with .withIndex if possible: https://docs.convex.dev/understanding/best-practices/#examples
  - [ ] Only use .collect with a small number of results
  - [ ] Only schedule and ctx.run\* internal functions
  - [ ] Use runAction only when using a different runtime
  - [ ] replace Error with ConvexError
  - [ ] Make all components that use data, client side components (don't pass promises to them in props)
- [ ] Enable no floating promises in eslint https://typescript-eslint.io/rules/no-floating-promises/
- [ ] Reorganise convex files into public and private folders for internal and public queries/mutations
- [ ] Review all app interactions and simplify/remove tech dept where possible
- [ ] Track each table topic a users sees in the users table

## 2. New Features

- [ ] Add a documentation and support page. There is a card for this on the success page and a link on the home page, once complete, enable these

- [ ] Free users should be able to generate 1 feedback report and transcription for free
- [ ] When a video is saved a notification should show them they can go to the video and generate feedback for it if their account allows

- [ ] Add higher video quality as a pro feature (both in the features list and in the APIs)

- AI-Generated Table Topics:

  - [x] Generate topic
  - [x] UI for difficulty and theme options (premium users only).
  - [x] Performance review (premium users only. Tools: Speechmatics, AssemblyAI).
    - [x] UI.
    - [x] API

- [ ] Progress visualisation/chart/graph based on table topic feedback and transcript data on the user
  - [ ] dashboard
  - [ ] Individual table topic page

| Chart                                | Data Fields Used                                                      | Notes                              |
| ------------------------------------ | --------------------------------------------------------------------- | ---------------------------------- |
| Line Chart – WPM                     | transcript.date, transcript.wordsPerMinute                            | Shows speaking pace over time      |
| Bar Chart – Filler Use               | transcript.date, transcript.fillerWordCount                           | Visualize reduction in filler use  |
| Sentiment Over Time                  | transcript.date, sentimentSummary scored numerically (e.g. +1, 0, -1) | Optionally stack positive/negative |
| Radar Chart – AI Score Breakdown     | AI review scores (clarity, tone, engagement)                          | For detailed per-speech feedback   |
| Stacked Area Chart – Time Allocation | e.g., sentiment over time per transcript                              | Great for showing tone shifts      |

- Speech helper:

  - [ ] Ability to record a speech.
  - [ ] The speech can be transcribed for you.
  - [ ] You can then edit the script.
  - [ ] Enhance, change, add to, or refine the speech with AI.
  - [ ] Overlay the speech and scroll through it on the screen to help with rehearsing.
  - [ ] Memorization tests.

- [ ] Table topics rating (like/dislike).

- [ ] Custom account management page:

  - [ ] Update image.
  - [ ] Update name.
  - [ ] Delete account (removing the need for the webhook).
  - [ ] Any other Clerk functionality offered by the API.

- [ ] Add color blind option in user settings that adds numbers to the color indicators on the traffic light system (green circle should have a 1, orange a 2, and red a 3). Don't forget to include these indicators in the guide section of the page too.

- [ ] Rate limiting (when the project starts to gain traction)
