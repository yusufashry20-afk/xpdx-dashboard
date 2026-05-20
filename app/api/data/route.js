import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const SHEET_IDS = {
  payments: process.env.SHEET_PAYMENTS,
  service: process.env.SHEET_SERVICE,
  licences: process.env.SHEET_LICENCES,
  damage: process.env.SHEET_DAMAGE,
};

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
  // Auth check
  const authHeader = request.headers.get('x-dashboard-password');
  if (authHeader !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sheets = await getSheets();

    // ── PAYMENTS SHEET ──────────────────────────────────────────────
    const payRows = await readSheet(sheets, SHEET_IDS.payments, 'XPDX PAYMENTS THURSDAY!A1:N100');
    const sunRows = await readSheet(sheets, SHEET_IDS.payments, 'XPDX PAYMENTS SUNDAY!A1:N100');

    const parseRenters = (rows) => {
      if (!rows.length) return [];
      const headers = rows[0];
      return rows.slice(1)
        .filter(r => r[0] && r[0].toString().trim())
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
        .filter(r => r.rego && !r.rego.startsWith('Rego'));
    };

    const thuRenters = parseRenters(payRows);
    const sunRenters = parseRenters(sunRows);

    const allRenters = [...thuRenters, ...sunRenters];
    const activeRenters = allRenters.filter(r => r.amount > 0 && r.renter);
    const weeklyTotal = activeRenters.reduce((s, r) => s + r.amount, 0);
    const thuTotal = thuRenters.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);
    const sunTotal = sunRenters.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);

    // vans in repairs / spares from notes
    const inRepairs = allRenters.filter(r =>
      r.notes?.toLowerCase().includes('repair') ||
      r.notes?.toLowerCase().includes('engine swap') ||
      r.notes?.toLowerCase().includes('workshop')
    );
    const spares = allRenters.filter(r =>
      r.notes?.toLowerCase().includes('spare van') ||
      r.notes?.toLowerCase().includes('spare -')
    );

    // ── SERVICE SHEET ───────────────────────────────────────────────
    const svcRows = await readSheet(sheets, SHEET_IDS.service, 'Fleet!A1:F100');
    const serviceData = svcRows.slice(1)
      .filter(r => r[0] && r[0].toString().trim() && r[0] !== 'Rego')
      .map(r => ({
        rego: r[0]?.toString().trim() || '',
        currentOdo: parseFloat(r[1]) || 0,
        lastUpdated: r[2]?.toString().trim() || '',
        nextServiceAt: parseFloat(r[3]) || 0,
        kmToService: parseFloat(r[4]) || 0,
        status: r[5]?.toString().trim() || 'OK',
      }))
      .filter(r => r.rego && r.rego.length > 3);

    const overdue = serviceData.filter(r => r.status === 'OVERDUE');
    const dueSoon = serviceData.filter(r => r.status === 'DUE SOON');

    // ── LICENCES SHEET ──────────────────────────────────────────────
    const licRows = await readSheet(sheets, SHEET_IDS.licences, 'Sheet3!A1:F100');
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

    // ── DAMAGE SHEET ────────────────────────────────────────────────
    const dmgRows = await readSheet(sheets, SHEET_IDS.damage, 'Damage!A1:H50');
    const dmgData = dmgRows.slice(1)
      .filter(r => r[0] && r[0].toString().trim())
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
      .filter(r => r.renter && r.van);

    const inProgressDmg = dmgData.filter(r =>
      r.paid?.toLowerCase().includes('progress') ||
      (!r.paid && r.amountNR > 0)
    );
    const totalNR = dmgData.reduce((s, r) => s + r.amountNR, 0);
    const totalRecovered = dmgData.reduce((s, r) => s + r.amountRecovered, 0);

    // ── BUILD ALERTS ────────────────────────────────────────────────
    const alerts = [];

    overdue.forEach(v => alerts.push({
      type: 'danger',
      icon: 'wrench',
      message: `${v.rego} service OVERDUE by ${Math.abs(Math.round(v.kmToService)).toLocaleString()} km — book mechanic today`,
    }));

    dueSoon.forEach(v => alerts.push({
      type: 'warning',
      icon: 'wrench',
      message: `${v.rego} service due in ${Math.round(v.kmToService).toLocaleString()} km — book this week`,
    }));

    expiredLics.forEach(l => alerts.push({
      type: 'danger',
      icon: 'id-card',
      message: `Expired licence: ${l.renter} (${l.rego}) expired ${l.expiry} — renter must not drive`,
    }));

    expiringSoonLics.slice(0, 5).forEach(l => alerts.push({
      type: 'warning',
      icon: 'id-card',
      message: `Licence expiring soon: ${l.renter} (${l.rego}) — expires ${l.expiry}`,
    }));

    inRepairs.forEach(v => alerts.push({
      type: 'warning',
      icon: 'truck',
      message: `${v.rego} in repairs — ${v.notes}`,
    }));

    if (totalNR > 5000) alerts.push({
      type: 'danger',
      icon: 'dollar',
      message: `$${totalNR.toLocaleString()} damage not yet recovered across ${inProgressDmg.length} cases`,
    });

    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      revenue: {
        weeklyTotal,
        thuTotal,
        sunTotal,
        activeRenters: activeRenters.length,
        totalRenters: allRenters.filter(r => r.renter).length,
      },
      fleet: {
        thuRenters,
        sunRenters,
        inRepairs: inRepairs.map(r => ({ rego: r.rego, notes: r.notes })),
        spares: spares.map(r => ({ rego: r.rego, notes: r.notes })),
      },
      service: {
        all: serviceData,
        overdue,
        dueSoon,
        overdueCount: overdue.length,
        dueSoonCount: dueSoon.length,
      },
      licences: {
        all: licData,
        expired: expiredLics,
        expiringSoon: expiringSoonLics,
        expiredCount: expiredLics.length,
        expiringSoonCount: expiringSoonLics.length,
      },
      damage: {
        all: dmgData,
        inProgress: inProgressDmg,
        totalNR,
        totalRecovered,
        inProgressCount: inProgressDmg.length,
      },
      alerts,
    });

  } catch (err) {
    console.error('Data fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
