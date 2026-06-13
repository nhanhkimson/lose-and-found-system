#!/usr/bin/env python3
"""
Playwright batch submitter for:
  Digital Lost & Found System for BELTEI International University

Form: https://docs.google.com/forms/d/e/1FAIpQLSdUNzeq_a1WyzGIk1rZ3T352yGHpd5ZQ3jbm-LdWPrgUwk-4Q/viewform

Live form pages (verified):
  Page 1  Section A  Q1–Q3   profile (3 radio)
  Page 2  Section B  Q4–Q6   experience (3 radio)
  Page 3  Section C  Q7–Q11  perceptions (5 radio)
  Page 4  Section D  Q15     feature preferences (1 checkbox, 5 options)
  Page 5  Section E  Q16–Q20 motion graphics (5 scale radio)
"""

from __future__ import annotations

import argparse
import os
import random
import sys
import time
from pathlib import Path
from typing import TypedDict

_LOCAL_BROWSERS = Path(__file__).resolve().parent / ".pw-browsers"
if _LOCAL_BROWSERS.exists():
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(_LOCAL_BROWSERS)

from playwright.sync_api import Page, sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

FORM_URL = (
    "https://docs.google.com/forms/d/e/1FAIpQLSdUNzeq_a1WyzGIk1rZ3T352yGHpd5ZQ3jbm-LdWPrgUwk-4Q/viewform"
)

NEXT_LABELS = ("បន្ទាប់", "Next", "ទៅមុខ")
SUBMIT_LABELS = ("ដាក់បញ្ជូន", "ដាក់ស្នើ", "Submit")


class RadioSpec(TypedDict, total=False):
    type: str
    weights: list[float]


class CheckboxPageSpec(TypedDict, total=False):
    type: str
    min: int
    max: int


QuestionSpec = RadioSpec | CheckboxPageSpec


def pick_weighted(weights: list[float] | None, option_count: int) -> int:
    if option_count <= 0:
        return 0
    if not weights:
        return random.randint(0, option_count - 1)
    sized = weights[:option_count]
    if len(sized) < option_count:
        sized += [1.0] * (option_count - len(sized))
    return random.choices(range(option_count), weights=sized, k=1)[0]


def click_first_visible(page: Page, labels: tuple[str, ...], timeout_ms: int = 5000) -> bool:
    for label in labels:
        btn = page.locator(f'[role="button"]:has-text("{label}")')
        if btn.count() == 0:
            continue
        try:
            if btn.first.is_visible():
                btn.first.click(timeout=timeout_ms)
                return True
        except Exception:
            continue
    return False


def visible_radio_questions(page: Page) -> list:
    items = page.locator('div[role="listitem"]').filter(
        has=page.locator('div[role="radiogroup"]')
    )
    return [items.nth(i) for i in range(items.count()) if items.nth(i).is_visible()]


def fill_radio_item(item, weights: list[float] | None = None) -> None:
    radios = item.locator('div[role="radiogroup"]').first.locator('div[role="radio"]')
    count = radios.count()
    if count == 0:
        return
    radios.nth(pick_weighted(weights, count)).click()
    time.sleep(0.1)


def fill_checkbox_page(page: Page, *, min_select: int = 2, max_select: int = 4) -> None:
    """Q15 options render as separate listitems — click visible checkboxes on the page."""
    checkboxes = page.locator('div[role="checkbox"]')
    visible = [i for i in range(checkboxes.count()) if checkboxes.nth(i).is_visible()]
    if not visible:
        return
    upper = min(max_select, len(visible))
    lower = min(min_select, upper)
    for idx in random.sample(visible, random.randint(lower, upper)):
        checkboxes.nth(idx).click()
        time.sleep(0.1)


def submit_button_visible(page: Page) -> bool:
    for label in SUBMIT_LABELS:
        btn = page.locator(f'[role="button"]:has-text("{label}")')
        if btn.count() > 0 and btn.first.is_visible():
            return True
    return False


