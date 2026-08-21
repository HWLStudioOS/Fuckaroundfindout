# Comms verification, Tue 18 August 2026, 21:50 BST

Gmail check of what was actually sent or staged today across Squiggly, LOR and BaW, plus a 48-hour inbox triage. Mailbox checked: harrison@hwlstudio.com only. The personal Gmail (harrison.living@gmail.com) is not visible to this connector, so anything that lives there shows as absent here. Nothing was sent, labelled or trashed. One draft created (Cathal). Times are BST.

## 1. Squiggly Careers: STAGED AS DRAFT, wording differs, not threaded

| Check | Result |
|---|---|
| Proposal draft exists | Yes. Draft `r-7386512596381199276`, created 14:40, to helen@amazingif.com, cc sarah@amazingif.com and sarahmassie@amazingif.com, subject "Re: Squiggly Careers Production". Only other draft in the mailbox is the Cathal one created tonight. |
| Required elements | All present: £3,400 a month plus VAT, twelve months, review at end of first quarter, 14 September, Tuesday 6 October, the seven-vs-eight release dates line, the 5 September access list. |
| Body matches canonical file text | No. Timing section differs materially (below). Everything else matches word for word. |
| Threaded on "Squiggly Careers Production" | No. Draft threadId is `1a0151a1f3497bf5` (a fresh thread created at 14:40). The production thread is `19f94eb91e5548d9` (Helen 24 Jul `19f94eb91e5548d9`, Harrison sent 27 Jul `19fa3ea34e9c838c`, Helen 28 Jul `19faa4336ddb1714`). Gmail's own API rule: an API draft only joins a thread when threadId, In-Reply-To/References and subject all line up, so this one goes out as a new conversation carrying a Re: subject. Helen's Gmail may still group it by subject, not guaranteed. |
| Sarah Massie 11:49 | Verified. `1a0147dd56165ebf`, thread `1a0147dd56165ebf`, "Squiggly Careers recorded episode dates". |
| Harrison reply 14:11 | Verified SENT. `1a014ffde0d1ef1d`, asked which recorded episodes are already edited. |
| Sarah Massie 15:02 | Verified. `1a0152df9a3d47c4`, all episodes to 1 October already edited and ready. |

**The material difference (not overwritten, per instruction).** The file recommends route one and treats October as the fallback. The Gmail draft offers both starts as equal options.

File (canonical): "On timing, Sarah M's dates make this clean (thanks Sarah, super helpful). We keep the 14 September studio booking exactly as it is, I run the day as your producer, and everything from there is mine. Your recorded episodes carry you to 1 October and the new batch starts going out Tuesday 6 October, which gives me the lead I need. Jack keeps the room, so the handover stays clean. If you'd rather give him longer, we do a full start from the 12 October day instead, but I don't think we need it." Access line: "For the 14 September start, by 5 September I'd need: ..."

Gmail draft: "On timing, two clean starts. Same work, same number, you pick. / We can keep the 14 September studio booking exactly as it is. I run the day as your producer, everything from there is mine. Your recorded episodes carry you to 1 October and the new batch starts going out Tuesday 6 October. / Or we do a full start from the 12 October day, first episodes from mid-November. Same handover, just more notice for Jack. / Jack keeps the room either way, so both stay clean." Access line: "If we take 14 September, by 5 September I'd need: ... If we take October, same list, just later."

Provenance: the file has carried the recommended-route wording since its first commit (56ea5d7, 14:21 BST); the "two clean starts" wording appears in no repo file. The draft diverged at staging, not through a later file edit. Harrison picks one before tapping send. If he wants the file wording and proper threading, the clean fix is to reply to Helen's 28 July message and paste; or say the word and a threaded copy gets staged and the standalone one deleted.

## 2. LOR / Early Talent: Emma reply MISSING here, forward not in this mailbox

| Check | Result |
|---|---|
| (a) Emma Simpson reply sent | MISSING from this mailbox. `to:ESimpson@laingorourke.com newer_than:3d` empty. `emma simpson newer_than:20d` empty. `in:anywhere` (spam and trash included) for ESimpson / "Induction Photographer" / "induction brief" returns only the Feb NAW thread (`19c24c54151ae2de`). If Harrison replied from personal Gmail today, this connector cannot see it. |
| (b) Kerri's 5 Aug induction forward | NOT visible in this mailbox, including spam and trash. Nothing from laingorourke.com in 20 days except today's invite. Matches the prep file: it lives in the personal Gmail. |
| Emma draft created | No, by rule. Harrison forwards Kerri's 5 Aug email to harrison@hwlstudio.com first, then the section (f) reply gets drafted on that thread (to ESimpson, cc KWarner). "You'll have the quote this week" stays true, quote is at `campaigns/lor-everton-induction-quote-2026-08-18.md`. |
| (c) New mail from Kerri or Sarah Garside today | None beyond the 09:50 Teams invite "Kerri/Harrison catch up" (`1a0141066b80b368`, from KWarner, cc SGarside). No updated invite email for the move to Wed 19 Aug 15:00 to 15:30 sits in this mailbox. |
| (h) Follow-up email | Not drafted, call is tomorrow. |

## 3. Better at Work / Cathal: reprice follow-up MISSING, office-episode reply drafted

| Check | Result |
|---|---|
| Written reprice follow-up (VAT registration timeline, UK vs Australian entity invoiced, S5 brand and website priced separately, invoice address change) | MISSING. `to:cathal newer_than:3d in:sent` empty; widened to 6 days across both Cathal addresses and Annette, still empty. No draft exists either. Not drafted tonight, it needs Harrison's numbers. |
| From Cathal, last 6 days | 13 Aug 11:17 "FW: Flagging UK Audible Non-Availability" (`19ffaa0f0c0ecb66`); 14 Aug 17:07 "Accepted: CQ x HL" (`1a001071f93b492f`); 18 Aug 16:04 "FW: Your Office Doesn't Need More Amenities" (`1a01566e21b836e1`, to Annette and Harrison). |

