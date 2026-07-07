# Survey Chart Guide — WRONG vs CORRECT (match thesis Chapter 3)

## What you generated (INCORRECT)

Your current images have these problems:

| Problem | What you have (wrong) | What the thesis needs (correct) |
|--------|------------------------|----------------------------------|
| **Chart type** | Horizontal bar chart (Likert) | **Pie chart** (Google Forms style) |
| **Answer options** | Strongly Agree / Agree / Neutral / Disagree / Strongly Disagree | **Yes / No / Not sure** |
| **Background** | Black/dark theme | **White** (Google Forms screenshot) |
| **Figure labels** | "Figure 24 = question 12" | **Figure 22 = Q12**, Figure 23 = Q13, Figure 24 = Q14 |
| **Data example Q12** | Agree 22, Strongly Agree 16… | **Yes 179 (77.8%), No 18 (7.8%), Not sure 33 (14.3%)** |
| **Style reference** | Generic bar chart | **Same as your real Q7 pie chart** |

**Q12–Q14 are NOT Likert questions.** Only **Q16–Q20** use a 1–5 agreement scale.

---

## Correct figure map (Chapter 3)

| Figure | Question | Chart type | Answer options |
|--------|----------|------------|----------------|
| 11–21 | Q1–Q11 | Pie (Google Forms) | Varies per question |
| **22** | **Q12** | **Pie** | **Yes / No / Not sure** |
| **23** | **Q13** | **Pie** | **Yes / No / Not sure** |
| **24** | **Q14** | **Pie** | **Yes / No / Not sure** |
| 25 | Q15 | Bar or checkbox chart | Multiple features (multi-select) |
| 26–30 | Q16–Q20 | Bar or scale chart | 1–5 agreement scale |

---

## Correct data for Q12–Q14 (230 responses)

### Figure 22 — Question 12
**Q12. Would uploading photos of items help verification?**  
តើការផ្ទុករូបថតវត្ថុជួយផ្ទៀងផ្ទាត់បានទេ?

| Answer | Count | % |
|--------|-------|---|
| Yes | 179 | 77.8% |
| No | 18 | 7.8% |
| Not sure | 33 | 14.3% |

### Figure 23 — Question 13
**Q13. Would searchable online listings with filters (category, building, date) help?**  
តើបញ្ជីអនឡាញដែលអាចស្វែងរកជាមួយតម្រង (ប្រភេទ, អាគារ, កាលបរិច្ឆេទ) ជួយបានទេ?

| Answer | Count | % |
|--------|-------|---|
| Yes | 187 | 81.3% |
| No | 14 | 6.1% |
| Not sure | 29 | 12.6% |

### Figure 24 — Question 14
**Q14. Would a digital claim workflow (submit proof → staff review → notification) be useful?**  
តើលំហូរការទាមទារឌីជីថល (ដាក់បញ្ជាក់ → ការពិនិត្យរបស់បុគ្គលិក → ការជូនដំណឹង) មានប្រយោជន៍ទេ?

| Answer | Count | % |
|--------|-------|---|
| Yes | 183 | 79.6% |
| No | 16 | 7.0% |
| Not sure | 31 | 13.4% |

---

## Gemini prompt — Figure 22 (Q12) — COPY THIS

**Step 1:** Upload your real **Q7 pie chart screenshot** to Gemini.  
**Step 2:** Paste:

```
Clone my uploaded Q7 Google Forms chart EXACTLY. Do NOT use bar charts. Do NOT use Likert scale. Do NOT use black background.

This is Question 12 with only 3 answers: Yes, No, Not sure.

Layout (same as Q7):
- White background
- One line: Q12. Would uploading photos of items help verification? តើការផ្ទុករូបថតវត្ថុជួយផ្ទៀងផ្ទាត់បានទេ?
- Next line: 230 responses
- LEFT: pie chart with white % inside each slice
- RIGHT: legend with colored dots

Pie data (only 3 slices):
- Red — Yes — 77.8% (179)
- Orange — Not sure — 14.3% (33)
- Blue — No — 7.8% (18)

Caption below image (for thesis): Figure 22 Respondents of question 12

NOT Strongly Agree. NOT bar chart. NOT dark theme.
```

---

## Gemini prompt — Figure 23 (Q13)

```
Clone my uploaded Q7 Google Forms pie chart EXACTLY. Pie chart only. White background. No Likert. No bar chart.

Q13. Would searchable online listings with filters (category, building, date) help? តើបញ្ជីអនឡាញដែលអាចស្វែងរកជាមួយតម្រង (ប្រភេទ, អាគារ, កាលបរិច្ឆេទ) ជួយបានទេ?
230 responses

Pie: Yes 81.3% (187, Red) | Not sure 12.6% (29, Orange) | No 6.1% (14, Blue)
Legend: Blue No, Red Yes, Orange Not sure
Caption: Figure 23 Respondents of question 13
```

---

## Gemini prompt — Figure 24 (Q14)

```
Clone my uploaded Q7 Google Forms pie chart EXACTLY. Pie chart only. White background. No Likert. No bar chart.

Q14. Would a digital claim workflow (submit proof → staff review → notification) be useful? តើលំហូរការទាមទារឌីជីថល (ដាក់បញ្ជាក់ → ការពិនិត្យរបស់បុគ្គលិក → ការជូនដំណឹង) មានប្រយោជន៍ទេ?
230 responses

Pie: Yes 79.6% (183, Red) | Not sure 13.4% (31, Orange) | No 7.0% (16, Blue)
Legend: Blue No, Red Yes, Orange Not sure
Caption: Figure 24 Respondents of question 14
```

---

## Q16–Q20 (Figures 26–30) — if you need those later

These **ARE** 1–5 scale (agreement). Bar chart is OK, but use **white background** to match thesis — not black.

Example Q16 data from Chapter 3:
| Rating | % | Count |
|--------|---|-------|
| 1 | 3.5% | 8 |
| 2 | 4.8% | 11 |
| 3 | 13.9% | 32 |
| 4 | 31.3% | 72 |
| 5 (Strongly Agree) | 46.5% | 107 |

Caption: **Figure 26 Respondents of question 16** (not question 12).

---

## Word document — where to insert

```
QUESTION 12 text...
Figure 22 Respondents of question 12   ← insert pie chart image here

QUESTION 13 text...
Figure 23 Respondents of question 13   ← insert pie chart image here

QUESTION 14 text...
Figure 24 Respondents of question 14   ← insert pie chart image here
```

Delete the wrong bar charts (dark background, Likert labels, wrong figure numbers).
