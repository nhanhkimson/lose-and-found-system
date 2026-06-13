#!/usr/bin/env python3
"""Generate DLFS conceptual framework diagram (Figure 1) for thesis section 2.4."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "thesis" / "figures" / "figure-1-conceptual-framework.png"

WIDTH = 720
MARGIN = 40
BOX_WIDTH = WIDTH - 2 * MARGIN
HEADER_H = 44
LINE_H = 28
PADDING = 16
ARROW_H = 36

BLUE = (68, 114, 196)
GREEN = (112, 173, 71)
TITLE_BLUE = (46, 117, 182)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY = (180, 180, 180)
SUB_GRAY = (100, 100, 100)

IV_ITEMS = [
    "System Usability",
    "System Accessibility",
    "Reporting Efficiency",
    "Search Functionality",
    "Notification Systems",
    "Claim Verification",
]

IV_TITLE = "Independent Variables (IVs)"

INTERVENING_TITLE = "Digital Lost & Found System (DLFS)"
INTERVENING_SUB = "(Intervening Variable)"
INTERVENING_ITEMS = [
    "Centralized Item Database",
    "Real-time Notifications",
    "Data Security & Privacy",
    "User Acceptance",
]

DV_ITEMS = [
    "Increased Recovery Rates",
    "Improved Finder-Owner Communication",
    "Reduced Search Time",
    "Higher User Satisfaction",
    "Enhanced Administrative Efficiency",
    "Organized Campus Environment",
]

DV_TITLE = "Dependent Variables (DVs)"


def load_fonts() -> tuple[ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont]:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    path = next((p for p in candidates if Path(p).exists()), None)
    if path is None:
        raise FileNotFoundError("No suitable TTF font found on system")
    return (
        ImageFont.truetype(path, 16),
        ImageFont.truetype(path, 15),
        ImageFont.truetype(path, 13),
    )


def box_height(item_count: int, extra_lines: int = 0) -> int:
    return HEADER_H + PADDING + (item_count * LINE_H) + PADDING + (extra_lines * LINE_H)


def draw_header_box(
    draw: ImageDraw.ImageDraw,
    y: int,
    title: str,
    items: list[str],
    header_color: tuple[int, int, int],
    fonts: tuple[ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont],
) -> int:
    title_font, body_font, _ = fonts
    height = box_height(len(items))
    x = MARGIN

    draw.rectangle([x, y, x + BOX_WIDTH, y + height], fill=WHITE, outline=GRAY, width=1)
    draw.rectangle([x, y, x + BOX_WIDTH, y + HEADER_H], fill=header_color)
    draw.text((x + 12, y + 12), title, fill=WHITE, font=title_font)

    content_y = y + HEADER_H + PADDING
    for item in items:
        draw.text((x + 24, content_y), f"• {item}", fill=BLACK, font=body_font)
        content_y += LINE_H

    return y + height


def draw_intervening_box(
    draw: ImageDraw.ImageDraw,
    y: int,
    fonts: tuple[ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont],
) -> int:
    title_font, body_font, sub_font = fonts
    height = box_height(len(INTERVENING_ITEMS), extra_lines=1)
    x = MARGIN

    draw.rectangle([x, y, x + BOX_WIDTH, y + height], fill=WHITE, outline=GRAY, width=1)

    content_y = y + PADDING
    draw.text((x + 12, content_y), INTERVENING_TITLE, fill=TITLE_BLUE, font=title_font)
    content_y += LINE_H
    draw.text((x + 12, content_y), INTERVENING_SUB, fill=SUB_GRAY, font=sub_font)
    content_y += LINE_H + 4

    for item in INTERVENING_ITEMS:
        draw.text((x + 24, content_y), f"• {item}", fill=BLACK, font=body_font)
        content_y += LINE_H

    return y + height


def draw_arrow(draw: ImageDraw.ImageDraw, y: int) -> int:
    cx = WIDTH // 2
    top = y + 6
    bottom = y + ARROW_H - 6
    shaft_w = 4

    draw.rectangle([cx - shaft_w // 2, top, cx + shaft_w // 2, bottom - 10], fill=GRAY)
    draw.polygon(
        [
            (cx, bottom),
            (cx - 12, bottom - 14),
            (cx + 12, bottom - 14),
        ],
        fill=GRAY,
    )
    return y + ARROW_H


def generate() -> Path:
    fonts = load_fonts()
    total_h = (
        MARGIN
        + box_height(len(IV_ITEMS))
        + ARROW_H
        + box_height(len(INTERVENING_ITEMS), extra_lines=1)
        + ARROW_H
        + box_height(len(DV_ITEMS))
        + MARGIN
    )

    img = Image.new("RGB", (WIDTH, total_h), WHITE)
    draw = ImageDraw.Draw(img)

    y = MARGIN
    y = draw_header_box(draw, y, IV_TITLE, IV_ITEMS, BLUE, fonts)
    y = draw_arrow(draw, y)
    y = draw_intervening_box(draw, y, fonts)
    y = draw_arrow(draw, y)
    draw_header_box(draw, y, DV_TITLE, DV_ITEMS, GREEN, fonts)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUTPUT, "PNG")
    return OUTPUT


if __name__ == "__main__":
    path = generate()
    print(f"Generated: {path}")