**The forwarded piece** (Dan Moscrop, LinkedIn newsletter "THAT Workplace Experience", 18 Aug): (1) "What amenities do we add to get people back" is the wrong question; people experience how a place makes them feel, not a list of features. (2) The Dock Shed episode at Canada Water (British Land, Conran and Partners) blurs office, hospitality and social space; arrival, informal meetings and the bits between working are where the value lives. (3) The workplace has to earn the commute by giving people a better reason to be there (connection, energy, choice, a sense of arrival), not by adding more things.

**Cathal's ask:** "Would it be cool to do an episode from an office that really gets the office right for employees?"

**Draft created:** `r-6372124474491918177`, 21:51, threaded on `1a01566e21b836e1`, reply-all to cathal.quinlan79@outlook.com and Annette.Sloan@me.com, subject "Re: FW: Your Office Doesn't Need More Amenities", 108 words. Yes-and, one concrete shape (Cathal walking the building with whoever shaped it, full episode plus a short tour cut for socials, its own on-location shoot separate from the 2 September studio day), one next step (Dock Shed as first candidate, Dan Moscrop for a shortlist, ask them for two names). Money kept out. Internal note: an office episode is a separate line, half day at the £950 filming rate plus travel, to be priced when a venue is real.

## 4. Inbox triage, last 48 hours (in:inbox, promotions and social excluded, plus named senders)

| Sender | When | What it needs |
|---|---|---|
| Fazila, Litchfields (`1a01017d2baca711`) | Mon 17 Aug 15:19 | Reply owed. She checked and the first VAT return period is different from the HMRC "7 September" email (period is in an embedded screenshot, open the email to read it). She asks: is it from HMRC (yes, HMRC 14 Aug 10:27, `19fff99878151558`, "Your first VAT Return is due on 7 September 2026"), do you want Litchfields to prepare the VAT returns, and do you want Xero bookkeeping too (Raj quoted £250 to £350). Three answers plus forward the HMRC email. |
| Fazila, Litchfields (`1a010193a010c289`) | Mon 17 Aug 15:21 | FYI only. She called HMRC, annual payroll scheme noted, monthly-submission nags should stop. |
| Marchon (`1a00c3b33bfcac1f`) | Sun 16 Aug 21:20 | Payment failed, subscription will be cancelled unless card updated. Decide: update or let it lapse. |
| Manus (`19ffffe74a4e2d9a`, `1a0064e367b667f5`) | 14 Aug 12:18, 15 Aug 17:43 | Account will be deleted, back up data by 23 Aug 07:59 SGT (23 Aug 00:59 BST) if anything there is worth keeping. |
| Vercel (`1a01520055321c4e`) | Tue 18 Aug 14:46 | New sign-in from City of Westminster on harrison@hwlstudio.com. Confirm it was you or an agent deploy; if not, rotate. |
| Google Workspace admin (`1a010a38c2c9a71d`) | Mon 17 Aug 17:52 | Review Google Meet "Take notes for me" auto-enable setting before 21 Sept. Low. |
| Google and Garmin security alerts (`1a00fa8d44ecd176`, `1a00fab3e25304ac`) | Mon 17 Aug 13:18, 13:21 | New iPhone sign-in and new-location Garmin sign-in, same window. Almost certainly you. Glance and ignore. |
| Linear (`1a00e8d5616c3e29`) | Mon 17 Aug 08:08 | HWL-266 overdue: decide STAHK's v1 job (was due 16 Aug). Internal. |
| Cathal (`1a01566e21b836e1`) | Tue 18 Aug 16:04 | Office-episode idea. Draft staged, see section 3. |
| Sarah Massie (`1a0152df9a3d47c4`) | Tue 18 Aug 15:02 | Answered the edit question. No reply needed beyond the proposal. |

Not actionable, seen: Royal Mail parcel due Wed 19 Aug by 17:00; Manors Golf shipment; Buffer $43.20 payment received; Screen Studio $29 monthly receipt and confirmation code; Parallel welcome; BFI, Satisfy, Purple Parking, stndrd, ideabrowser, Readwise newsletters.

**Specific checks:** no Nikki / Netil House reply newer than 14 Aug. Last message on "Netil House Studio Application" (`19feb3f95c5d158a`) is Nikki's, Tue 11 Aug 12:33 (`19ff09a2da7e547d`), offering a viewing at 14:00 or 16:30 that day or Thu 13 Aug 13:00 to 15:00, wifi package attached. No email from Harrison on the thread after 11 Aug 12:19, so on email the ball is his unless the viewing was arranged by phone. No HMRC, Companies House, Danny Wicks or Starlink mail in the last 10 days beyond the HMRC VAT notice above. Fazila's VAT-date reply is the 17 Aug message in the table; the 7 Sept vs 7 Oct question is not settled in writing until Harrison reads her screenshot and answers.

## Drafts and IDs

- Created tonight: `r-6372124474491918177` (Cathal and Annette, threaded on `1a01566e21b836e1`).
- Pre-existing, untouched: `r-7386512596381199276` (Squiggly proposal, standalone thread `1a0151a1f3497bf5`).
- Not created, by rule: Emma Simpson reply (forward missing here), Kerri follow-up (call moved to Wed), Cathal reprice follow-up (needs Harrison's numbers).
