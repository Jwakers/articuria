# Articuria

## 0. Bugs and Refactor

- [ ] Error uploading large videos > 1:30. Prisma transaction is timing out.
- [ ] Generating a second topic causes the video stream to fail.
- [ ] contact page needs a loading.tsx

## 1. Updates

- Enhance video recording page:

- [ ] Add higher video quality as a pro feature
- [ ] Style active link/page in sidebar
- [ ] Style warning banners with warning colors
- [ ] Sign in should open in a modal not a new page
- [ ] Unify all page headings to use the same styling (take from the subscription management page)
- [ ] Add/update metadata for all pages
- [ ] Rate limiting api routes.
- [ ] Move email templates to a separate file for better maintainability.
- [ ] Create cloudflare webhook should run on every deployment.
- [ ] Should isolate development and production webhooks on cloudflare to prevent interruption of production webhook.
- [ ] Update favicon.
- [ ] Move save logic out of server actions and into an API route. There is an adjustable limit on server actions. See next.config but to be safe we should pass this data to a dedicated endpoint. This should also allow us to properly validate the file type on the server.
  - [ ] Test this by uploading a longer video.
  - [ ] Show progress indicator in toast.promise.

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
  - [ ] Cancel subscription logic (make sure that cancelled accounts can still access premium features until the end date)
  - [ ] Update stripe dashboard with all relevant feature information
  - [ ] Should videos be deleted on cancellation
  - [ ] Add all preview and production keys to vercel

- AI-Generated Table Topics:

  - [x] Generate topic
  - [ ] UI for difficulty and theme options (premium users only).
  - [ ] Performance review (premium users only. Tools: Speechmatics, AssemblyAI).=
    - [ ] UI.
    - [ ] API
      - [ ] Speech pace analysis
      - [ ] Filler word detection ("um", "uh", "like")
      - [ ] Speaking time measurement

- Speech helper:

  - [ ] Ability to record a speech.
  - [ ] The speech can be transcribed for you.
  - [ ] You can then edit the script.
  - [ ] Show stats like approximate time to read, number of ums and ahs, pacing (number of pauses, words per minute, etc.).
  - [ ] Enhance, change, add to, or refine the speech with AI.
  - [ ] Overlay the speech and scroll through it on the screen to help with rehearsing.
  - [ ] Memorization tests.

- [ ] Table topics rating (like/dislike).
- [ ] Save large videos with TUS (note need to use a TUS client to accomplish this, check out the TUS website as well as the Cloudflare docs).

- Custom account management page:

  - [ ] Update image.
  - [ ] Update name.
  - [ ] Delete account (removing the need for the webhook).
  - [ ] Any other Clerk functionality offered by the API.

- [ ] Add color blind option in user settings that adds numbers to the color indicators on the traffic light system (green circle should have a 1, orange a 2, and red a 3). Don't forget to include these indicators in the guide section of the page too.

- [ ] On recorder page, warn that data will be lost on redirect or refresh (trigger alert dialog when navigating without saving). This is complex and cannot be handled with the beforeunload event. Next.js uses 'soft' navigation so the event does not fire. Need to find a way to intercept route changes before they happen.
