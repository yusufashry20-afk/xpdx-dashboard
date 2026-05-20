# XPDX Dashboard

Live operations dashboard for XPDX Rentals. Auto-fetches from Google Sheets on every page load.

## Deploy to Vercel (10 minutes)

### Step 1 — Upload to GitHub
1. Go to github.com → New repository → name it `xpdx-dashboard` → Create
2. Upload ALL files from this folder (drag and drop or use GitHub Desktop)

### Step 2 — Deploy on Vercel
1. Go to vercel.com → Add New Project
2. Import your GitHub repository
3. Click **Deploy** (don't change any settings yet)
4. It will fail — that's OK, we need to add environment variables first

### Step 3 — Add Environment Variables
In your Vercel project → Settings → Environment Variables, add ALL of these:

| Name | Value |
|------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `xpdx-dashboard@gen-lang-client-0647367148.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | The full private key from your JSON file (paste the entire thing including BEGIN/END lines) |
| `SHEET_PAYMENTS` | `1vBWWEgPA2eLfIbukxslQGUSqPpx6YeD-7zuPL_SUEH8` |
| `SHEET_SERVICE` | `1pa_GDMu4StgJBSUiBLTI-OjIHvAfqenSLkIRgDKyLho` |
| `SHEET_LICENCES` | `1DwF-WtHkuVlb4HM0EC4un9LSfBuNW-G1tnq3Br-CFrQ` |
| `SHEET_DAMAGE` | `1qAZ4WCPXFiHD6y_WDm4o-oXJQIFqz_p7iMaOFiDJYzo` |
| `DASHBOARD_PASSWORD` | `xpdx2024` (change this to whatever you want) |

### Step 4 — Redeploy
After adding all variables → go to Deployments → click the three dots on the latest → Redeploy

### Step 5 — Done!
Your dashboard is live at your Vercel URL (e.g. xpdx-dashboard.vercel.app)
Share that URL + the password with your team.

## How data updates
- Every time someone opens the dashboard, it fetches fresh data from your Google Sheets
- Click the Refresh button anytime to reload without closing the tab
- No manual exports needed — just update your sheets as normal

## Changing the password
Go to Vercel → Settings → Environment Variables → update `DASHBOARD_PASSWORD` → Redeploy
