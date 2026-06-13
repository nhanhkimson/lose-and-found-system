#!/usr/bin/env python3
"""Print Google Form page/question structure to verify main.py config."""

from __future__ import annotations

import os
import sys
from pathlib import Path

_LOCAL_BROWSERS = Path(__file__).resolve().parent / ".pw-browsers"
if _LOCAL_BROWSERS.exists():
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(_LOCAL_BROWSERS)

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

FORM_URL = (
    "https://docs.google.com/forms/d/e/1FAIpQLSdUNzeq_a1WyzGIk1rZ3T352yGHpd5ZQ3jbm-LdWPrgUwk-4Q/viewform"
)
NEXT_LABELS = ("Next", "បន្ទាប់", "ទៅមុខ")


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(FORM_URL, wait_until="domcontentloaded", timeout=60_000)
        page.wait_for_timeout(3_000)

        page_num = 1
        if not page.locator('div[role="radiogroup"]').locator("visible=true").count():
            for label in NEXT_LABELS:
                btn = page.locator(f'[role="button"]:has-text("{label}")')
                if btn.count() > 0:
                    btn.first.click(timeout=3_000)
                    page.wait_for_timeout(2_000)
                    break

        while page_num <= 10:
            all_radio = page.locator('div[role="listitem"]').filter(
                has=page.locator('div[role="radiogroup"]')
            )
            all_cb = page.locator('div[role="listitem"]').filter(
                has=page.locator('div[role="checkbox"]')
            )
            visible_rg = [i for i in range(all_radio.count()) if all_radio.nth(i).is_visible()]
            visible_cb = [i for i in range(all_cb.count()) if all_cb.nth(i).is_visible()]

            print(f"\n=== PAGE {page_num} ===")
            print(f"Visible radio questions: {len(visible_rg)}")
            print(f"Visible checkbox questions: {len(visible_cb)}")

            for n, i in enumerate(visible_rg, start=1):
                item = all_radio.nth(i)
                title = item.locator('[role="heading"]').first.inner_text(timeout=2_000)
                opts = item.locator('div[role="radio"]').count()
                print(f"  RG {n} ({opts} opts): {title.replace(chr(10), ' ')[:100]}")

            for n, i in enumerate(visible_cb, start=1):
                item = all_cb.nth(i)
                title = item.locator('[role="heading"]').first.inner_text(timeout=2_000)
                opts = item.locator('div[role="checkbox"]').count()
                print(f"  CB {n} ({opts} opts): {title.replace(chr(10), ' ')[:100]}")

            clicked = False
            for label in NEXT_LABELS:
                btn = page.locator(f'[role="button"]:has-text("{label}")')
                if btn.count() > 0:
                    btn.first.click(timeout=3_000)
                    page.wait_for_timeout(2_000)
                    page_num += 1
                    clicked = True
                    break

            if not clicked:
                print("  (last page)")
                break

        browser.close()


if __name__ == "__main__":
    main()
