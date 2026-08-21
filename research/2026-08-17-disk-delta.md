# Disk delta, 17 August 2026

Read-only diagnostic, 09:30 BST. Nothing deleted, moved or modified. No `du`/`find` over Documents, Downloads, Desktop or Mobile Documents.

## Headline

The 68 GB was not consumed over four days. It went on the afternoon of 13 August and never came back. SYSTEM-STATUS line 68 already recorded free space falling from about 93 GB at 13:00 to about 30 GB by 15:20 on 13 August while `bird` reconciled at 98% CPU after Optimise Mac Storage was switched on at midday. Today: 32 GiB (34.4 GB) free, 936.9 GB used of 994.7 GB. It has sat at 30 to 34 GB since 13 August 15:20.

`bird` is finished and idle: 0.0% CPU, 28 MB RSS, `brctl status` reports client idle, caught-up, last sync 16 Aug 18:45. `fileproviderd` and `cloudd` idle. Reconciliation completed without evicting anything. macOS eviction under Optimise Mac Storage is lazy and skips recently-used files, and the 13 August walk that materialised the files also stamped them as recently used. iCloud never released the space and there is no sign it will on its own, even at 3.5% free.

Nothing outside iCloud grew by more than a few GB net since 13 August 12:00. Files over 100 MB modified since then: Adobe Premiere/Media Encoder in-place updates (16 Aug), Chrome and Comet updater clones in `/var/folders` (14 Aug, APFS clones sharing blocks), Wispr Flow db, `pm2.log`. Sum of everything measurable outside iCloud is roughly 280 GB. Data volume used is 937 GB. So roughly 650 GB sits under Documents, Downloads, Desktop, Mobile Documents and Photos (13 Aug note had Documents alone at 454 GB). That is where the materialised data lives.

## Purgeable, snapshots, swap

- `system_profiler` Free 34.34 GB vs `df` 34.4 GB. Purgeable is effectively zero. `diskutil info` shows no purgeable line on this build.
- `tmutil listlocalsnapshots /`: none.
- VM volume: 24.6 KB. Swap is not a factor.
- Second APFS container "iOS 26.5 Simulator" 18.1 GB is the simulator runtime dmg mounted from `/System/Library/AssetsV2` (14.6 GB on disk). Counted once below.

## Ranked non-iCloud consumers

| # | Path | Size | What |
|---|------|------|------|
| 1 | /Applications | 65.8 GB | Premiere Pro 2026 6.7 + Beta 6.9, Media Encoder 2026 5.2 + Beta 5.1, Resolve 8.5, Xcode 4.0, iMovie 3.7, Lightroom 3.5 |
| 2 | ~/Library/Developer | 35.0 GB | XCTestDevices 27.4 (8 stale test-simulator clones, 6 Jul to 12 Aug, 3.4 GB each) + CoreSimulator/Devices 7.3 |
| 3 | ~/Library/Application Support | 30.9 GB | Claude 7.8 (vm_bundles 5.9), Superhuman 4.8, Comet 3.5, Dia 2.4, Google 2.1, Figma 1.5 |
| 4 | /Library/Application Support | 20.1 GB | Adobe 17.3 (Premiere Pro 10.4, Beta 2.1, Media Encoder x2 2.9) |
| 5 | /private/var/folders | 17.7 GB | Chrome code_sign_clone 13.7 (10 APFS clones dated 14 Aug, blocks largely shared with Chrome.app, real cost under 1.5 GB), Comet clone 1.4, T 1.9 |
| 6 | /System/Library/AssetsV2 | 14.6 GB | iOS 26.5 simulator runtime |
| 7 | ~/.cache | 13.3 GB | uv 8.7, huggingface 2.9, codex-runtimes 1.6 |
| 8 | ~/HWL META | 11.7 GB | business 3.7, tmp 1.2, .git 1.1, board-room 0.6 |
| 9 | ~/pops-tribute | 8.8 GB | memorial film sources and renders |
| 10 | ~/Library/Caches | 8.1 GB | whisper-cpp 1.5, Dia 1.4, ms-playwright 1.1, updater leftovers ~1 |
| 11 | ~/Library/Group Containers | 8.1 GB | WhatsApp Message store 7.4 |
| 12 | ~/maya-vlog-kit | 7.0 GB | renders and pipeline outputs |
| 13 | ~/.pm2 | 5.4 GB | hwl-telegram-bridge-out.log 3.6 (2 Jul) + pm2.log 2.3; pm2 has no managed processes |
| 14 | /Library/Developer (real) | ~5 GB | CoreSimulator/Caches 3.0 + CommandLineTools 1.9 |
| 15 | ~/.npm | 4.6 GB | npm cache |
| 16 | /private/tmp | 4.5 GB | claude-501 scratchpad: 13 Aug git-rewrite rollback bundles 2.2 + 1.9 |
| 17 | rest | ~14 GB | ~/Library/Containers 2.8, /private/var/db 2.7, ~/.codex 2.5, /opt/homebrew 2.2, ~/repos 2.1, HWL META-baw-site 1.7 |

`~/.Trash`, Photos Library and the CloudDocs client.db were TCC-blocked from the shell, so unmeasured.

## Recommended reclaim list (for approval, not actioned)

Ranked by GB freed against risk.

| # | Action | Frees | Risk |
|---|--------|-------|------|
| A | Evict cold iCloud folders: pick large old project folders in Documents from Finder (Finder sizes come from the CloudDocs db, no walk), then `brctl evict <folder>` or Finder "Remove Download". Container is caught-up so nothing is unsynced. | The only lever that addresses the ~60 GB. Size depends on folders chosen. | Files go dataless, need network to reopen. Do not evict client masters needed offline. |
| B | `xcrun simctl --set ~/Library/Developer/XCTestDevices delete all` | 27.4 GB | None. Recreated on next `xcodebuild test`. |
| C | `xcrun simctl delete unavailable`, delete unused CoreSimulator devices (keep the Baseline one), clear `/Library/Developer/CoreSimulator/Caches` | up to 10 GB | Low. Simulators re-create. |
| D | `pm2 flush` or truncate `~/.pm2/*.log` and `~/.pm2/logs/*` | 5.4 GB | None. Logs only, no pm2 processes running. |
| E | `uv cache clean`, `npm cache clean --force`, drop `~/.cache/huggingface` if whisper models are elsewhere | up to 16 GB | Re-download on next use. |
| F | Copy the two 13 Aug rollback bundles in `/private/tmp/claude-501/.../e7c2a157.../scratchpad` to UGREEN, then delete | 4.3 GB | Loses local rollback for the history rewrite. Copy first. Rewrite is verified and pushed. |
| G | Claude desktop `vm_bundles` | 5.9 GB | Low. Cowork VM images re-download. |
| H | Adobe Betas: Premiere Pro (Beta) + Media Encoder (Beta) + their /Library support dirs | ~15.5 GB | Medium. Only if the Betas are unused. |
| I | WhatsApp media via WhatsApp Settings, Storage | up to 7.4 GB | Medium. Media re-downloads from phone. |
| J | Archive `~/pops-tribute` and `~/maya-vlog-kit` to UGREEN with manifest, verify sha256, then delete | 15.8 GB | Family film sources. Copy and verify before deleting. |
| K | Quit Chrome fully or reboot to clear the code_sign_clone dirs | 0 to 1.5 GB real | None. |

No-risk tier (B, C, D, E, F with copy) is roughly 63 GB. A is the fix for the actual delta.
