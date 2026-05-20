'use client';
import { useState, useEffect, useCallback } from 'react';

const Icon = ({ name, size = 16 }) => {
  const icons = {
    truck: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H3m16.5 0h-.75m-12.75 0h9m-9-9h9M3 7.5h18M3 12h2.25m13.5 0H21m-9 4.5V7.5" />,
    wrench: <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />,
    'id-card': <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />,
    dollar: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      {icons[name]}
    </svg>
  );
};

const fmt = (n) => '$' + Math.round(n || 0).toLocaleString('en-AU');
const fmtN = (n) => Math.round(n || 0).toLocaleString('en-AU');

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) { sessionStorage.setItem('xpdx_pw', pw); onLogin(pw); }
    else setErr('Incorrect password.');
    setLoading(false);
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-badge">🚐</div>
          <div><div className="login-title">XPDX Dashboard</div><div className="login-sub">Operations Portal</div></div>
        </div>
        <form onSubmit={submit}>
          <label className="login-label">Password</label>
          <input className="login-input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter password" autoFocus />
          {err && <div className="login-error">{err}</div>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Checking...' : 'Sign In →'}</button>
        </form>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, badge, badgeType = 'gray' }) {
  return (
    <div className="kpi-card">
      {badge && <span className={`kpi-badge badge-${badgeType}`}>{badge}</span>}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

function VanRow({ van }) {
  const isRepair = van.notes?.toLowerCase().includes('repair') || van.notes?.toLowerCase().includes('engine swap');
  const isSpare = van.notes?.toLowerCase().includes('spare van');
  const hasRenter = van.amount > 0 && van.renter;
  const pillClass = isRepair ? 'pill-amber' : isSpare ? 'pill-gray' : hasRenter ? 'pill-teal' : 'pill-green';
  const pillText = isRepair ? 'Repairs' : isSpare ? 'Spare' : hasRenter ? 'Rented' : 'Available';
  return (
    <div className="van-row">
      <span className="van-rego">{van.rego}</span>
      <span className="van-type">{van.vehicle}</span>
      <span className={`pill ${pillClass}`}>{pillText}</span>
      <span className="van-name">{van.renter || (isRepair ? van.notes?.slice(0, 30) : '—')}</span>
      <span className="van-amt">{van.amount ? fmt(van.amount) : '—'}</span>
    </div>
  );
}

function FleetPanel({ title, renters }) {
  const [search, setSearch] = useState('');
  const filtered = renters.filter(v => v.rego?.toLowerCase().includes(search.toLowerCase()) || v.renter?.toLowerCase().includes(search.toLowerCase()));
  const total = renters.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  return (
    <div className="panel">
      <div className="panel-title"><Icon name="truck" /> {title}</div>
      <input className="search-input" placeholder="Search rego or name..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="scroll-list">{filtered.map((v, i) => <VanRow key={i} van={v} />)}</div>
      <div className="total-row"><span className="total-label">Weekly total</span><span className="total-value row-pos">{fmt(total)}</span></div>
    </div>
  );
}

// ── NEW: Full Van Directory ────────────────────────────────────────────────────
function VanDirectory({ allRenters }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = allRenters.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      v.rego?.toLowerCase().includes(q) ||
      v.renter?.toLowerCase().includes(q) ||
      v.vehicle?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      v.paymentMethod?.toLowerCase().includes(q);
    const isRepair = v.notes?.toLowerCase().includes('repair') || v.notes?.toLowerCase().includes('engine swap');
    const isSpare = v.notes?.toLowerCase().includes('spare van');
    const isActive = v.amount > 0 && v.renter;
    const matchFilter =
      filter === 'all' ||
      (filter === 'thursday' && v.paymentDay?.toLowerCase() === 'thursday') ||
      (filter === 'sunday' && v.paymentDay?.toLowerCase() === 'sunday') ||
      (filter === 'repairs' && isRepair) ||
      (filter === 'available' && !isActive && !isRepair && !isSpare);
    return matchSearch && matchFilter;
  });

  return (
    <div className="full-panel" style={{ marginBottom: '1.5rem' }}>
      <div className="panel-title"><Icon name="search" /> Van & Renter Directory</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}><Icon name="search" size={14} /></div>
          <input className="search-input" style={{ paddingLeft: 30, marginBottom: 0 }} placeholder="Search rego, name, phone, payment method..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[['all', 'All'], ['thursday', 'Thursday'], ['sunday', 'Sunday'], ['repairs', 'In Repairs'], ['available', 'Available']].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid', fontSize: 12, cursor: 'pointer', background: filter === k ? 'var(--teal)' : 'transparent', color: filter === k ? 'white' : 'var(--text-2)', borderColor: filter === k ? 'var(--teal)' : 'var(--border-strong)' }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{filtered.length} van{filtered.length !== 1 ? 's' : ''} shown</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {filtered.map((v, i) => {
          const isOpen = expanded === i;
          const isRepair = v.notes?.toLowerCase().includes('repair') || v.notes?.toLowerCase().includes('engine swap');
          const isSpare = v.notes?.toLowerCase().includes('spare van');
          const hasRenter = v.amount > 0 && v.renter;
          const pillClass = isRepair ? 'pill-amber' : isSpare ? 'pill-gray' : hasRenter ? 'pill-teal' : 'pill-green';
          const pillText = isRepair ? 'In Repairs' : isSpare ? 'Spare' : hasRenter ? 'Rented' : 'Available';
          return (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', overflow: 'hidden' }}>
              <div onClick={() => setExpanded(isOpen ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', cursor: 'pointer' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 600, width: 68, flexShrink: 0, color: 'var(--text)' }}>{v.rego}</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)', width: 74, flexShrink: 0 }}>{v.vehicle}</span>
                <span className={`pill ${pillClass}`}>{pillText}</span>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.renter || '—'}</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)', flexShrink: 0 }}>{v.paymentDay || ''}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', flexShrink: 0, minWidth: 52, textAlign: 'right' }}>{v.amount ? fmt(v.amount) : '—'}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 4 }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, paddingTop: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Contact</div>
                      {v.phone && <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Icon name="phone" size={12} /><a href={`tel:${v.phone}`} style={{ color: 'var(--teal)', textDecoration: 'none' }}>{v.phone}</a></div>}
                      {v.email && <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="mail" size={12} /><a href={`mailto:${v.email}`} style={{ color: 'var(--teal)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.email}</a></div>}
                      {!v.phone && !v.email && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No contact info</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Payment</div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{v.paymentMethod || '—'} · {v.paymentDay || '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Weekly rent: <strong>{v.amount ? fmt(v.amount) : '—'}</strong></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Licence Expiry</div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{v.licExpiry || '—'}</div>
                      {v.driverLicExpiry && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Driver lic: {v.driverLicExpiry}</div>}
                    </div>
                    {v.notes && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Notes</div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' }}>{v.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-3)', padding: '12px 0' }}>No vans match your search.</div>}
      </div>
    </div>
  );
}

// ── NEW: Payment Reconciliation ───────────────────────────────────────────────
function PaymentReconciliation({ allRenters }) {
  const [payDay, setPayDay] = useState('thursday');
  const [collected, setCollected] = useState({});
  const [search, setSearch] = useState('');

  const renters = allRenters.filter(r =>
    r.amount > 0 && r.renter && r.paymentDay?.toLowerCase() === payDay &&
    (r.renter.toLowerCase().includes(search.toLowerCase()) || r.rego.toLowerCase().includes(search.toLowerCase()))
  );

  const expectedTotal = renters.reduce((s, r) => s + r.amount, 0);
  const collectedTotal = renters.reduce((s, r) => s + (parseFloat(collected[r.rego]) || 0), 0);
  const variance = collectedTotal - expectedTotal;
  const paidCount = renters.filter(r => collected[r.rego] && parseFloat(collected[r.rego]) >= r.amount).length;

  const setCollectedVal = (rego, val) => setCollected(prev => ({ ...prev, [rego]: val }));
  const markAllPaid = () => {
    const updates = {};
    renters.forEach(r => { updates[r.rego] = r.amount.toString(); });
    setCollected(prev => ({ ...prev, ...updates }));
  };
  const clearAll = () => {
    const updates = {};
    renters.forEach(r => { updates[r.rego] = ''; });
    setCollected(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="full-panel" style={{ marginBottom: '1.5rem' }}>
      <div className="panel-title"><Icon name="dollar" /> Payment Reconciliation</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="tabs" style={{ margin: 0, border: 'none' }}>
          {[['thursday', 'Thursday'], ['sunday', 'Sunday']].map(([k, l]) => (
            <button key={k} className={`tab${payDay === k ? ' active' : ''}`} onClick={() => setPayDay(k)}>{l}</button>
          ))}
        </div>
        <input className="search-input" style={{ flex: 1, minWidth: 160, marginBottom: 0 }} placeholder="Search renter or rego..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={markAllPaid} style={{ padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--teal)', fontSize: 12, cursor: 'pointer', background: 'var(--teal-l)', color: 'var(--teal-d)' }}>Mark all paid</button>
        <button onClick={clearAll} style={{ padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border-strong)', fontSize: 12, cursor: 'pointer', background: 'transparent', color: 'var(--text-2)' }}>Clear</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 14 }}>
        <div className="kpi-card" style={{ padding: '10px 12px' }}>
          <div className="kpi-label">Expected</div>
          <div className="kpi-value" style={{ fontSize: 18 }}>{fmt(expectedTotal)}</div>
          <div className="kpi-sub">{renters.length} renters</div>
        </div>
        <div className="kpi-card" style={{ padding: '10px 12px' }}>
          <div className="kpi-label">Collected</div>
          <div className="kpi-value" style={{ fontSize: 18, color: 'var(--teal)' }}>{fmt(collectedTotal)}</div>
          <div className="kpi-sub">{paidCount} paid</div>
        </div>
        <div className="kpi-card" style={{ padding: '10px 12px' }}>
          <div className="kpi-label">Variance</div>
          <div className="kpi-value" style={{ fontSize: 18, color: variance >= 0 ? 'var(--teal)' : 'var(--coral)' }}>{variance >= 0 ? '+' : ''}{fmt(variance)}</div>
          <div className="kpi-sub">{renters.length - paidCount} outstanding</div>
        </div>
        <div className="kpi-card" style={{ padding: '10px 12px' }}>
          <div className="kpi-label">Collection rate</div>
          <div className="kpi-value" style={{ fontSize: 18 }}>{expectedTotal > 0 ? Math.round(collectedTotal / expectedTotal * 100) : 0}%</div>
          <div className="kpi-sub">of expected</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 90px 90px 60px', gap: 0, fontSize: 11, color: 'var(--text-3)', padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>
        <div>Rego</div><div>Renter</div><div>Method</div><div style={{ textAlign: 'right' }}>Expected</div><div style={{ textAlign: 'right' }}>Collected</div><div style={{ textAlign: 'center' }}>Status</div>
      </div>

      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {renters.map((r, i) => {
          const col = parseFloat(collected[r.rego]) || 0;
          const diff = col - r.amount;
          const isPaid = col >= r.amount;
          const isOver = col > r.amount;
          const isPartial = col > 0 && col < r.amount;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 90px 90px 60px', gap: 0, padding: '7px 8px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: isPaid ? 'rgba(29,158,117,0.03)' : 'transparent' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 600 }}>{r.rego}</div>
              <div style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{r.renter}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{r.paymentMethod?.replace('Direct Debit', 'DD').replace('Transfer', 'TRF') || '—'}</div>
              <div style={{ fontSize: 12, fontWeight: 500, textAlign: 'right' }}>{fmt(r.amount)}</div>
              <div style={{ textAlign: 'right' }}>
                <input
                  type="number"
                  value={collected[r.rego] || ''}
                  onChange={e => setCollectedVal(r.rego, e.target.value)}
                  placeholder={r.amount.toString()}
                  style={{ width: 80, padding: '3px 6px', border: '1px solid', borderColor: isPaid ? 'var(--teal)' : isPartial ? 'var(--amber)' : 'var(--border-strong)', borderRadius: 6, fontSize: 12, textAlign: 'right', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                {isPaid && !isOver && <span style={{ color: 'var(--teal)' }}><Icon name="check" size={14} /></span>}
                {isOver && <span className="pill pill-blue" style={{ fontSize: 9 }}>+{fmt(diff)}</span>}
                {isPartial && <span className="pill pill-amber" style={{ fontSize: 9 }}>{fmt(r.amount - col)} short</span>}
                {!col && <span style={{ color: 'var(--text-3)', fontSize: 11 }}>—</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 10, fontStyle: 'italic' }}>
        💡 Note: Type the collected amount next to each renter. Connect Stripe API to auto-fill this column.
      </div>
    </div>
  );
}

function ServicePanel({ data }) {
  const [tab, setTab] = useState('urgent');
  const urgent = data.filter(v => v.status === 'OVERDUE' || v.status === 'DUE SOON');
  const ok = data.filter(v => v.status === 'OK');
  const list = tab === 'urgent' ? urgent : tab === 'ok' ? ok : data;
  return (
    <div className="full-panel">
      <div className="panel-title"><Icon name="wrench" /> Service Status</div>
      <div className="tabs">
        {[['urgent', `Urgent (${urgent.length})`], ['all', `All (${data.length})`], ['ok', `OK (${ok.length})`]].map(([k, l]) => (
          <button key={k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="scroll-list-sm">
        {list.map((v, i) => {
          const over = v.kmToService < 0;
          const soon = v.status === 'DUE SOON';
          const pillClass = over ? 'pill-red' : soon ? 'pill-amber' : 'pill-green';
          const kmText = !v.kmToService ? '—' : over ? `${fmtN(Math.abs(v.kmToService))} km OVER` : `${fmtN(v.kmToService)} km to go`;
          return (
            <div key={i} className="row">
              <div>
                <div className="row-value" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>{v.rego}</div>
                <div className="row-label">{v.currentOdo ? fmtN(v.currentOdo) + ' km current' : '—'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="row-value">{v.nextServiceAt ? fmtN(v.nextServiceAt) + ' km' : '—'}</div>
                <span className={`pill ${pillClass}`} style={{ marginTop: 3, display: 'inline-block' }}>{v.status} · {kmText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DamagePanel({ data }) {
  const inProgress = data.filter(r => r.paid?.toLowerCase().includes('progress') || (!r.paid && r.amountNR > 0));
  const totalNR = data.reduce((s, r) => s + r.amountNR, 0);
  return (
    <div className="panel">
      <div className="panel-title"><Icon name="dollar" /> Damage Recovery</div>
      <div className="scroll-list">
        {inProgress.map((d, i) => (
          <div key={i} className="dmg-row">
            <div className="dmg-top">
              <span className="dmg-name">{d.renter} · {d.van}</span>
              {d.amountNR > 0 ? <span className="pill pill-red">{fmt(d.amountNR)} NR</span> : <span className="pill pill-blue">plan active</span>}
            </div>
            <div className="dmg-sub">{d.comments || d.paymentPlan || '—'}</div>
          </div>
        ))}
      </div>
      <div className="total-row">
        <span className="total-label">Not yet recovered</span>
        <span className="total-value row-neg">{fmt(totalNR)}</span>
      </div>
    </div>
  );
}

function LicencePanel({ data }) {
  const alerts = [...data.filter(r => r.status === 'Expired'), ...data.filter(r => r.status === 'Expires Soon')];
  return (
    <div className="panel">
      <div className="panel-title"><Icon name="id-card" /> Driver Licences</div>
      <div className="scroll-list">
        {alerts.map((l, i) => (
          <div key={i} className={`alert ${l.status === 'Expired' ? 'alert-danger' : 'alert-warning'}`}>
            <Icon name="alert" size={14} />
            <div><strong>{l.rego}</strong> — {l.renter}<br /><span style={{ fontSize: 11 }}>{l.status}: {l.expiry}</span></div>
          </div>
        ))}
        {alerts.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-2)', padding: '8px 0' }}>All licences current ✓</div>}
      </div>
    </div>
  );
}

function AlertsPanel({ alerts }) {
  return (
    <div className="full-panel">
      <div className="panel-title"><Icon name="alert" /> Priority Alerts</div>
      {alerts.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>No urgent alerts today ✓</div>}
      {alerts.map((a, i) => (
        <div key={i} className={`alert alert-${a.type}`}>
          <span className="alert-icon"><Icon name={a.icon || 'alert'} size={14} /></span>
          <span>{a.message}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ password, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = useCallback(async () => {
    setRefreshing(true); setError('');
    try {
      const res = await fetch('/api/data', { headers: { 'x-dashboard-password': password } });
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) { setError('Could not load data: ' + e.message); }
    setLoading(false); setRefreshing(false);
  }, [password]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner"></div>
      <div className="loading-text">Loading XPDX data from Google Sheets...</div>
    </div>
  );

  const allRenters = data ? [...(data.fleet.thuRenters || []), ...(data.fleet.sunRenters || [])] : [];

  const navTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'vans', label: 'Van Directory' },
    { key: 'payments', label: 'Payments' },
    { key: 'service', label: 'Service' },
    { key: 'damage', label: 'Damage' },
  ];

  return (
    <div className="dash-wrap">
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-badge">🚐</div>
          <div>
            <div className="topbar-title">XPDX Rentals</div>
            <div className="topbar-sub">Operations Dashboard · Live from Google Sheets</div>
          </div>
        </div>
        <div className="topbar-right">
          {lastUpdated && <span className="last-updated">Updated {lastUpdated}</span>}
          <button className={`refresh-btn${refreshing ? ' spinning' : ''}`} onClick={fetchData}><Icon name="refresh" size={13} /> Refresh</button>
          <button className="logout-btn" onClick={onLogout}>Sign out</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {navTabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 16px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', borderBottom: '2px solid', borderBottomColor: activeTab === t.key ? 'var(--teal)' : 'transparent', color: activeTab === t.key ? 'var(--teal)' : 'var(--text-2)', fontWeight: activeTab === t.key ? 500 : 400, marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>

      {error && <div className="error-banner">⚠ {error}</div>}

      {data && activeTab === 'overview' && <>
        <div className="sec-label">Revenue & Fleet — This Week</div>
        <div className="kpi-grid">
          <KpiCard label="Weekly Revenue" value={fmt(data.revenue.weeklyTotal)} sub={`Thu ${fmt(data.revenue.thuTotal)} · Sun ${fmt(data.revenue.sunTotal)}`} badge="live" badgeType="green" />
          <KpiCard label="Active Renters" value={data.revenue.activeRenters} sub="paying this week" />
          <KpiCard label="Service Overdue" value={data.service.overdueCount} sub="book mechanic now" badge={data.service.overdueCount > 0 ? 'urgent' : 'clear'} badgeType={data.service.overdueCount > 0 ? 'red' : 'green'} />
          <KpiCard label="Service Due Soon" value={data.service.dueSoonCount} sub="book this week" badge={data.service.dueSoonCount > 0 ? 'soon' : 'clear'} badgeType={data.service.dueSoonCount > 0 ? 'amber' : 'green'} />
          <KpiCard label="Expired Licences" value={data.licences.expiredCount} sub="action required" badge={data.licences.expiredCount > 0 ? 'action' : 'clear'} badgeType={data.licences.expiredCount > 0 ? 'red' : 'green'} />
          <KpiCard label="Damage Outstanding" value={fmt(data.damage.totalNR)} sub={`${data.damage.inProgressCount} cases active`} badge={data.damage.totalNR > 0 ? 'chase' : 'clear'} badgeType={data.damage.totalNR > 5000 ? 'red' : 'amber'} />
        </div>
        <AlertsPanel alerts={data.alerts} />
        <div className="two-col">
          <FleetPanel title="Thursday Renters" renters={data.fleet.thuRenters} />
          <FleetPanel title="Sunday Renters" renters={data.fleet.sunRenters} />
        </div>
      </>}

      {data && activeTab === 'vans' && <VanDirectory allRenters={allRenters} />}

      {data && activeTab === 'payments' && <PaymentReconciliation allRenters={allRenters} />}

      {data && activeTab === 'service' && <ServicePanel data={data.service.all} />}

      {data && activeTab === 'damage' && (
        <div className="two-col">
          <LicencePanel data={data.licences.all} />
          <DamagePanel data={data.damage.all} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [password, setPassword] = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem('xpdx_pw') || '' : '');
  const handleLogin = (pw) => setPassword(pw);
  const handleLogout = () => { sessionStorage.removeItem('xpdx_pw'); setPassword(''); };
  if (!password) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard password={password} onLogout={handleLogout} />;
}
