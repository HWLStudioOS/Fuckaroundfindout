"""Constrained command-line interface for the durable runtime ledger.

The CLI can initialise and inspect state, append events, and record action
proposals or approval decisions.  It intentionally has no execute command.
"""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import stat
import sys
from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict, List, Optional

from .action_types import UNAUTHENTICATED_APPROVAL_WARNING
from .database import SCHEMA_VERSION
from .errors import JarvisCoreError
from .store import RuntimeStore

MAX_JSON_INPUT_BYTES = 5 * 1024 * 1024
DEFAULT_DATABASE = os.path.expanduser(
    os.environ.get("JARVIS_CORE_DB", "~/.jarvis/runtime/core.sqlite3")
)


def _json_input(parser: argparse.ArgumentParser) -> None:
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--json", dest="json_text", help="JSON value supplied directly")
    group.add_argument("--json-file", help="UTF-8 JSON file, or - for standard input")


def _load_json(arguments: argparse.Namespace) -> Any:
    if arguments.json_text is not None:
        raw = arguments.json_text
    elif arguments.json_file == "-":
        raw = sys.stdin.read(MAX_JSON_INPUT_BYTES + 1)
    else:
        path = Path(arguments.json_file).expanduser()
        size = path.stat().st_size
        if size > MAX_JSON_INPUT_BYTES:
            raise ValueError("JSON input exceeds the 5 MiB safety limit")
        raw = path.read_text(encoding="utf-8")
    if len(raw.encode("utf-8")) > MAX_JSON_INPUT_BYTES:
        raise ValueError("JSON input exceeds the 5 MiB safety limit")
    return json.loads(raw)


def _print(value: Any) -> None:
    print(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True))


def _status(store: RuntimeStore) -> Dict[str, Any]:
    connection = store.connection
    counts = {}
    for table in (
        "events",
        "facts",
        "commitments",
        "tasks",
        "runs",
        "proposed_actions",
        "approvals",
        "work_queue",
    ):
        counts[table] = connection.execute("SELECT COUNT(*) FROM %s" % table).fetchone()[0]
    queue_states = {
        row["state"]: row["count"]
        for row in connection.execute(
            "SELECT state, COUNT(*) AS count FROM work_queue GROUP BY state"
        )
    }
    action_states = {
        row["status"]: row["count"]
        for row in connection.execute(
            "SELECT status, COUNT(*) AS count FROM proposed_actions GROUP BY status"
        )
    }
    return {
        "database": store._database.path,
        "schema_version": connection.execute("PRAGMA user_version").fetchone()[0],
        "expected_schema_version": SCHEMA_VERSION,
        "counts": counts,
        "queue_states": queue_states,
        "action_states": action_states,
    }


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python3 -m jarvis_core",
        epilog=UNAUTHENTICATED_APPROVAL_WARNING,
    )
    parser.add_argument("--db", default=DEFAULT_DATABASE, help="SQLite database path")
    commands = parser.add_subparsers(dest="command", required=True)

    commands.add_parser("init", help="initialise or migrate the runtime database")
    commands.add_parser("status", help="show schema and record counts")
    commands.add_parser("doctor", help="check database integrity and safety settings")

    event = commands.add_parser("event", help="event ledger operations")
    event_commands = event.add_subparsers(dest="event_command", required=True)
    event_add = event_commands.add_parser("add", help="append an immutable event")
    event_add.add_argument("--type", required=True, dest="event_type")
    event_add.add_argument("--source", required=True)
    event_add.add_argument("--idempotency-key")
    event_add.add_argument("--entity-type")
    event_add.add_argument("--entity-id")
    _json_input(event_add)

    action = commands.add_parser("action", help="propose and review actions")
    action_commands = action.add_subparsers(dest="action_command", required=True)
    propose = action_commands.add_parser("propose", help="persist, but do not execute, an action")
    propose.add_argument("--type", required=True, dest="action_type")
    propose.add_argument("--target")
    propose.add_argument(
        "--risk", choices=("low", "medium", "high", "critical"), default="low"
    )
    propose.add_argument("--external", action="store_true")
    propose.add_argument("--irreversible", action="store_true")
    propose.add_argument("--proposed-by", default="cli")
    propose.add_argument("--run-id")
    propose.add_argument("--idempotency-key")
    propose.add_argument("--expires-in-seconds", type=float)
    _json_input(propose)

    show = action_commands.add_parser("show", help="show a proposal and its decisions")
    show.add_argument("action_id")

    approve = action_commands.add_parser(
        "approve",
        help="record an unauthenticated assertion approving one exact action hash",
        description=UNAUTHENTICATED_APPROVAL_WARNING,
    )
    approve.add_argument("action_id")
    approve.add_argument("--hash", required=True, dest="action_hash")
    approve.add_argument("--actor", required=True)
    approve.add_argument("--ttl-seconds", type=float, default=1800)
    approve.add_argument("--reason")

    reject = action_commands.add_parser(
        "reject",
        help="record an unauthenticated assertion rejecting one exact action hash",
        description=UNAUTHENTICATED_APPROVAL_WARNING,
    )
    reject.add_argument("action_id")
    reject.add_argument("--hash", required=True, dest="action_hash")
    reject.add_argument("--actor", required=True)
    reject.add_argument("--reason")
    return parser


