// ALMA — App root: state, navigation, player state machine, countdown + real audio
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#4839F4",
  "mandalaMotion": true
}/*EDITMODE-END*/;

const ACCENTS = ['#4839F4', 'oklch(0.62 0.19 265)', 'oklch(0.64 0.16 195)', 'oklch(0.64 0.17 350)', 'oklch(0.68 0.15 70)'];

// ── Audio engine ────────────────────────────────────────────────────────────
function useAudioEngine() {
  const mainRef = useRefA(null);
  const layerRef = useRefA(null);

  const getMain = () => {
    if (!mainRef.current) { mainRef.current = new Audio(); mainRef.current.loop = true; mainRef.current.volume = 0.85; }
    return mainRef.current;
  };
  const getLayer = () => {
    if (!layerRef.current) { layerRef.current = new Audio(); layerRef.current.loop = true; layerRef.current.volume = 0.45; }
    return layerRef.current;
  };

  const play = (mainSrc, layerSrc) => {
    if (mainSrc) {
      const m = getMain();
      const abs = new URL(mainSrc, location.href).href;
      if (m.src !== abs) { m.src = mainSrc; }
      m.play().catch(() => {});
    }
    if (layerSrc !== undefined) {
      if (!layerSrc) {
        layerRef.current?.pause();
      } else {
        const l = getLayer();
        const abs = new URL(layerSrc, location.href).href;
        if (l.src !== abs) { l.src = layerSrc; }
        l.play().catch(() => {});
      }
    }
  };

  const pause = () => { mainRef.current?.pause(); layerRef.current?.pause(); };

  const stop = () => {
    if (mainRef.current) { mainRef.current.pause(); mainRef.current.src = ''; }
    if (layerRef.current) { layerRef.current.pause(); layerRef.current.src = ''; }
  };

  const setMuted = (muted) => {
    if (mainRef.current) mainRef.current.muted = muted;
    if (layerRef.current) layerRef.current.muted = muted;
  };

  const previewSrc = (src) => {
    const a = new Audio(src);
    a.volume = 0.6;
    a.play().catch(() => {});
    setTimeout(() => a.pause(), 10000);
  };

  return { play, pause, stop, setMuted, previewSrc };
}

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
  const [muted, setMuted] = useStateA(false);
  const [savedFlash, setSavedFlash] = useStateA(false);
  const [sessionSource, setSessionSource] = useStateA('track'); // 'track' | 'ritual' | 'mixer'

  // sanctuary quick-config
  const [configTrack, setConfigTrack] = useStateA(null);
  // mixer working state (lifted so the launch bar can pin at device level)
  const [mixFocus, setMixFocus] = useStateA(null);
  const [mixDur, setMixDur] = useStateA(15);
  const [mixLayer, setMixLayer] = useStateA(null);   // ambient layer (continuous)
  const [mixBell, setMixBell] = useStateA(null);     // session bell (independent)
  const [intervalMin, setIntervalMin] = useStateA(5);

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

  const audio = useAudioEngine();

  useEffectA(() => {
    document.querySelector('.alma')?.setAttribute('data-theme', theme);
    localStorage.setItem('alma-theme', theme);
  }, [theme]);

  useEffectA(() => { audio.setMuted(muted); }, [muted]);

  // countdown engine
  useEffectA(() => {
    if (!isPlaying || playerMode === 'closed') return;
    const total = duration * 60;
    const id = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= total) { setIsPlaying(false); audio.pause(); return total; }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, playerMode, duration]);

  // stop audio when player closes
  useEffectA(() => { if (playerMode === 'closed') audio.stop(); }, [playerMode]);

  // intro/outro bell — play when full player opens or session ends
  useEffectA(() => {
    if (playerMode === 'full' && mixBell?.isIntroOutro && mixBell?.audioSrc) {
      const bell = new Audio(mixBell.audioSrc);
      bell.volume = 0.85;
      setTimeout(() => bell.play().catch(() => {}), 600);
    }
  }, [playerMode]);

  useEffectA(() => {
    const total = duration * 60;
    if (elapsed >= total && elapsed > 0 && mixBell?.isIntroOutro && mixBell?.audioSrc) {
      const bell = new Audio(mixBell.audioSrc);
      bell.volume = 0.85;
      bell.play().catch(() => {});
    }
  }, [elapsed]);

  // interval bell — fires each time elapsed crosses a multiple of intervalMin minutes
  useEffectA(() => {
    if (!isPlaying || !mixBell?.isInterval || !mixBell?.audioSrc || elapsed === 0) return;
    const intervalSec = intervalMin * 60;
    if (elapsed % intervalSec === 0) {
      const bell = new Audio(mixBell.audioSrc);
      bell.volume = 0.85;
      bell.play().catch(() => {});
    }
  }, [elapsed]);

  // ── session launch ──
  const beginSession = (tr, dur, layer, source = 'track') => {
    setTrack(layer ? { ...tr, sub: `${tr.sub} + ${layer.name}` } : tr);
    setDuration(dur || tr.dur || 15);
    setElapsed(0);
    setIsPlaying(true);
    setSessionSource(source);
    setPlayerMode('full');
    setConfigTrack(null);
    audio.play(tr.audioSrc, layer?.audioSrc || null);
  };

  const launchRitual = (r) => {
    setTrack({ ...r, sub: r.layers });
    setDuration(r.dur);
    setElapsed(0);
    setIsPlaying(true);
    setSessionSource('ritual');
    setPlayerMode('full');
    audio.play(r.audioSrc, r.layerSrc || null);
  };

  const playFile = (f) => {
    setTrack({ title: f.name, sub: f.meta, grad: f.color || f.grad, audioSrc: f.audioSrc });
    setDuration(15);
    setElapsed(0);
    setIsPlaying(true);
    setSessionSource('track');
    setPlayerMode('full');
    audio.play(f.audioSrc, null);
  };

  // ── sanctuary handlers ──
  const onConfigure = (tr) => setConfigTrack(tr);
  const onAddLayers = (tr) => {
    setConfigTrack(null);
    setMixFocus(tr);
    setTab('mixer');
    fireToast(`${tr.title} loaded into the Mixer`);
  };
  const onPreview = (tr) => {
    fireToast(`Pre-listening ${tr.title}…`);
    if (tr.audioSrc) audio.previewSrc(tr.audioSrc);
  };
  const onLoad = (tr) => {
    if (loadedIds.includes(tr.id) || loadingId) return;
    setLoadingId(tr.id);
    setTimeout(() => {
      setLoadingId(null);
      setLoadedIds(ids => [...ids, tr.id]);
      setRawAudio(ra => ra.length < 5 ? [...ra, { id: 'l-' + tr.id, name: tr.title, meta: `${tr.dur} min · loaded`, color: 'seaish', icon: 'music', grad: tr.grad, audioSrc: tr.audioSrc, pinned: false }] : ra);
      fireToast(`${tr.title} loaded to your Vault`);
    }, 1500);
  };

  // ── player handlers ──
  const togglePlay = () => {
    setIsPlaying(p => { if (p) { audio.pause(); } else { audio.play(track?.audioSrc); } return !p; });
  };
  const collapse = () => setPlayerMode('mini');
  const expand = () => setPlayerMode('full');
  const seek = (sec) => setElapsed(Math.round(sec));
  const saveRitual = () => {
    if (!track) return;
    setSavedFlash(true);
    setRituals(rs => {
      const name = `${track.title} Ritual`;
      if (rs.some(r => r.title === name)) return rs;
      return [{ id: 'sr-' + Date.now(), title: name, layers: track.sub || 'Solo track', dur: duration, grad: track.grad, audioSrc: track.audioSrc }, ...rs];
    });
    fireToast('Saved to your Rituals');
    setTimeout(() => setSavedFlash(false), 1800);
  };

  // ── mixer handlers ──
  const onPreviewMix = () => {};

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
              theme={theme} onToggleTheme={() => setTheme(tr => tr === 'moon' ? 'sun' : 'moon')}
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
              bell={mixBell} setBell={setMixBell}
              intervalMin={intervalMin} setIntervalMin={setIntervalMin}
              tracks={MASTER_TRACKS} onToast={fireToast}
              onPreviewLayer={() => {}}
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
            focus={mixFocus} dur={mixDur} layer={mixLayer} bell={mixBell}
            raised={playerMode === 'mini'}
            onBegin={beginSession} onPreviewMix={onPreviewMix}
          />
        )}

        {/* mini-player (above tab bar) */}
        <MiniPlayer
          track={track} duration={duration} elapsed={elapsed} isPlaying={isPlaying}
          mode={playerMode} onExpand={expand} onTogglePlay={togglePlay}
          onClose={() => { audio.stop(); setPlayerMode('closed'); }}
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
          muted={muted} mode={playerMode} savedFlash={savedFlash} motion={t.mandalaMotion}
          canSaveRitual={sessionSource === 'mixer'}
          onTogglePlay={togglePlay} onCollapse={collapse} onSeek={seek}
          onCustomize={() => {
            if (!track) return;
            const master = MASTER_TRACKS.find(t => t.audioSrc === track.audioSrc);
            if (master) setMixFocus(master);
            setMixDur(duration);
            setPlayerMode('mini');
            setTab('mixer');
          }}
          onToggleMute={() => setMuted(m => !m)}
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
