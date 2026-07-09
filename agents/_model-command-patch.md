# Telegram agent: /model command + skill passthrough

Patch for `agents/telegram-agent.py`. Two parts. Part A is `/model`. Part B is the
skill passthrough. Both are already applied to a syntax-checked copy at
`agents/_telegram-agent.patched.py` (compiles clean, `python3 -m py_compile`).

FASTEST APPLY (on the mini):

    cd "/Users/harrison/HWL META"
    diff agents/telegram-agent.py agents/_telegram-agent.patched.py   # eyeball the 8 changes
    cp agents/telegram-agent.py agents/_telegram-agent.bak.py         # keep a rollback
    cp agents/_telegram-agent.patched.py agents/telegram-agent.py
    launchctl kickstart -k gui/$(id -u)/com.hwl.telegram-agent        # restart under launchd

Rollback if anything misbehaves: `cp agents/_telegram-agent.bak.py agents/telegram-agent.py`
then kickstart again.

The section below is the same changes as a hand-applied patch, kept for review.

Why this can't be a skill: the model is a launch flag (`--model` on the claude
subprocess, line ~216). A skill runs *inside* that subprocess, so it cannot change
the flag of the process it is already running in. The switch has to happen in the
Python daemon that spawns the child. The daemon's `/model` handler runs in the
trusted parent process, not the sandboxed child, so this does not weaken the
restricted-mode boundary: the child still cannot change its own model.

Why the remote agent can't self-apply: the deny-profile in
`telegram-agent-settings.json` blocks `Edit(./agents/telegram-agent.py)` and
`Write(./.config/**)` by design (self-edit anchor). So this is staged, not applied.

---

## Part A — /model

### A1. After the `MODEL = "claude-opus-4-8"` line (~48), replace it with:

```python
DEFAULT_MODEL = "claude-opus-4-8"
MODEL_FILE = META / ".config/telegram-agent.model"
MODEL_ALIASES = {
    "opus": "claude-opus-4-8",
    "sonnet": "claude-sonnet-5",
    "haiku": "claude-haiku-4-5-20251001",
    "fable": "claude-fable-5",
}


def current_model():
    try:
        m = MODEL_FILE.read_text().strip()
        if m:
            return m
    except Exception:
        pass
    return DEFAULT_MODEL
```

### A2. In `run_claude`, the args line (~216). Change:

```python
    args = ["claude", "--print", "--model", MODEL, "--permission-mode", ...
```

to:

```python
    model = current_model()
    args = ["claude", "--print", "--model", model, "--permission-mode", ...
```

### A3. In `handle_command`, add this branch (before the final `else`):

```python
    elif cmd == "/model":
        parts = text.split()
        if len(parts) < 2:
            send(chat_id, f"Model: {current_model()}\nSwitch: /model "
                          f"{' / '.join(sorted(MODEL_ALIASES))}\n"
                          "Takes effect on your next message, not the running task.")
        else:
            choice = parts[1].lower()
            target = MODEL_ALIASES.get(choice)
            if not target and choice.startswith("claude-"):
                target = choice
            if not target:
                send(chat_id, f"Unknown model {parts[1]}. "
                              f"Options: {', '.join(sorted(MODEL_ALIASES))}")
            else:
                try:
                    atomic_write(MODEL_FILE, target)
                    send(chat_id, f"Model set to {target}. Next message uses it.")
                except Exception as e:
                    send(chat_id, f"Could not save that: {e}")
```

### A4. In `/status`, change the first line (~403) from `MODEL` to `current_model()`:

```python
        lines = [f"Model: {current_model()} ({CFG['mode']} mode)"]
```

### A5. Startup log line (~451), change `model {MODEL}` to `model {current_model()}`.

### A6. Fix the stale /help text (~418): it still says "Fable 5". Replace the help
string with:

```python
        send(chat_id, "Remote agent on the mini, working in HWL META.\n\n"
                      "Just tell me what to do. Follow-ups continue the same conversation.\n\n"
                      "/new fresh session\n/status what's happening\n"
                      "/model switch model\n/cancel kill the current task")
```

---

## Part B — skill passthrough (optional, recommended)

Right now the poll loop sends *every* message starting with `/` to
`handle_command`, so `/reprice`, `/todo-add`, `/done` etc. all hit "Unknown
command". This change forwards any non-control slash command to Claude as a skill
invocation, unlocking all 20+ existing skills over Telegram. After this, every
future command is just a markdown skill file, no daemon edit needed.

### B1. Near the top, define the control set:

```python
CONTROL_CMDS = {"/new", "/cancel", "/status", "/model", "/start", "/help"}
```

### B2. In `main`, the dispatch block (~499). Change:

```python
                if text.startswith("/"):
                    handle_command(msg["chat"]["id"], text)
                else:
                    reset_epoch = load_state().get("reset_at", 0)
                    ...
```

to:

```python
                cmd0 = text.split()[0].lower().split("@")[0] if text.startswith("/") else ""
                if cmd0 in CONTROL_CMDS:
                    handle_command(msg["chat"]["id"], text)
                else:
                    if cmd0:  # unknown slash command -> run as a skill
                        name = cmd0.lstrip("/")
                        text = (f"Harrison sent this as a slash command from his phone. "
                                f"Invoke the skill named '{name}' (or the closest clear "
                                f"match), treating any text after the command as its "
                                f"arguments. If nothing reasonably matches, say so and "
                                f"stop.\n\n{text}")
                    reset_epoch = load_state().get("reset_at", 0)
                    ...
```

(Leave the rest of the `else` block unchanged.)

---

## Commands that go live on the same restart

These are project-level command files in `.claude/commands/` (inside HWL META, so
the remote agent can build them without touching the daemon). Part B's passthrough
is what makes them reachable from Telegram. No further daemon edits needed to add
more later.

- `/brief` — alias to the morning-brief skill
- `/cash [focus]` — read-only money snapshot from money/index.md + money/weekly.md, with as-of dates
- `/shelf <item>` — add a built-but-not-shipped item to agents/_shelf.md (enforces cap-3, content-based done-signal)
- `/capture <note>` — append a raw note to capture/inbox.md as the newest entry

Already existing as user skills, reachable via passthrough with no new file:
/reprice /todo-add /done /checkin /goals-review /break-it /proposal-write /proposal-revise
