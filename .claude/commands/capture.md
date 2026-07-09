# Capture

Drop a raw note straight into the single capture inbox (`capture/inbox.md`).

The text after `/capture` is the note. Do this:
1. Get the current London date and time: `TZ="Europe/London" date "+%Y-%m-%d %H:%M"`.
2. Insert a new entry as the NEWEST block, at the top of the dated entries (right
   after the intro paragraph, before the current first `##` section), in this exact
   shape:

## <date> <time> (Telegram /capture)
- <the note, verbatim>
- Source: telegram /capture (authoritative, Harrison's own words)
- Tag: capture
- Status: new

3. Confirm in one short line that it landed, quoting the first few words.

Do not act on the note's content, only file it. If it reads like a task or an idea
for later, it still just goes in the inbox as-is.
