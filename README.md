# Articuria

## 0. Bugs and Refactor

- [x] Log out button in user menu does not work
- [x] Traffic light system in accordions looks rough
- [ ] Video still processing dialog is a bit shit
- [ ] Error uploading large videos > 1:30. Prisma transaction is timing out.
- [ ] Generating a second topic causes the video stream to fail.
- [ ] contact page needs a loading.tsx
- [ ] If the user does not save a video for a topic they will see the same one again

## 1. Updates

- Enhance video recording page:

- [x] Add "Cancel anytime" to the subscription drawer pro plan card
- [ ] Add higher video quality as a pro feature (both in the features list and in the APIs)
- [ ] Style active link/page in sidebar
- [ ] Style warning banners with warning colors
- [ ] Sign in should open in a modal not a new page
- [ ] Unify all page headings to use the same styling (take from the subscription management page)
- [ ] Add/update metadata for all pages
- [ ] Add loading UI when changing pages on the video management route
- [ ] Video length should be limited based on tier before saving
- [ ] Rate limiting api routes.
- [ ] Remove "Coming soon" from transcript and report features (including in stripe dashboard)
- [ ] Move email templates to a separate file for better maintainability.
- [ ] Update favicon.
- [ ] add (create) logo to Stripe branding section
- [ ] Improve the home page
- [ ] Move save logic out of server actions and into an API route. There is an adjustable limit on server actions. See next.config but to be safe we should pass this data to a dedicated endpoint. This should also allow us to properly validate the file type on the server.
  - [ ] Test this by uploading a longer video.
  - [ ] Show progress indicator in toast.promise.
- [ ] Watch database for changes on the manage video page [id]. This should prevent the need for refreshing. Another example is the go to video link on the recorder page, this should watch for changes and update accordingly
- [x] Calculate average score by summing individual scores and remove it from the openai api request
- [ ] Provide open ai with table topic audio for a better review
- [ ] Generate transcript with open ai removing assembly ai from the project

- [ ] Table topic report is quite generous, event for a totally shit video. Perhaps have it review duration in conjunction with what a normal table topic should be
  - [ ] Feedback should only be given on topics longer than one minute?

## 2. New Features

- Add Stripe

  - [x] Set up drawer UI for subscriptions
    - [x] Should not show for subscribed users
    - [x] Add a card for "free" users
    - [x] Dashboard banner
    - [x] Sidebar section
    - [x] Trigger from header
  - [x] Set up Clerk public data to sync stripe customer data
    - [x] Syn should run on success page and webhook
  - [x] Create success page
    - [x] Handle checkout data sync (including tier data)
  - [x] Handle existing account limit logic
  - [x] Create an manage subscription page for subscribed users
  - [x] Cancel subscription logic (make sure that cancelled accounts can still access premium features until the end date)
  - [x] Update stripe dashboard with all relevant feature information
  - [x] Submit for review and fix
  - [ ] Should videos be deleted on cancellation?
  - [x] Set up production instance in stripe
  - [x] Add all preview and production keys to vercel
  - [x] Launch

- [ ] Free users should be able to generate 1 feedback report and transcription for free
- [ ] When a video is saved a notification should show them they can go to the video and generate feedback for it if their account allows

- AI-Generated Table Topics:

  - [x] Generate topic
  - [x] UI for difficulty and theme options (premium users only).
  - [x] Performance review (premium users only. Tools: Speechmatics, AssemblyAI).
    - [x] UI.
    - [x] API

- Progress visualisation/chart/graph based on table topic feedback and transcript data on the user
  - [ ] dashboard
  - [ ] Individual table topic page

| Chart                                | Data Fields Used                                                      | Notes                              |
| ------------------------------------ | --------------------------------------------------------------------- | ---------------------------------- |
| Line Chart – WPM                     | transcript.date, transcript.wordsPerMinute                            | Shows speaking pace over time      |
| Bar Chart – Filler Use               | transcript.date, transcript.fillerWordCount                           | Visualize reduction in filler use  |
| Sentiment Over Time                  | transcript.date, sentimentSummary scored numerically (e.g. +1, 0, -1) | Optionally stack positive/negative |
| Radar Chart – AI Score Breakdown     | AI review scores (clarity, tone, engagement)                          | For detailed per-speech feedback   |
| Stacked Area Chart – Time Allocation | e.g., sentiment over time per transcript                              | Great for showing tone shifts      |

- Enhance AI text feedback by passing the audio directly to a suitable tool

- Speech helper:

  - [ ] Ability to record a speech.
  - [ ] The speech can be transcribed for you.
  - [ ] You can then edit the script.
  - [ ] Show stats like approximate time to read, number of ums and ahs, pacing (number of pauses, words per minute, etc.).
  - [ ] Enhance, change, add to, or refine the speech with AI.
  - [ ] Overlay the speech and scroll through it on the screen to help with rehearsing.
  - [ ] Memorization tests.

- [ ] Table topics rating (like/dislike).

- Custom account management page:

  - [ ] Update image.
  - [ ] Update name.
  - [ ] Delete account (removing the need for the webhook).
  - [ ] Any other Clerk functionality offered by the API.

- [ ] Add color blind option in user settings that adds numbers to the color indicators on the traffic light system (green circle should have a 1, orange a 2, and red a 3). Don't forget to include these indicators in the guide section of the page too.

- [ ] On recorder page, warn that data will be lost on redirect or refresh (trigger alert dialog when navigating without saving). This is complex and cannot be handled with the beforeunload event. Next.js uses 'soft' navigation so the event does not fire. Need to find a way to intercept route changes before they happen.
