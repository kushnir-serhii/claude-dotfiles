// ALMA — Profile screen
const {
  useState: useStateProf,
  useEffect: useEffectProf,
  useRef: useRefProf,
} = React;

function fmtWeekMin(total) {
  if (total <= 0) return "0m";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function fmtDayMin(min) {
  if (!min) return "—";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function streakOpacity(min) {
  if (!min) return 0.08;
  if (min < 10) return 0.22;
  if (min < 20) return 0.45;
  if (min < 45) return 0.7;
  return 1;
}

function Profile({
  userName,
  onSetName,
  goalMin,
  onSetGoal,
  weeklyGoalMin,
  onSetWeeklyGoal,
  weekData,
  onToast,
  onLogout,
  onDeleteAccount,
  onOpenStats,
}) {
  const [editingName, setEditingName] = useStateProf(false);
  const [nameInput, setNameInput] = useStateProf(userName);
  const [showGoalPicker, setShowGoalPicker] = useStateProf(false);
  const [showWeeklyGoalPicker, setShowWeeklyGoalPicker] = useStateProf(false);
  const [confirmDelete, setConfirmDelete] = useStateProf(false);
  const nameRef = useRefProf(null);
  const WEEKLY_GOAL_OPTIONS = [30, 60, 90, 120, 180];

  useEffectProf(() => {
    if (editingName) nameRef.current?.focus();
  }, [editingName]);

  const activeDays = (weekData || WEEK_SESSION_DATA).filter(
    (d) => d.min > 0,
  ).length;
  const data = weekData || WEEK_SESSION_DATA;
  const totalMin = data.reduce((s, d) => s + d.min, 0);
  // lotus_1 (Mon) … lotus_7 (Sun) — image number = stage title index
  const todayLotus = (() => {
    const d = new Date().getDay();
    return d === 0 ? 7 : d;
  })();
  const heroImg = `alma/img/lotus/lotus_${todayLotus}.webp`;
  const progState = PROGRESS_STATES[todayLotus - 1];

  const commitName = () => {
    const trimmed = nameInput.trim() || "Your Name";
    setNameInput(trimmed);
    onSetName(trimmed);
    setEditingName(false);
  };

  const GOAL_OPTIONS = [5, 10, 15, 20, 30];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        paddingBottom: 100,
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 60,
          gap: 14,
        }}
      >
        {/* square image */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 28,
            flexShrink: 0,
            overflow: "hidden",
            boxShadow: "0 16px 48px -8px rgba(0,0,0,0.45)",
            animation: "breathe 4s ease-in-out infinite",
          }}
        >
          <img
            src={heroImg}
            alt={progState.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
        {/* state text below the image */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: -0.3,
            }}
          >
            {progState.name}
          </div>
          <div
            style={{ fontSize: 13, color: "var(--text-2)", letterSpacing: 0.2 }}
          >
            {progState.sub}
          </div>
          <div
            style={{
              marginTop: 4,
              paddingInline: 12,
              paddingBlock: 4,
              borderRadius: 20,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-3)",
              letterSpacing: 0.4,
            }}
          >
            {activeDays === 0
              ? "Start your journey"
              : `Day ${activeDays} · ${activeDays}-day streak`}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingTop: 20,
        }}
      >
        {/* ── Weekly stats card ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 20,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* total time */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: -1,
              }}
            >
              {fmtWeekMin(totalMin)}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-3)",
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              This week
            </span>
          </div>

          {/* 7-day streak */}
          <div
            style={{ display: "flex", gap: 6, justifyContent: "space-between" }}
          >
            {data.map((d, i) => {
              const opacity = streakOpacity(d.min);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: 8,
                      background: `color-mix(in srgb, var(--accent) ${Math.round(opacity * 100)}%, var(--surface-2))`,
                      border: "1px solid var(--hairline)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-3)",
                        letterSpacing: 0.3,
                      }}
                    >
                      {d.day}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--text-3)",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtDayMin(d.min)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* weekly goal progress bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.8 }}>
                Weekly goal
              </span>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                {fmtWeekMin(totalMin)} / {fmtWeekMin(weeklyGoalMin)}
              </span>
            </div>
            <ProgressBar value={totalMin} max={weeklyGoalMin} />
          </div>
        </div>

        {/* ── Account section ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* Name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--accent-soft)",
                border: "1px solid var(--hairline-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconUser size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 2,
                }}
              >
                Name
              </div>
              {editingName ? (
                <input
                  ref={nameRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={commitName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitName();
                    if (e.key === "Escape") {
                      setNameInput(userName);
                      setEditingName(false);
                    }
                  }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--text)",
                    fontFamily: "var(--font)",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userName}
                </div>
              )}
            </div>
            <button
              className="press"
              onClick={() => setEditingName(true)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                color: "var(--text-3)",
                flexShrink: 0,
              }}
            >
              <IconEdit size={15} />
            </button>
          </div>

          {/* Goal row */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconTarget size={18} style={{ color: "var(--text-2)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-3)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 2,
                  }}
                >
                  Daily Goal
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {goalMin} min / day
                </div>
              </div>
              <button
                className="press"
                onClick={() => setShowGoalPicker((p) => !p)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline)",
                  color: "var(--text-3)",
                  flexShrink: 0,
                }}
              >
                <IconEdit size={15} />
              </button>
            </div>
            {showGoalPicker && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {GOAL_OPTIONS.map((opt) => {
                  const active = goalMin === opt;
                  return (
                    <button
                      key={opt}
                      className="press"
                      onClick={() => {
                        onSetGoal(opt);
                        setShowGoalPicker(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 12,
                        background: active ? "var(--text)" : "var(--surface-2)",
                        color: active ? "var(--bg-0)" : "var(--text-2)",
                        border: active ? "none" : "1px solid var(--hairline)",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {opt}m
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weekly goal row */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--hairline-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconTarget size={18} style={{ color: "var(--text-2)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Weekly Goal</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}>{fmtWeekMin(weeklyGoalMin)} / week</div>
              </div>
              <button className="press" onClick={() => setShowWeeklyGoalPicker((p) => !p)} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", border: "1px solid var(--hairline)", color: "var(--text-3)", flexShrink: 0 }}>
                <IconEdit size={15} />
              </button>
            </div>
            {showWeeklyGoalPicker && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {WEEKLY_GOAL_OPTIONS.map((opt) => {
                  const active = weeklyGoalMin === opt;
                  return (
                    <button key={opt} className="press" onClick={() => { onSetWeeklyGoal(opt); setShowWeeklyGoalPicker(false); }} style={{ flex: 1, padding: "9px 0", borderRadius: 12, background: active ? "var(--text)" : "var(--surface-2)", color: active ? "var(--bg-0)" : "var(--text-2)", border: active ? "none" : "1px solid var(--hairline)", fontSize: 12, fontWeight: 600 }}>
                      {fmtWeekMin(opt)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Statistics link row */}
          <div style={{ borderBottom: "1px solid var(--hairline)" }}>
            <button className="press" onClick={onOpenStats} style={{ width: "100%", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, background: "transparent" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--hairline-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconBarChart size={18} style={{ color: "var(--text-2)" }} />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Progress</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}>Statistics</div>
              </div>
              <IconChevRight size={18} style={{ color: "var(--text-3)", flexShrink: 0 }} />
            </button>
          </div>

          {/* Plan row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--surface-2)",
                border: "1px solid var(--hairline-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconSparkles size={18} style={{ color: "var(--text-2)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 2,
                }}
              >
                Plan
              </div>
              <div
                style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}
              >
                Free
              </div>
            </div>
            <button
              className="press"
              onClick={() => onToast("Upgrade coming soon")}
              style={{
                paddingInline: 14,
                paddingBlock: 7,
                borderRadius: 20,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
              }}
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* ── Account actions ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <button
            className="press"
            onClick={() => {
              onLogout();
            }}
            style={{
              width: "100%",
              padding: "15px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderBottom: "1px solid var(--hairline)",
              background: "transparent",
              color: "var(--text-2)",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 500 }}>Log Out</span>
          </button>

          {!confirmDelete ? (
            <button
              className="press"
              onClick={() => setConfirmDelete(true)}
              style={{
                width: "100%",
                padding: "15px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "transparent",
                color: "#E0534A",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                Delete Account
              </span>
            </button>
          ) : (
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 13, color: "var(--text-2)" }}>
                Are you sure? This cannot be undone.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="press"
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    background: "var(--surface-2)",
                    color: "var(--text-2)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="press"
                  onClick={() => {
                    onDeleteAccount();
                    setConfirmDelete(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#E0534A22",
                    color: "#E0534A",
                    border: "1px solid #E0534A44",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Version ── */}
        <div style={{ textAlign: "center", paddingTop: 4 }}>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>
            ALMA · v0.1
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Profile });
