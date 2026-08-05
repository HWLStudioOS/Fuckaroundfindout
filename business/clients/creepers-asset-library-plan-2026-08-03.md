# Creepers asset library and share-folder plan

**Status:** Internal plan. Nothing uploaded, shared, copied or deleted.

**Request source:** Anna Blake, 3 August 2026. Anna asked for access to all Creepers pictures and videos so Michael and Sam can choose a replacement photograph for the Design Journal advert.

## Decision

Do not send a raw-drive dump. Build a client browse library containing every usable, client-owned or client-approved photograph and video as a lightweight preview. Keep camera originals and edit projects in the source archive. If Creepers later asks for raw originals, transfer that as a separate, explicit delivery.

The current likely raw estate is more than 670 GB. A blind share would be slow, difficult to search and likely to expose technical files, duplicates, rejected edits, licensed music and material that may be restricted by a private-property agreement.

## Read-only inventory, 3 August

### Curated production pack

`/Users/harrison/Downloads/Client Editing Packs/Creepers`

- 163 MB across 66 files.
- Brand guidelines, logos, Playfair Display font files, three Premiere projects, motion templates, LUTs, production briefs, approved audio and prior Garden Design Journal concepts.
- This is an editor pack, not a client-facing media library.

### Candidate Creepers source folders on Livs4TB2

| Folder | Size | Files | Main formats | Treatment |
|---|---:|---:|---|---|
| `Creepers_Jan2025` | 182 GB | 217 | 170 MOV, 19 MP4, 20 JPG, 8 PNG | Build proxies and still contact sheets |
| `Creepers April` | 159 GB | 229 | 191 NEF, 19 NEV, 19 MP4 | Export photo selects and video proxies |
| `Chelsea` | 299 GB | 95 | 95 NEV | Keep raw private, expose selected proxies only |
| `C New Forest` | 26 GB | 85 | 74 MOV, 11 NEF | Confirm it is wholly Creepers before inclusion |
| `NF Drone` | 6.1 GB | 14 | 14 MP4 | Confirm flight and client usage rights |

Root-level candidate exports also include `Creepers Stock Update 1.mp4`, `Creepersbatch_Hero_1.mp4`, `Chelsea Day 1.mp4`, `to grow a chelsea garden.mp4` and several Creepers Update exports. These need deduplication against the project folders.

## Client browse structure

```text
CREEPERS_MEDIA_LIBRARY/
  00_START_HERE/
    README.pdf
    asset-manifest.csv
    usage-and-rights.md
  01_BRAND_ASSETS/
    logos/
    approved-colours-and-type/
    advert-reference/
  02_NURSERY/
    Jan-2026-New-Forest/
    Apr-2026-Surrey/
    stock-and-availability/
    people-and-craft/
  03_INSTALLATION/
    approved-projects/
    detail-and-process/
    before-and-after/
  04_CHELSEA_2026/
    nursery-grow/
    build-week/
    finished-gardens-approved/
  05_SANDRINGHAM_2026/
    approved-stills/
    edited-films/
  06_DRONE/
    new-forest/
    approved-sites/
  07_EDITED_AND_PUBLISHED/
    nursery/
    installation/
    campaigns/
  08_ADVERT_IMAGE_SHORTLIST/
    portrait-candidates/
    landscape-candidates/
    contact-sheet.pdf
  99_RAW_ORIGINALS_REQUEST_LIST/
    manifest-only-no-raw-files/
```

## Manifest fields

Every client-visible item gets:

- Stable asset ID.
- Preview filename.
- Original filename and source path.
- Capture date.
- Shoot, location and subject.
- Photo or video.
- Orientation and duration.
- Status: approved, needs review, restricted or archive.
- Rights note, including property, person and drone constraints.
- Published link if already used.
- Raw-original availability.

## Inclusion rules

- Include every technically usable client-owned or client-approved asset as a preview, including unedited material that is safe for Michael and Sam to browse.
- Include published exports and strong unused selects.
- Keep filenames human-readable while preserving the original filename in the manifest.
- Generate JPEG previews for NEF photographs and H.264 review proxies for NEV or high-bitrate camera video.
- Put the best 20 to 40 portrait candidates for the Design Journal advert in one shortlist rather than asking the client to search hundreds of gigabytes first.

## Advert image priority, added 5 August

Anna's 4 August steer: concentrate on **rootball pictures**, that is the route they want for the Design Journal advert. So:

- `08_ADVERT_IMAGE_SHORTLIST/` gains a leading `rootball-candidates/` folder and the shortlist build starts there: wrapped root balls, nursery stock, lifting and handling craft, root-and-soil detail.
- Likeliest sources: `Creepers April` (Surrey nursery, 191 NEF stills), `Creepers_Jan2025`, and any stock-and-availability exports. Chelsea and installation folders are secondary for this brief.
- Every rootball candidate must trace to an original that holds roughly 2,900 x 3,500 px or better, so it prints at 300ppi at the 240 x 297mm trim. Figma-resolution copies are preview-only, as advertgate proved.
- Portrait orientation first, per the full-page format.

- No LOR, Better at Work or personal media.
- No licensed music, LUTs, fonts, Premiere projects, cache files or hidden system files.
- No rejected edits or accidental duplicates unless they contain a genuinely different shot.
- No private-home footage or identifiable address detail until the installation permission or NDA position is confirmed.
- No drone footage until commercial flight and client usage rights are clear.
- No raw camera originals in the browse library.
- No external share link until Harrison scans the rights manifest and folder contents.

## Build sequence

1. Confirm the five candidate source folders belong wholly or partly to Creepers.
2. Create an immutable source manifest. Do not move or rename originals.
3. Deduplicate exact exports and obvious duplicate renders.
4. Generate photo contact sheets and lightweight video proxies.
5. Tag each asset by shoot, subject, channel and rights state.
6. Build the advert shortlist first so Anna's immediate request can move.
7. Run an internal privacy and rights scan.
8. Prepare a share link and draft handoff note. Harrison approves the external share as one tap.

## Definition of done

- Michael and Sam can browse by shoot and subject without specialist software.
- The advert shortlist is visible in under two clicks.
- Every preview traces back to an untouched original.
- Restricted material is absent or clearly quarantined.
- No cross-client or licensed production assets are exposed.
