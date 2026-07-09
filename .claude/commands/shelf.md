# Shelf

Add a built-but-not-shipped item to the Ship Shelf (`agents/_shelf.md`).

Named `/shelf`, not `/ship`, on purpose: on this system "shipped <item>" and
"kill <item>" are the authoritative phrases that MOVE an item OFF the shelf into
history. `/shelf` only ADDS.

The text after `/shelf` is the item. Do this:
1. Read `agents/_shelf.md`.
2. Enforce that file's own rules. The cap is 3 live items, and only genuinely
   built-AND-verified things belong here, never prototypes or work in progress. If
   adding would break the cap of 3, or the thing is not actually built and
   verified, do not add it. Say why and stop.
3. Otherwise append a row to the live table with: item = the name; first-seen =
   today's date (`date +%F`); deploy command = the one Harrison gave, or a clear
   TODO if none; done-signal = a CONTENT-based check (never "URL returns 200"). If
   Harrison did not supply a done-signal, ask for one before writing the row.
4. Confirm what you added in one line.

Never infer anything as shipped. Adding to the shelf is the only action here.
