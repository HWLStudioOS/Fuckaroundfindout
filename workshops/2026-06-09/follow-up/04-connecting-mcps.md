# Connecting MCPs

This is week-two material. If your engine isn't running yet, go back to docs 02 and 03. You do not need any of this to start.

## What an MCP actually is

MCP stands for Model Context Protocol. Ignore the name. It is a plug that connects your AI to a tool you already use. Once connected, the AI can do things in that tool for you.

Concrete examples from my own setup:

- Granola MCP. Claude reads my meeting transcripts and pulls content ideas out of them.
- Buffer MCP. Claude schedules my posts straight into Buffer. I never copy-paste a caption again.
- Notion, Gmail, Calendar, Canva, Slack all have them too.

The pattern: the four files give the AI your context. MCPs give it hands.

## The easy way (no terminal)

If you're on Path A, claude.ai has a connectors directory built in.

1. Go to claude.ai, click your initials bottom-left, then Settings, then Connectors.
2. Browse the directory. Notion, Canva, Gmail, Calendar and others are one click.
3. Click Connect, sign in to that tool in the browser window, approve.
4. Back in a chat, Claude can now use it. Try "look at my calendar for this week".

ChatGPT has its own version of the same thing in its settings (look for connectors or apps). Same idea.

## The terminal way (Claude Code)

One command per connection, then sign in once.

Example, connecting Notion:

```
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

Then start `claude`, type `/mcp`, and follow the sign-in. Done. Type `/mcp` any time to see what's connected.

Bonus: connectors you set up on claude.ai also come through to Claude Code when you're signed in with the same account, so the easy way above often covers both.

Codex has the same idea with `codex mcp add` if you went that route.

## Where to find more

Most tools that have an MCP put the connection link on their own site (search "[tool name] MCP"). The claude.ai connectors directory is the safest starting point because everything in it is vetted.

A caution, and I mean it: only connect tools you trust, and think before connecting anything with money or sensitive client data in it. The AI can act in whatever you plug in. Start with read-only things like your notes and your calendar, get comfortable, then expand.

## The restraint rule

One MCP at a time. Connect it, use it for a week, then decide if you need the next one. Five connected tools you don't use is the same disease as forty files you don't read.
