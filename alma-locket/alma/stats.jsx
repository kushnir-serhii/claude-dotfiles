// ALMA — Statistics screen

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ height: 6, borderRadius: 3, background: 'var(--surface-2)', width: '100%', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, borderRadius: 3, minWidth: pct > 0 ? 6 : 0,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-press))',
        transition: 'width 700ms var(--ease)',
      }} />
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 20, padding: '16px 18px',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.5 }}>
        {value}
      </div>
    </div>
  );
}

function Stats({ onBack, weeklyGoalMin, weekData }) {
  const thisWeekMin = (weekData || WEEK_SESSION_DATA).reduce((s, d) => s + d.min, 0);
  const avgMin = Math.round(LIFETIME_STATS.totalMin / LIFETIME_STATS.totalSessions);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'var(--bg-0)', display: 'flex', flexDirection: 'column',
      animation: 'almaFade 250ms var(--ease)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '60px 20px 0',
      }}>
        <button className="press" onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-2)', border: '1px solid var(--hairline)', color: 'var(--text-2)',
        }}>
          <IconChevLeft size={20} />
        </button>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.3 }}>
          Statistics
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 20px 100px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>

        {/* 2×2 summary tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <StatTile label="Total Time"   value={fmtWeekMin(LIFETIME_STATS.totalMin)} />
          <StatTile label="Sessions"     value={String(LIFETIME_STATS.totalSessions)} />
          <StatTile label="Avg Session"  value={fmtWeekMin(avgMin)} />
          <StatTile label="This Week"    value={fmtWeekMin(thisWeekMin)} />
        </div>

        {/* Current week progress */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 20, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Weekly Goal</span>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {fmtWeekMin(thisWeekMin)} / {fmtWeekMin(weeklyGoalMin)}
            </span>
          </div>
          <ProgressBar value={thisWeekMin} max={weeklyGoalMin} />
          <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>
            {weeklyGoalMin > 0 ? `${Math.min(100, Math.round(thisWeekMin / weeklyGoalMin * 100))}% complete` : ''}
          </div>
        </div>

        {/* Past weeks */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 20, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Past Weeks</div>
          {WEEKLY_HISTORY.map((w, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{w.week}</span>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{fmtWeekMin(w.min)}</span>
              </div>
              <ProgressBar value={w.min} max={weeklyGoalMin} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { Stats, StatTile, ProgressBar });
