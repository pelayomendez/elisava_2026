from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path
import os
import time

from dotenv import load_dotenv

from agent_runtime import BetterMeRuntime
from notifier import SlackNotifier


load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
AGENT_DIR = BASE_DIR.parent / "agent"
STATUS_PATH = BASE_DIR / "background_status.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run Better Me Agent as a local background coach."
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="Run one notification cycle and exit.",
    )
    parser.add_argument(
        "--interval-seconds",
        type=int,
        default=None,
        help="Loop interval in seconds for quick demos.",
    )
    parser.add_argument(
        "--interval-minutes",
        type=int,
        default=None,
        help="Loop interval in minutes for real use.",
    )
    parser.add_argument(
        "--message",
        type=str,
        default=None,
        help="Override the proactive prompt used for background runs.",
    )
    return parser.parse_args()


def resolve_interval(args: argparse.Namespace) -> int:
    if args.interval_seconds is not None:
        return max(args.interval_seconds, 5)

    if args.interval_minutes is not None:
        return max(args.interval_minutes * 60, 60)

    env_value = os.getenv("BETTER_ME_DEFAULT_INTERVAL_SECONDS")
    if env_value and env_value.isdigit():
        return max(int(env_value), 60)

    return 3600


def run_cycle(runtime: BetterMeRuntime, notifier: SlackNotifier, message: str | None) -> None:
    answer = runtime.run_background_cycle(message)
    notification_result = notifier.send(
        subject=runtime.slack_subject,
        message=answer,
    )

    runtime.write_background_status(
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "last_message": message or runtime.background_message,
            "last_answer": answer,
            "last_slack_sent": notification_result.sent,
            "last_slack_method": notification_result.method,
            "last_slack_detail": notification_result.detail,
            "last_mode": "background-loop",
        }
    )
    print(answer)


def main() -> None:
    args = parse_args()
    interval_seconds = resolve_interval(args)
    runtime = BetterMeRuntime(AGENT_DIR, status_path=STATUS_PATH)
    notifier = SlackNotifier()

    if args.once:
        run_cycle(runtime, notifier, args.message)
        return

    while True:
        run_cycle(runtime, notifier, args.message)
        time.sleep(interval_seconds)


if __name__ == "__main__":
    main()
