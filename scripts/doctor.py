#!/usr/bin/env python3
"""Read-only readiness checks for the Jarvis repository and local operator."""

from __future__ import annotations

import argparse
import json
import os
import plistlib
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable, List, Optional, Sequence, Tuple


PASS = "PASS"
WARN = "WARN"
FAIL = "FAIL"


@dataclass(frozen=True)
class Check:
    name: str
    status: str
    detail: str


def repository_root(start: Optional[Path] = None) -> Path:
    """Find the nearest parent containing this repository's pyproject file."""
    current = (start or Path(__file__).resolve()).resolve()
    if current.is_file():
        current = current.parent
    for candidate in (current, *current.parents):
        if (candidate / "pyproject.toml").is_file():
            return candidate
    raise FileNotFoundError("could not find pyproject.toml in this path or its parents")


def git_files(
    root: Path, patterns: Sequence[str], include_untracked: bool = False
) -> List[Path]:
    """Return existing, non-ignored Git files matching pathspecs, without fetching."""
    command = ["git", "-C", str(root), "ls-files", "-z", "--cached"]
    if include_untracked:
        command.extend(("--others", "--exclude-standard"))
    command.extend(("--", *patterns))
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        return []
    files = []
    for raw_path in result.stdout.split(b"\0"):
        if not raw_path:
            continue
        path = root / os.fsdecode(raw_path)
        if path.is_file():
            files.append(path)
    return sorted(files)


def invalid_python_files(paths: Iterable[Path]) -> List[Tuple[Path, str]]:
    failures = []
    for path in paths:
        try:
            compile(path.read_bytes(), str(path), "exec")
        except (OSError, SyntaxError, UnicodeError) as exc:
            failures.append((path, str(exc)))
    return failures


def invalid_structured_files(
    paths: Iterable[Path], loader: Callable[[bytes], object]
) -> List[Tuple[Path, str]]:
    failures = []
    for path in paths:
        try:
            loader(path.read_bytes())
        except (OSError, ValueError, TypeError, plistlib.InvalidFileException) as exc:
            failures.append((path, str(exc)))
    return failures


def _format_failures(root: Path, failures: Sequence[Tuple[Path, str]]) -> str:
    names = []
    for path, _error in failures[:3]:
        try:
            names.append(str(path.relative_to(root)))
        except ValueError:
            names.append(str(path))
    suffix = "" if len(failures) <= 3 else " and {} more".format(len(failures) - 3)
    return "{} invalid: {}{}".format(len(failures), ", ".join(names), suffix)


def check_python() -> Check:
    version = sys.version_info
    if version < (3, 9):
        return Check(
            "Python",
            FAIL,
            "{}.{}.{} installed; 3.9 or newer is required".format(*version[:3]),
        )
    return Check(
        "Python",
        PASS,
        "{}.{}.{} (minimum supported: 3.9)".format(*version[:3]),
    )


def check_layout(root: Path) -> Check:
    required = (
        "pyproject.toml",
        "JARVIS-FOUNDATION.md",
        "agents",
        "jarvis_core",
        "linear",
        "scripts",
        "tests",
    )
    missing = [entry for entry in required if not (root / entry).exists()]
    if missing:
        return Check("Repository layout", FAIL, "missing: {}".format(", ".join(missing)))
    return Check("Repository layout", PASS, "{} required entries present".format(len(required)))


def check_commands() -> List[Check]:
    checks = []
    required = ("git", "bash", "node")
    optional = ("claude", "jq", "plutil", "launchctl")
    for command in required:
        path = shutil.which(command)
        checks.append(
            Check(
                "Command: {}".format(command),
                PASS if path else FAIL,
                path or "not found on PATH",
            )
        )
    for command in optional:
        path = shutil.which(command)
        checks.append(
            Check(
                "Optional command: {}".format(command),
                PASS if path else WARN,
                path or "not found; the related local integration will be unavailable",
            )
        )
    return checks