# Weights skew toward thesis-friendly distributions.
PAGES: list[list[QuestionSpec]] = [
    # Section A — Q1 campus role, Q2 gender, Q3 age
    [
        {"type": "radio", "weights": [0.70, 0.15, 0.10, 0.05]},
        {"type": "radio", "weights": [0.58, 0.40, 0.02]},
        {"type": "radio", "weights": [0.05, 0.66, 0.24, 0.05]},
    ],
    # Section B — Q4 frequency, Q5 faculty, Q6 item type
    [
        {"type": "radio", "weights": [0.10, 0.30, 0.35, 0.25]},
        {"type": "radio", "weights": [0.35, 0.20, 0.15, 0.10, 0.10, 0.10]},
        {"type": "radio", "weights": [0.20, 0.15, 0.15, 0.15, 0.20, 0.15]},
    ],
    # Section C — Q7 method, Q8 recovered, Q9 usefulness, Q10 privacy, Q11 would use
    [
        {"type": "radio", "weights": [0.15, 0.45, 0.25, 0.15]},
        {"type": "radio", "weights": [0.35, 0.65]},
        {"type": "radio", "weights": [0.05, 0.10, 0.25, 0.35, 0.25]},
        {"type": "radio", "weights": [0.03, 0.07, 0.15, 0.35, 0.40]},
        {"type": "radio", "weights": [0.88, 0.10, 0.02]},
    ],
    # Section D — Q15 features only (Q12–Q14 not on live form)
    [
        {"type": "checkbox_page", "min": 2, "max": 4},
    ],
    # Section E — Q16–Q20 motion graphics scales
    [
        {"type": "radio", "weights": [0.02, 0.05, 0.10, 0.33, 0.50]},
        {"type": "radio", "weights": [0.02, 0.05, 0.10, 0.33, 0.50]},
        {"type": "radio", "weights": [0.02, 0.05, 0.10, 0.33, 0.50]},
        {"type": "radio", "weights": [0.02, 0.05, 0.10, 0.33, 0.50]},
        {"type": "radio", "weights": [0.02, 0.05, 0.10, 0.33, 0.50]},
    ],
]


def fill_page(page: Page, questions: list[QuestionSpec]) -> None:
    radio_specs = [q for q in questions if q["type"] == "radio"]
    visible_radios = visible_radio_questions(page)

    for item, spec in zip(visible_radios, radio_specs):
        fill_radio_item(item, spec.get("weights"))

    for spec in questions:
        if spec["type"] == "checkbox_page":
            fill_checkbox_page(
                page,
                min_select=spec.get("min", 2),
                max_select=spec.get("max", 4),
            )


def submit_one(page: Page) -> bool:
    page.goto(
        f"{FORM_URL}?_={random.randint(0, 999_999)}",
        wait_until="domcontentloaded",
        timeout=45_000,
    )
    page.wait_for_timeout(2_500)

    if "formResponse" in page.url:
        return False

    # Skip intro page when it has no questions.
    if not visible_radio_questions(page):
        if not click_first_visible(page, NEXT_LABELS):
            return False
        page.wait_for_timeout(1_800)

    for page_index, questions in enumerate(PAGES):
        fill_page(page, questions)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(0.4)

        if submit_button_visible(page):
            break

        if page_index < len(PAGES) - 1:
            if not click_first_visible(page, NEXT_LABELS):
                return False
            page.wait_for_timeout(1_800)

    for _ in range(3):
        if click_first_visible(page, SUBMIT_LABELS):
            page.wait_for_timeout(2_500)
            return "formResponse" in page.url
        time.sleep(0.8)

    return "formResponse" in page.url


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Auto-submit BIU Lost & Found Google Form responses"
    )
    parser.add_argument("--count", "-n", type=int, default=200)
    parser.add_argument(
        "--delay",
        type=float,
        nargs=2,
        default=[5, 10],
        metavar=("MIN", "MAX"),
    )
    parser.add_argument("--headless", action="store_true")
    args = parser.parse_args()

    total = args.count
    delay_min, delay_max = args.delay

    print("=" * 68)
    print("  BIU Lost & Found Survey — Playwright Submitter")
    print(f"  Target: {total} responses")
    print(f"  Delay:  {delay_min}-{delay_max}s")
    print("=" * 68)

    success = 0
    fail = 0

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=args.headless)
        context = browser.new_context(locale="en-US")

        for i in range(1, total + 1):
            page = context.new_page()
            try:
                ok = submit_one(page)
            except Exception as exc:
                ok = False
                print(f"[{i:3d}/{total}] ERROR: {exc}")
            finally:
                page.close()

            if ok:
                success += 1
                print(f"[{i:3d}/{total}] OK   (success={success}, fail={fail})")
            else:
                fail += 1
                print(f"[{i:3d}/{total}] FAIL (success={success}, fail={fail})")

            if i < total:
                time.sleep(random.uniform(delay_min, delay_max))

        context.close()
        browser.close()

    print()
    print("=" * 68)
    print(f"  Finished — Success: {success}  Failed: {fail}")
    if success + fail > 0:
        print(f"  Success rate: {success / (success + fail) * 100:.1f}%")
    print("=" * 68)


if __name__ == "__main__":
    main()
