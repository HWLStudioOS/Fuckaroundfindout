# Start Here. The 10-Minute Setup

This is everything I promised from the workshop. Five short docs, no course. Read this one first.

The one idea to hold onto: AI is not the system. The context is. Everything below exists to give the AI your context, once, properly. After that, one idea becomes a fortnight of content.

There are two ways in. Pick the one that matches you today.

## Path A. No terminal. Works in the apps you already use.

If the terminal demo felt like a lot, skip it. You can run the whole system inside normal Claude or ChatGPT.

1. Open Claude (claude.ai) or ChatGPT. A paid plan helps but the free tier works to start.
2. Create a Project (both apps have them, top of the sidebar).
3. Paste the Interview Prompt (doc 02) into a new chat in that project.
4. Answer the questions honestly. Takes 20 to 30 minutes. This is the real work.
5. It will produce four files. Add each one to the project's knowledge/files.
6. From then on, every content chat in that project knows your business, your voice, and your rules.

That is a working content engine. No terminal, no install. Most of you should start here.

## Path B. The terminal version I demoed.

Same engine, more power. The terminal app reads and writes real files on your computer, so your system lives in a folder you own, not inside a chat app.

You only need to install one of these. I use Claude Code.

### Claude Code (Anthropic)

Mac: open the Terminal app (press Cmd+Space, type Terminal, hit enter). Paste this and press enter:

```
curl -fsSL https://claude.ai/install.sh | bash
```

Windows: open PowerShell (Start menu, type PowerShell). Paste this and press enter:

```
irm https://claude.ai/install.ps1 | iex
```

Then:

1. Make an empty folder somewhere sensible, e.g. `my-content-engine`.
2. In the terminal, type `cd ` (with a space), drag the folder onto the terminal window, press enter.
3. Type `claude` and press enter.
4. First run asks you to sign in. Use your Claude account in the browser window it opens. You need a paid Claude plan (Pro or above).
5. You're in. It's a chat, in your terminal, that can read and write files in that folder.

### Codex (OpenAI's version)

Mac terminal:

```
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Windows PowerShell:

```
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

Then `cd` into your folder, type `codex`, sign in with your ChatGPT account. Any paid ChatGPT plan covers it. Plus is the realistic floor for real use.

## What to do next

1. Doc 02. Run the Interview Prompt. This builds your four files.
2. Doc 03. Understand the folder those files live in.
3. Doc 05. Run your first cascade with the same prompt I used live.
4. Doc 04 (MCPs) is week-two material. Skip it until the engine is running.

If you get stuck at any step, post in here and tag me. The install is the only fiddly bit. Everything after it is just talking.
