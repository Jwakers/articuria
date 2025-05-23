# Articuria

## 0. Bugs and Refactor

- [x] Log out button in user menu does not work
- [x] Traffic light system in accordions looks rough
- [ ] Video still processing dialog is a bit shit
- [ ] Generating a second topic causes the video stream to fail.
- [ ] contact page needs a loading.tsx
- [ ] If the user does not save a video for a topic they will see the same one again

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
- [ ] Refactor to convex
- [ ] Upgrade to cursor pro
- [ ] Provide open ai with table topic audio for a better review
- [ ] Generate transcript with open ai removing assembly ai from the project
- [ ] Table topic report is quite generous, event for a totally shit video. Perhaps have it review duration in conjunction with what a normal table topic should be
  - [ ] Feedback should only be given on topics longer than one minute?

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
