# Thesis Completion Guide

Your thesis draft is generated at:

**`thesis/Nhanh-Kimson-Thesis-2026.docx`**

It follows the BELTEI BIT-SE format from the UC1-SE sample, adapted for the **Digital Lost & Found System (DLFS)**.

## Recently Updated (auto-synced)

| File | Status |
|------|--------|
| `scripts/generate-thesis.py` | Source — edit chapter text here |
| `thesis/Nhanh-Kimson-Thesis-2026.docx` | Regenerated thesis |
| `thesis/Nhanh-Kimson-Thesis-2026.pdf` | Regenerated PDF |
| `thesis/chapter-3.txt` | **Updated** — exported from generator (Chapter 3) |
| `thesis/figures/figure-1-conceptual-framework.png` | Figure 1 — DLFS conceptual framework (§2.4) |

**Chapter 3** includes: mixed-methods design, UI/UX scope, 200-respondent survey (Q1–Q11, Q15–Q20), Tables 1–3, Figures 2–27 placeholders.

## Before Submission — Replace These Placeholders

| Placeholder | Action |
|-------------|--------|
| `NHANH KIMSON` | Confirm or change to your official name |
| `MR. SOTHEA THY` | Confirm supervisor name |
| Committee signatures | Add real signatures on printed copy |
| Submission date | Fill in actual date |
| `[Insert screenshots...]` in Appendices | Add real UI photos from your app |

## Screenshots to Capture (Appendix C & F)

Run `pnpm dev` and capture these pages:

1. Home page — recent lost/found listings
2. Login / Register
3. Report Lost (multi-step form)
4. Report Found (multi-step form)
5. Item detail page with claim button
6. Claim form with proof upload
7. User dashboard with stats/charts
8. Notifications page
9. Admin dashboard
10. Admin claims review table
11. API docs page (`/api-docs`)
12. Database diagram (export from Prisma or draw.io)

## Survey Questionnaire (Appendix D)

Google Form: 200 responses collected. Export charts and paste as **Figure 11–27** in Chapter 3 (Questions 1–11, 15–20).

## Regenerate the Document

```bash
.thesis-venv/bin/python scripts/generate-thesis.py
```

This also refreshes `thesis/chapter-3.txt`. Edit `scripts/generate-thesis.py` to change author name, supervisor, survey results, or chapter text.

## Formatting Tips for Word

1. Open the `.docx` in Microsoft Word
2. Set margins: 1 inch all sides (BIU standard)
3. Set body text: Times New Roman 12pt, 1.5 line spacing
4. Add page numbers (bottom center, starting after front matter)
5. Insert screenshots with captions matching the List of Figures
6. Add Table of Contents auto-field (References → Table of Contents)

## Chapters Included

- Chapter 1: Introduction
- Chapter 2: Literature Review (+ Figure 1 conceptual framework)
- Chapter 3: Research Methodology (UI/UX, tech stack, survey analysis) — **updated**
- Chapter 4: Data Analysis (strengths, weaknesses, DLFS solution)
- Chapter 5: Findings and Discussions
- Chapter 6: Conclusion and Recommendations
- References
- Appendices A–F