def _run(arguments: argparse.Namespace) -> int:
    with RuntimeStore(arguments.db) as store:
        if arguments.command in ("init", "status"):
            _print(_status(store))
            return 0
        if arguments.command == "doctor":
            quick_check = store.connection.execute("PRAGMA quick_check").fetchone()[0]
            journal_mode = store.connection.execute("PRAGMA journal_mode").fetchone()[0]
            foreign_keys = bool(store.connection.execute("PRAGMA foreign_keys").fetchone()[0])
            database_mode = None
            if store._database.path != ":memory:":
                database_mode = oct(stat.S_IMODE(os.stat(store._database.path).st_mode))
            result = _status(store)
            result.update(
                {
                    "ok": quick_check == "ok" and foreign_keys,
                    "quick_check": quick_check,
                    "journal_mode": journal_mode,
                    "foreign_keys": foreign_keys,
                    "database_mode": database_mode,
                }
            )
            _print(result)
            return 0 if result["ok"] else 1
        if arguments.command == "event" and arguments.event_command == "add":
            event = store.append_event(
                arguments.event_type,
                arguments.source,
                _load_json(arguments),
                entity_type=arguments.entity_type,
                entity_id=arguments.entity_id,
                idempotency_key=arguments.idempotency_key,
            )
            _print(asdict(event))
            return 0
        if arguments.command == "action" and arguments.action_command == "propose":
            proposed = store.propose_action(
                arguments.action_type,
                _load_json(arguments),
                target=arguments.target,
                risk=arguments.risk,
                is_external=arguments.external,
                reversible=not arguments.irreversible,
                proposed_by=arguments.proposed_by,
                run_id=arguments.run_id,
                idempotency_key=arguments.idempotency_key,
                expires_in_seconds=arguments.expires_in_seconds,
            )
            _print(asdict(proposed))
            return 0
        if arguments.command == "action" and arguments.action_command == "show":
            proposed = store.get_action(arguments.action_id)
            decision = store.evaluate_action(proposed.action_id, proposed.action_hash)
            _print(
                {
                    "action": asdict(proposed),
                    "approvals": [asdict(item) for item in store.list_approvals(proposed.action_id)],
                    "policy": asdict(decision),
                }
            )
            return 0
        if arguments.command == "action" and arguments.action_command == "approve":
            approval = store.approve_action(
                arguments.action_id,
                arguments.action_hash,
                arguments.actor,
                ttl_seconds=arguments.ttl_seconds,
                reason=arguments.reason,
            )
            _print(
                {
                    "approval": asdict(approval),
                    "warning": UNAUTHENTICATED_APPROVAL_WARNING,
                }
            )
            return 0
        if arguments.command == "action" and arguments.action_command == "reject":
            approval = store.reject_action(
                arguments.action_id,
                arguments.action_hash,
                arguments.actor,
                reason=arguments.reason,
            )
            _print(
                {
                    "approval": asdict(approval),
                    "warning": UNAUTHENTICATED_APPROVAL_WARNING,
                }
            )
            return 0
    raise RuntimeError("unhandled command")


def main(argv: Optional[List[str]] = None) -> int:
    """Run the constrained CLI and return a process exit code."""

    parser = _build_parser()
    arguments = parser.parse_args(argv)
    try:
        return _run(arguments)
    except (JarvisCoreError, OSError, sqlite3.Error, ValueError) as error:
        print(
            json.dumps(
                {"error": type(error).__name__, "message": str(error)},
                ensure_ascii=False,
                sort_keys=True,
            ),
            file=sys.stderr,
        )
        return 2


if __name__ == "__main__":
    sys.exit(main())
