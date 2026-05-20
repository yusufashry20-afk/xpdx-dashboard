import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5iAR3Hyws/GCu
DtgRASJFBhwu9viLkRB7gUe+dS6nMEnQWQAoQ1jHBNfblzV63O311OrzX3XJLFoO
PvmbRaoGgVsvnmz/SwIwtPUo0P3ltOCOFiN6WjFMJgK/SHAjD7GL+tLpvXE6voCm
XTUM/gOHNvU51eaRL3mDdXCvarxaygqT6YsMDg2riKwHUUhZVOVS4l7D3VTayeHu
oDz6v9Ml1+UyXHWqPEVV4NER9JFz5eBJ2AWwkZSWgOF2ufE6b8U4nGNqtenAROWt
1l2uAHM7rgHg3r/f4QVxFxZwlHFqZEYLRNWOJnjS8humSdP+jAMoqD7fxCrUPVFR
5U2Azq5XAgMBAAECggEAVmbWMYWWZJLaEWU/UVf2Vi+8w1BnulOB2gqAV12qLtkp
nvo7vQR0HScPwad/E+s8dI5GJrXvnBLoE5dXVezQ/DuUtC3y88dCS12SiIIfo7Cj
HPiJaCsFp0FSaTN6aZGe7SIPxCPhzeo27oMcuCK5kOhStq77M+TokYSJSGAMPLjs
AwtMcC6qSJZHIvHjqYvGfGmCey+BgxMrM7AVVjISXVHe6yjtDxilI0XJ7Ntzh4d9
MzlAvHYRnAAijSyBoAbwbdmbWG4cw5pJoliPTaKhCPv8v6eZKz6uf/do/ciyzPuO
s4x4TVNGW6ZwTVmfpe4t9GOsuyj5EovOSzLgsfhguQKBgQDt+fAz09Q8XPoe/kUh
Ub++bHSQ356K/7T206SMGr7pbuNq9U3wNldYdDoRFmtL1D1ilqIcAL/rc8YcgDCC
Ygio5k7jtl1NEnYih+A5SnS5rSvrQK0Un1e0Mx7mE38wn+xGCIJhJruk4Nw5h0ru
oAY0UpQEVWfxpNLTIBHhpzcTnwKBgQDHlTyJGiEpdNWFv6h813MheLzI5Axa7BUQ
FqPcrH2Z8pLTHYya3djnVFR+RoUhHJk7TwxK+rYNN+cMVRAPFwEusUtYgglUMJGk
f4VJhA2ldFAXRk2eXIG8pp7lmwzvlTUWx1FmoxmerfUNxvU5j7XRB3HBgX4cw1LI
LvSvG94qSQKBgQCXbHMoN0CTzEGnGPoZ8m+ElnQxfujd30lhyVepgpc558IzW7Vl
BN7dPM958f8B+CG7Ksgp81wrULadif/T5tdFyY4nHPIPSZD79eN58OOHBiatAbFg
LufalLCzi3JiGVB5W47CjKfXiPD4dhr67b4k6uqeO03xl4RCrORT5leIVwKBgQCk
wBGHj3U+dn5n+O0JmQQl5jfYkT+NsoI0lKvRVuYbtbzz3tmZYXZShy90SZxN2AC5
j6gzIMA1Kydj67fk7PWB6MKsnjM7NxiStN1+8S4enWQbwmICTpSd+OED4jkMcJux
YPlWA177uNen9supJ3NLyJxjwxQqhCYKr5A2GIgNWQKBgQCto5Ldzdtda23dyIvt
gVz0hnVp06S6YJKzxl1g0Y/7E1zY3GdTePnY2RRRhXI1DjY40FgLRI+qNFlgy2Lc
LNs4wxKJCnb3lSKFWwRms0qRpixKsp+Xofrrq8q3uZX6VdkF6ZHh9SFYMnn1XafI
Mpy/WqhGsqiM+mB2cu9/2Yl2kw==
-----END PRIVATE KEY-----`;

const SHEET_IDS = {
  payments: process.env.SHEET_PAYMENTS,
  service: process.env.SHEET_SERVICE,
  licences: process.env.SHEET_LICENCES,
  damage: process.env.SHEET_DAMAGE,
};

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: 'xpdx-dashboard@gen-lang-client-0647367148.iam.gserviceaccount.com',
      private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function readSheet(sheets, spreadsheetId, range) {
  try {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.data.values || [];
  } catch (e) {
    console.error(`Error reading sheet ${spreadsheetId} range ${range}:`, e.message);
    return [];
  }
}

function parseAmount(str) {
  if (!str) return 0;
  const n = parseFloat(str.toString().replace(/[$,]/g, ''));
  return isNaN(n) ? 0 : n;
}

function parseDate(str) {
  if (!str) return null;
  const parts = str.toString().split('/');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }
  return null;
}

function daysUntil(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
}

export async function GET(request) {
  const authHeader = request.headers.get('x-dashboard-password');
  if (authHeader !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sheets = await getSheets();

    const payRows = await readSheet(sheets, SHEET_IDS.payments, 'XPDX PAYMENTS!A:K');
    const allRenters = payRows.slice(1)
      .filter(r => r[0] && r[0].toString().trim() && r[0].toString().trim() !== 'Rego')
      .map(r => ({
        rego: r[0]?.toString().trim() || '',
        vehicle: r[1]?.toString().trim() || '',
        amount: parseAmount(r[2]),
        renter: r[3]?.toString().trim() || '',
        paymentDay: r[4]?.toString().trim() || '',
        paymentMethod: r[5]?.toString().trim() || '',
        email: r[6]?.toString().trim() || '',
        phone: r[7]?.toString().trim() || '',
        notes: r[8]?.toString().trim() || '',
        licExpiry: r[9]?.toString().trim() || '',
        driverLicExpiry: r[10]?.toString().trim() || '',
      }))
      .filter(r => r.rego.length >= 4 && r.rego.length <= 10);

    const thuRenters = allRenters.filter(r => r.paymentDay?.toLowerCase() === 'thursday');
    const sunRenters = allRenters.filter(r => r.paymentDay?.toLowerCase() === 'sunday');
    const activeRenters = allRenters.filter(r => r.amount > 0 && r.renter);
    const weeklyTotal = activeRenters.reduce((s, r) => s + r.amount, 0);
    const thuTotal = thuRenters.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);
    const sunTotal = sunRenters.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);

    const inRepairs = allRenters.filter(r =>
      r.notes?.toLowerCase().includes('repair') ||
      r.notes?.toLowerCase().includes('engine swap') ||
      r.notes?.toLowerCase().includes('workshop')
    );

    const svcRows = await readSheet(sheets, SHEET_IDS.service, 'Fleet!A:F');
    const serviceData = svcRows.slice(1)
      .filter(r => r[0] && r[0].toString().trim() && r[0] !== 'Rego')
      .map(r => ({
        rego: r[0]?.toString().trim() || '',
        currentOdo: parseFloat(r[1]) || 0,
        lastUpdated: r[2]?.toString().trim() || '',
        nextServiceAt: parseFloat(r[3]) || 0,
        kmToService: parseFloat(r[4]) || 0,
        status: r[5]?.toString().trim() || '',
      }))
      .filter(r => r.rego && r.rego.length >= 4 && r.rego.length <= 12 && !r.rego.includes(' '));

    const overdue = serviceData.filter(r => r.status === 'OVERDUE');
    const dueSoon = serviceData.filter(r => r.status === 'DUE SOON');

    const licRows = await readSheet(sheets, SHEET_IDS.licences, 'Sheet3!A:F');
    const licData = licRows.slice(1)
      .filter(r => r[0] && r[1] && r[2])
      .map(r => ({
        rego: r[0]?.toString().trim() || '',
        renter: r[1]?.toString().trim() || '',
        status: r[2]?.toString().trim() || '',
        expiry: r[3]?.toString().trim() || '',
        licNumber: r[4]?.toString().trim() || '',
        notes: r[5]?.toString().trim() || '',
        daysUntilExpiry: daysUntil(r[3]),
      }))
      .filter(r => r.rego && !r.rego.includes('6666') && r.renter !== 'Renter');

    const expiredLics = licData.filter(r => r.status === 'Expired');
    const expiringSoonLics = licData.filter(r => r.status === 'Expires Soon');

    const dmgRows = await readSheet(sheets, SHEET_IDS.damage, 'Damage!A:H');
    const dmgData = dmgRows.slice(1)
      .filter(r => r[0] && r[0].toString().trim() && r[1])
      .map(r => ({
        renter: r[0]?.toString().trim() || '',
        van: r[1]?.toString().trim() || '',
        agreedToPay: r[2]?.toString().trim() || '',
        amountRecovered: parseAmount(r[3]),
        amountNR: parseAmount(r[4]),
        paymentPlan: r[5]?.toString().trim() || '',
        paid: r[6]?.toString().trim() || '',
        comments: r[7]?.toString().trim() || '',
      }))
      .filter(r => r.renter && r.van && r.renter !== 'Outstanding payments');

    const inProgressDmg = dmgData.filter(r =>
      r.paid?.toLowerCase().includes('progress') || (!r.paid && r.amountNR > 0)
    );
    const totalNR = dmgData.reduce((s, r) => s + r.amountNR, 0);
    const totalRecovered = dmgData.reduce((s, r) => s + r.amountRecovered, 0);

    const alerts = [];
    overdue.forEach(v => alerts.push({ type: 'danger', icon: 'wrench', message: `${v.rego} service OVERDUE by ${Math.abs(Math.round(v.kmToService)).toLocaleString()} km — book mechanic today` }));
    dueSoon.forEach(v => alerts.push({ type: 'warning', icon: 'wrench', message: `${v.rego} service due in ${Math.round(v.kmToService).toLocaleString()} km — book this week` }));
    expiredLics.forEach(l => alerts.push({ type: 'danger', icon: 'id-card', message: `Expired licence: ${l.renter} (${l.rego}) expired ${l.expiry} — must not drive` }));
    expiringSoonLics.slice(0, 5).forEach(l => alerts.push({ type: 'warning', icon: 'id-card', message: `Licence expiring soon: ${l.renter} (${l.rego}) — expires ${l.expiry}` }));
    inRepairs.forEach(v => alerts.push({ type: 'warning', icon: 'truck', message: `${v.rego} in repairs — ${v.notes}` }));
    if (totalNR > 5000) alerts.push({ type: 'danger', icon: 'dollar', message: `$${Math.round(totalNR).toLocaleString()} damage not yet recovered across ${inProgressDmg.length} cases` });

    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      revenue: { weeklyTotal, thuTotal, sunTotal, activeRenters: activeRenters.length },
      fleet: { thuRenters, sunRenters, inRepairs: inRepairs.map(r => ({ rego: r.rego, notes: r.notes })) },
      service: { all: serviceData, overdue, dueSoon, overdueCount: overdue.length, dueSoonCount: dueSoon.length },
      licences: { all: licData, expired: expiredLics, expiringSoon: expiringSoonLics, expiredCount: expiredLics.length, expiringSoonCount: expiringSoonLics.length },
      damage: { all: dmgData, inProgress: inProgressDmg, totalNR, totalRecovered, inProgressCount: inProgressDmg.length },
      alerts,
    });

  } catch (err) {
    console.error('Data fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
