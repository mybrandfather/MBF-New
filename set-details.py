#!/usr/bin/env python3
# ============================================================
#  MyBrandFather — one-shot detail filler
#  Run this ONCE when you have your real details.
#    1. Edit the four values below.
#    2. Run:  python3 set-details.py
#  It updates phone, email, and city everywhere on the site.
# ============================================================

# ---- EDIT THESE FOUR LINES ----
REAL_PHONE_DISPLAY = "(860) 268-7732"      # how the phone shows on screen
REAL_PHONE_DIGITS  = "8602687732"          # same number, digits only (for tel: links)
REAL_EMAIL         = "hello@mybrandfather.com"
REAL_CITY          = "Manchester, CT"      # or just your city/region
# --------------------------------

import glob

PLACEHOLDERS = {
    "(860) 268-7732": REAL_PHONE_DISPLAY,
    "8602687732":     REAL_PHONE_DIGITS,
    "hello@mybrandfather.com": REAL_EMAIL,
    "Manchester, CT": REAL_CITY,
    "Manchester, Connecticut": REAL_CITY,
    "Manchester": REAL_CITY.split(",")[0],
}

count = 0
for f in glob.glob("*.html") + glob.glob("api/*.js"):
    s = open(f).read()
    before = s
    for old, new in PLACEHOLDERS.items():
        s = s.replace(old, new)
    if s != before:
        open(f, "w").write(s)
        count += 1
        print(f"updated {f}")
print(f"\nDone — {count} files updated with your real details.")
