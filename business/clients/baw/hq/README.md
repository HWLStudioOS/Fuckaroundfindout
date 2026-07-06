# B@W HQ — deploy

Single static file, no build step.

## Deploy to Vercel (one command)

```bash
cd "/Users/harrison/HWL META/business/clients/baw/hq"
npx vercel --prod
```

First run: it opens a browser to log you in, then asks a few questions. Accept defaults (scope: your account, no link to existing project, project name `baw-hq`, directory `./`). Done, you get the URL.

Alternative, zero terminal: go to vercel.com/new, drag this `hq` folder onto the page.

## Notes

- Ticks, custom tasks and the scratchpad save to localStorage, per browser. Use the same browser all summer (or tick on your phone and laptop separately).
- To update content, edit `index.html` (the `WEEKS` array at the top of the script is the roadmap data) and run `npx vercel --prod` again. Or ask Claude to update it and redeploy.
- If you want it password-protected later, Vercel's free tier doesn't do auth on static sites; simplest option is an unguessable project name, or move it behind Vercel's paid protection.