def check_claude_auth(command: Optional[str] = None) -> Check:
    """Read Claude's local auth status without starting an agent or login flow."""
    executable = command or shutil.which("claude")
    if not executable:
        return Check(
            "Claude authentication",
            WARN,
            "Claude CLI is not installed; scheduled Claude agents are unavailable",
        )

    try:
        result = subprocess.run(
            [executable, "auth", "status", "--json"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return Check(
            "Claude authentication",
            WARN,
            "non-interactive auth preflight failed: {}".format(type(exc).__name__),
        )

    try:
        payload = json.loads(result.stdout)
    except (TypeError, ValueError):
        return Check(
            "Claude authentication",
            WARN,
            "auth status returned unreadable data; scheduled agents will fail closed",
        )

    if not isinstance(payload, dict) or not isinstance(payload.get("loggedIn"), bool):
        return Check(
            "Claude authentication",
            WARN,
            "auth status omitted loggedIn; scheduled agents will fail closed",
        )

    if payload["loggedIn"]:
        if result.returncode == 0:
            method = payload.get("authMethod") or "unknown method"
            return Check(
                "Claude authentication",
                PASS,
                "logged in via {}".format(method),
            )
        return Check(
            "Claude authentication",
            WARN,
            "auth status claimed a login but exited non-zero; scheduled agents will fail closed",
        )

    return Check(
        "Claude authentication",
        WARN,
        "not logged in; scheduled agents exit 78 until Harrison runs "
        "'claude auth login' interactively",
    )


def check_sources(root: Path) -> List[Check]:
    python_paths = git_files(root, ("*.py",), include_untracked=True)
    json_paths = git_files(root, ("*.json",), include_untracked=True)
    plist_paths = git_files(root, ("*.plist",), include_untracked=True)
    checks = []

    python_failures = invalid_python_files(python_paths)
    checks.append(
        Check(
            "Python sources",
            FAIL if python_failures else PASS,
            _format_failures(root, python_failures)
            if python_failures
            else "{} tracked or untracked files compile".format(len(python_paths)),
        )
    )

    json_failures = invalid_structured_files(json_paths, json.loads)
    checks.append(
        Check(
            "JSON documents",
            FAIL if json_failures else PASS,
            _format_failures(root, json_failures)
            if json_failures
            else "{} tracked or untracked files parse".format(len(json_paths)),
        )
    )

    plist_failures = invalid_structured_files(plist_paths, plistlib.loads)
    checks.append(
        Check(
            "Property lists",
            FAIL if plist_failures else PASS,
            _format_failures(root, plist_failures)
            if plist_failures
            else "{} tracked or untracked files parse".format(len(plist_paths)),
        )
    )
    return checks


def check_git(root: Path) -> List[Check]:
    checks = []
    lock_result = subprocess.run(
        ["git", "-C", str(root), "rev-parse", "--git-path", "index.lock"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if lock_result.returncode != 0 or not lock_result.stdout.strip():
        checks.append(Check("Git index", FAIL, "could not resolve the Git index lock path"))
    else:
        lock_path = Path(lock_result.stdout.strip())
        if not lock_path.is_absolute():
            lock_path = root / lock_path
        checks.append(
            Check(
                "Git index",
                WARN if lock_path.exists() else PASS,
                "index.lock exists; confirm no Git process is active before removing it"
                if lock_path.exists()
                else "no index lock present",
            )
        )

    status = subprocess.run(
        ["git", "-C", str(root), "status", "--porcelain"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if status.returncode != 0:
        checks.append(Check("Git worktree", FAIL, "git status could not be read"))
    else:
        changed = len([line for line in status.stdout.splitlines() if line])
        checks.append(
            Check(
                "Git worktree",
                WARN if changed else PASS,
                "{} changed path(s); doctor does not modify them".format(changed)
                if changed
                else "clean",
            )
        )

    remote = subprocess.run(
        ["git", "-C", str(root), "remote", "get-url", "origin"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    checks.append(
        Check(
            "Git origin",
            PASS if remote.returncode == 0 else WARN,
            "configured (URL intentionally hidden)"
            if remote.returncode == 0
            else "not configured; off-machine backup is unavailable",
        )
    )
    return checks


def check_runtime_tracking(root: Path) -> Check:
    patterns = (
        "runtime/**/*.db",
        "runtime/**/*.db-wal",
        "runtime/**/*.db-shm",
        "runtime/**/*.db-journal",
        "runtime/**/*.sqlite",
        "runtime/**/*.sqlite-wal",
        "runtime/**/*.sqlite-shm",
        "runtime/**/*.sqlite-journal",
        "runtime/**/*.sqlite3",
        "runtime/**/*.sqlite3-wal",
        "runtime/**/*.sqlite3-shm",
        "runtime/**/*.sqlite3-journal",
    )
    tracked = git_files(root, patterns)
    if tracked:
        return Check(
            "Runtime database tracking",
            FAIL,
            "{} mutable database file(s) are tracked by Git".format(len(tracked)),
        )
    return Check("Runtime database tracking", PASS, "no mutable runtime databases are tracked")


def run_checks(root: Path) -> List[Check]:
    checks = [check_python(), check_layout(root)]
    checks.extend(check_commands())
    checks.append(check_claude_auth())
    checks.extend(check_sources(root))
    checks.extend(check_git(root))
    checks.append(check_runtime_tracking(root))
    return checks


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        help="repository root (defaults to the nearest pyproject.toml)",
    )
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = parse_args(argv)
    try:
        root = repository_root(args.root)
    except FileNotFoundError as exc:
        print("FAIL  Repository: {}".format(exc))
        return 1

    print("Jarvis doctor")
    print("Root: {}".format(root))
    print()
    checks = run_checks(root)
    for check in checks:
        print("{:<4}  {:<28} {}".format(check.status, check.name, check.detail))

    totals = {PASS: 0, WARN: 0, FAIL: 0}
    for check in checks:
        totals[check.status] += 1
    print()
    print(
        "Summary: {PASS} passed, {WARN} warning(s), {FAIL} failed".format(**totals)
    )
    return 1 if totals[FAIL] else 0


if __name__ == "__main__":
    raise SystemExit(main())
