from __future__ import annotations

from dataclasses import dataclass
import json
import os
import ssl
from urllib import request
from urllib.error import HTTPError, URLError

import certifi


@dataclass
class NotificationResult:
    sent: bool
    method: str
    detail: str


class SlackNotifier:
    def __init__(self) -> None:
        self.webhook_url = os.getenv("SLACK_WEBHOOK_URL", "")

    def send(self, subject: str, message: str) -> NotificationResult:
        if not self.webhook_url:
            detail = "Missing Slack configuration: SLACK_WEBHOOK_URL"
            print(f"[slack skipped] {detail}")
            return NotificationResult(sent=False, method="slack", detail=detail)

        text = f"*{subject}*\n{message}"
        payload = {"text": text}

        body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            self.webhook_url,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            ssl_context = ssl.create_default_context(cafile=certifi.where())

            with request.urlopen(req, timeout=30, context=ssl_context) as response:
                status_code = getattr(response, "status", 200)
                if 200 <= status_code < 300:
                    return NotificationResult(
                        sent=True,
                        method="slack",
                        detail="Slack message sent successfully.",
                    )
                return NotificationResult(
                    sent=False,
                    method="slack",
                    detail=f"Slack returned status {status_code}.",
                )
        except HTTPError as exc:
            detail = f"HTTPError {exc.code}: {exc.reason}"
            print(f"[slack failed] {detail}")
            return NotificationResult(sent=False, method="slack", detail=detail)
        except URLError as exc:
            detail = f"URLError: {exc.reason}"
            print(f"[slack failed] {detail}")
            return NotificationResult(sent=False, method="slack", detail=detail)
        except Exception as exc:
            detail = f"{type(exc).__name__}: {exc}"
            print(f"[slack failed] {detail}")
            return NotificationResult(sent=False, method="slack", detail=detail)
