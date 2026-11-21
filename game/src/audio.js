// Synthesised WebAudio sounds — no audio files, nothing to download. The context
// is created on the first user gesture, so autoplay rules never block it.
export function createAudio() {
  let ctx = null;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext ?? window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch {
      return null;
    }
    return ctx;
  }

  function tone(freq, start, dur, type, gain) {
    const ac = ensure();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, ac.currentTime + start);
    amp.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
    osc.connect(amp);
    amp.connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + dur + 0.05);
  }

  return {
    unlock() {
      ensure();
    },
    found() {
      tone(660, 0, 0.16, 'sine', 0.16);
      tone(880, 0.09, 0.22, 'sine', 0.16);
      tone(1320, 0.18, 0.28, 'triangle', 0.08);
    },
    miss() {
      tone(160, 0, 0.18, 'sawtooth', 0.07);
      tone(110, 0.05, 0.2, 'sawtooth', 0.05);
    },
    hint() {
      tone(520, 0, 0.12, 'triangle', 0.1);
      tone(780, 0.08, 0.16, 'triangle', 0.1);
    },
    roundClear() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.24, 'triangle', 0.12));
    },
    win() {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.12));
    },
    timeUp() {
      [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.12));
    },
  };
}
