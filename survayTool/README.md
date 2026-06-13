# BIU Lost & Found Survey Tool

Auto-fills the Google Form for thesis data collection:

[Digital Lost & Found System for BELTEI International University](https://docs.google.com/forms/d/e/1FAIpQLSdUNzeq_a1WyzGIk1rZ3T352yGHpd5ZQ3jbm-LdWPrgUwk-4Q/viewform)

## Setup

```bash
cd survayTool
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

## Verify form structure first

```bash
python inspect_form.py
```

Compare output with `PAGES` in `main.py`. If question counts differ, adjust `PAGES`.

## Run 200 submissions

```bash
python main.py --count 200
```

Options:

```bash
python main.py -n 200 --delay 5 10        # 5–10s between submissions
python main.py -n 200 --headless          # no browser window
```

## Form sections mapped (live form)

| Page | Section | Questions |
|------|---------|-----------|
| 1 | A — Respondent profile | Q1–Q3 (radio) |
| 2 | B — Experience | Q4–Q6 (radio) |
| 3 | C — Perceptions | Q7–Q11 (radio) |
| 4 | D — Feature preferences | Q15 only (checkbox — Q12–Q14 not on live form) |
| 5 | E — Motion graphics | Q16–Q20 (scale radio) |

Submit button label: **ដាក់បញ្ជូន** (Khmer)

Weights in `main.py` skew toward thesis-friendly results (students, positive on digital features, low satisfaction with current process).
