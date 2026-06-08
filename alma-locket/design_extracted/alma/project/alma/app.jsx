// ALMA — App root: state, navigation, player state machine, countdown
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8B5CF6",
  "mandalaMotion": true
}/*EDITMODE-END*/;

const ACCENTS = ['#8B5CF6', 'oklch(0.62 0.19 265)', 'oklch(0.64 0.16 195)', 'oklch(0.64 0.17 350)', 'oklch(0.68 0.15 70)'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [theme, setTheme] = useStateA(() => localStorage.getItem('alma-theme') || 'moon');
  const [tab, setTab] = useStateA('sanctuary');

  // player state machine: 'closed' | 'full' | 'mini'
  const [playerMode, setPlayerMode] = useStateA('closed');
  const [track, setTrack] = useStateA(null);
  const [duration, setDuration] = useStateA(15);
  const [elapsed, setElapsed] = useStateA(0);
  const [isPlaying, setIsPlaying] = useStateA(false);
  const [liked, setLiked] = useStateA(false);
  const [muted, setMuted] = useStateA(false);
  const [savedFlash, setSavedFlash] = useStateA(false);

  // sanctuary quick-config
  const [configTrack, setConfigTrack] = useStateA(null);
  // mixer working state (lifted so the launch bar can pin at device level)
  const [mixFocus, setMixFocus] = useStateA(null);
  const [mixDur, setMixDur] = useStateA(15);
  const [mixLayer, setMixLayer] = useStateA(null);

  // toast
  const [toast, setToast] = useStateA('');
  const toastTimer = useRefA(null);
  const fireToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  };

  // cloud loading
  const [loadingId, setLoadingId] = useStateA(null);
  const [loadedIds, setLoadedIds] = useStateA([]);

  // mutable collections
  const [rituals, setRituals] = useStateA(SAVED_RITUALS);
  const [rawAudio, setRawAudio] = useStateA(RAW_AUDIO);
  const pinned = rawAudio.filter(f => f.pinned);

  // pin file customizer
  const [editingFile, setEditingFile] = useStateA(null);
  const onEditFile = (f) => setEditingFile(f);
  const onSavePinCustomization = (id, patch) => {
    setRawAudio(ra => ra.map(f => f.id === id ? { ...f, ...patch } : f));
    fireToast('Pin updated');
  };

  useEffectA(() => {
    document.querySelector('.alma')?.setAttribute('data-theme', theme);
    localStorage.setItem('alma-theme', theme);
  }, [theme]);

  // countdown engine
  useEffectA(() => {
    if (!isPlaying || playerMode === 'closed') return;
    const total = duration * 60;
    const id = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= total) { setIsPlaying(false); return total; }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, playerMode, duration]);

  // ── session launch ──
  const beginSession = (t, dur, layer) => {
    setTrack(layer ? { ...t, sub: `${t.sub} + ${layer.name}` } : t);
    setDuration(dur || t.dur || 15);
    setElapsed(0);
    setIsPlaying(true);
    setLiked(false);
    setPlayerMode('full');
    setConfigTrack(null);
  };

  const launchRitual = (r) => beginSession({ ...r, sub: r.layers }, r.dur);
  const playFile = (f) => beginSession({ title: f.name, sub: f.meta, grad: f.grad }, 15);

  // ── sanctuary handlers ──
  const onConfigure = (t) => setConfigTrack(t);
  const onAddLayers = (t) => {
    setConfigTrack(null);
    setMixFocus(t);
    setTab('mixer');
    fireToast(`${t.title} loaded into the Mixer`);
  };
  const onPreview = (t) => fireToast(`Pre-listening ${t.title} — 10s snippet`);
  const onLoad = (t) => {
    if (loadedIds.includes(t.id) || loadingId) return;
    setLoadingId(t.id);
    setTimeout(() => {
      setLoadingId(null);
      setLoadedIds(ids => [...ids, t.id]);
      // add into vault raw audio if room
      setRawAudio(ra => ra.length < 5 ? [...ra, { id: 'l-' + t.id, name: t.title, meta: `${t.dur} min · loaded`, grad: t.grad, pinned: false }] : ra);
      fireToast(`${t.title} loaded to your Vault`);
    }, 1500);
  };

  // ── player handlers ──
  const togglePlay = () => setIsPlaying(p => !p);
  const collapse = () => setPlayerMode('mini');
  const expand = () => setPlayerMode('full');
  const seek = (sec) => setElapsed(Math.round(sec));
  const saveRitual = () => {
    if (!track) return;
    setSavedFlash(true);
    setRituals(rs => {
      const name = `${track.title} Ritual`;
      if (rs.some(r => r.title === name)) return rs;
      return [{ id: 'sr-' + Date.now(), title: name, layers: track.sub || 'Solo track', dur: duration, grad: track.grad }, ...rs];
    });
    fireToast('Saved to your Rituals');
    setTimeout(() => setSavedFlash(false), 1800);
  };

  // ── mixer handlers ──
  const onPreviewMix = (focus, layer) => {
    fireToast(layer ? `Pre-listen: ${focus.title} + ${layer.name} — 15s` : `Pre-listen: ${focus.title} — 15s`);
  };

  // ── vault handlers ──
  const renameRitual = (id, name) => setRituals(rs => rs.map(r => r.id === id ? { ...r, title: name } : r));
  const deleteRitual = (id) => setRituals(rs => rs.filter(r => r.id !== id));
  const togglePin = (id) => {
    setRawAudio(ra => ra.map(f => f.id === id ? { ...f, pinned: !f.pinned } : f));
    const f = rawAudio.find(x => x.id === id);
    fireToast(f && f.pinned ? 'Unpinned from Sanctuary' : 'Pinned to Sanctuary');
  };
  const deleteFile = (id) => setRawAudio(ra => ra.filter(f => f.id !== id));

  const dark = theme === 'moon';

  return (
    <IOSDevice dark={dark}>
      <div className="alma" data-theme={theme} style={{ '--accent': t.accent }}>
        <div className="scrollbody" key={tab}>
          {tab === 'sanctuary' && (
            <Sanctuary
              theme={theme} onToggleTheme={() => setTheme(t => t === 'moon' ? 'sun' : 'moon')}
              tracks={MASTER_TRACKS} rituals={rituals} pinned={pinned}
              onConfigure={onConfigure} onPreview={onPreview} onLoad={onLoad}
              loadingId={loadingId} loadedIds={loadedIds}
              onLaunchRitual={launchRitual} onPlayFile={playFile}
              onEditFile={onEditFile} onAddMoreRitual={() => setTab('mixer')}
            />
          )}
          {tab === 'mixer' && (
            <Mixer
              focus={mixFocus} setFocus={setMixFocus} dur={mixDur} setDur={setMixDur}
              layer={mixLayer} setLayer={setMixLayer}
              tracks={MASTER_TRACKS} onToast={fireToast}
            />
          )}
          {tab === 'vault' && (
            <Vault
              rituals={rituals} rawAudio={rawAudio}
              onRename={renameRitual} onDeleteRitual={deleteRitual}
              onTogglePin={togglePin} onDeleteFile={deleteFile} onLaunchRitual={launchRitual}
              onEditFile={onEditFile}
            />
          )}
        </div>

        {/* mixer launch bar (pinned, stacks above mini-player) */}
        {tab === 'mixer' && (
          <MixerActionBar
            focus={mixFocus} dur={mixDur} layer={mixLayer}
            raised={playerMode === 'mini'}
            onBegin={beginSession} onPreviewMix={onPreviewMix}
          />
        )}

        {/* mini-player (above tab bar) */}
        <MiniPlayer
          track={track} duration={duration} elapsed={elapsed} isPlaying={isPlaying}
          mode={playerMode} onExpand={expand} onTogglePlay={togglePlay}
        />

        {/* tab bar */}
        <TabBar active={tab} onChange={setTab} />

        {/* quick-config sheet */}
        <QuickConfigSheet
          track={configTrack} onClose={() => setConfigTrack(null)}
          onBegin={beginSession} onAddLayers={onAddLayers}
        />

        {/* pin file customizer sheet */}
        <PinCustomizerSheet
          file={editingFile} onClose={() => setEditingFile(null)}
          onSave={onSavePinCustomization}
        />

        {/* full player deck */}
        <FullPlayer
          track={track} duration={duration} elapsed={elapsed} isPlaying={isPlaying}
          liked={liked} muted={muted} mode={playerMode} savedFlash={savedFlash} motion={t.mandalaMotion}
          onTogglePlay={togglePlay} onCollapse={collapse} onSeek={seek}
          onToggleLike={() => setLiked(l => !l)} onToggleMute={() => setMuted(m => !m)}
          onSaveRitual={saveRitual}
        />

        {/* toast */}
        <Toast message={toast} />

        {/* tweaks */}
        <TweaksPanel>
          <TweakSection label="Theme" />
          <TweakRadio label="Mode" value={theme} options={['moon', 'sun']} onChange={setTheme} />
          <TweakSection label="Brand" />
          <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={(v) => setTweak('accent', v)} />
          <TweakToggle label="Mandala motion" value={t.mandalaMotion} onChange={(v) => setTweak('mandalaMotion', v)} />
        </TweaksPanel>
      </div>
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
