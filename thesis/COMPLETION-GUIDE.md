# Thesis Completion Guide

Your thesis draft is generated at:

**`thesis/BIU-Lost-Found-Thesis-2026.docx`**

It follows the BELTEI BIT-SE format from the UC1-SE sample, adapted for the **BIU Lost & Found Management System (BLFMS)**.

## Before Submission — Replace These Placeholders

| Placeholder | Action |
|-------------|--------|
| `NHANH KIMSON` | Confirm or change to your official name |
| `MR. KEO VICHET` | Replace with your real supervisor name |
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

Use `thesis/survey-questionnaire.md` to create a Google Form. After collecting responses, export charts and paste them as **Figure 11–25** in Chapter 3.

## Regenerate the Document

```bash
.thesis-venv/bin/python scripts/generate-thesis.py
```

Edit `scripts/generate-thesis.py` to change author name, supervisor, survey results, or chapter text.

## Formatting Tips for Word

1. Open the `.docx` in Microsoft Word
2. Set margins: 1 inch all sides (BIU standard)
3. Set body text: Times New Roman 12pt, 1.5 line spacing
4. Add page numbers (bottom center, starting after front matter)
5. Insert screenshots with captions matching the List of Figures
6. Add Table of Contents auto-field (References → Table of Contents)

## Chapters Included

- Chapter 1: Introduction
- Chapter 2: Literature Review
- Chapter 3: Research Methodology (UI/UX, tech stack, survey analysis)
- Chapter 4: Data Analysis (strengths, weaknesses, BLFMS solution)
- Chapter 5: Findings and Discussions
- Chapter 6: Conclusion and Recommendations
- References
- Appendices A–F
