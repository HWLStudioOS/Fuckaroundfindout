# ManyChat: Roger Martin Sum Up

## Status

Ready to build. Blocked only on signing in to the Better at Work ManyChat workspace and confirming the Instagram connection.

## The first test

- Channel: Better at Work Instagram
- Automation name: `SUM UP 01 | Roger Martin | IG comments`
- Trigger: Instagram Post and Reel Comments
- Post selection: Next post or reel
- Rule: comment contains the full word `STRATEGY`
- Run on: first-level comments
- Public replies: on, rotate the three lines below

Public reply variants:

1. Sent. Check your DMs.
2. It's on its way. Check your messages.
3. Just sent it over.

## Flow

### 1. Opening private reply

Send as a Private Reply. Keep this as one text block.

> Roger's point is simple: most plans are lists of initiatives, not choices. We turned the episode into a four-page Sum Up you can use with your team.

Quick reply: `GET THE SUM UP`

The quick reply is required. It opens Instagram's 24-hour messaging window and allows the rest of the automation to run.

### 2. Email capture

Use a Data Collection block with reply type `Email`. Save it to the contact's Email system field.

> Leave your email if you'd like the PDF plus occasional Better at Work resources. You can unsubscribe at any time. The PDF will appear here straight away.

Use the workspace's existing privacy policy and approved email consent setting. If neither is configured, keep the address in ManyChat and do not sync it to Mailchimp until Cathal approves the wording.

### 3. Tag

Apply the tag:

`Lead Magnet | Roger Martin Sum Up`

### 4. Deliver the PDF

Add an Instagram PDF content block and upload:

`output/pdf/Roger-Martin-Sum-Up.pdf`

Message above the PDF:

> Here it is. Four pages. Use the final page at your next strategy conversation.

Optional button after the PDF, once the episode is live:

`LISTEN TO ROGER`

Point it to the final Acast episode URL.

## Launch caption CTA

> We also turned the episode into a four-page Sum Up you can use with your team.
>
> Comment STRATEGY and we'll send it to you.

## What not to do

- Do not point people to Google Drive.
- Do not add a website button to the opening private reply. A website click does not open the Instagram messaging window.
- Do not ask LinkedIn users to comment `STRATEGY`. ManyChat cannot fulfil that channel.
- Do not block tomorrow's Instagram test on Mailchimp integration. Capture the email and tag in ManyChat first. Sync is the next step.

## Test before the caption goes live

Use an Instagram account that is not an admin of Better at Work.

1. Preview the automation inside Instagram.
2. Comment `STRATEGY` on the selected test or next post.
3. Confirm one public reply appears.
4. Confirm the opening DM arrives.
5. Tap `GET THE SUM UP`.
6. Enter a fresh test email.
7. Confirm the tag is applied in ManyChat.
8. Open the PDF inside Instagram and check all four pages.
9. Confirm the PDF is readable on mobile.
10. Delete the test contact or mark the email clearly as a test.

If any step fails, remove the two Sum Up lines from the Instagram launch caption and publish the episode launch without the funnel.
