// Web Audio API Actual Song Synthesizer and Player
class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private songEnabled: boolean = true;
  private currentSong: number = 0;
  private currentInterval: any = null;

  // Real, recognizable song structures using chord progressions, distinct melodies, and rhythmic bass
  private songs = [
    { 
      id: 0, 
      name: 'Sky High - Avicii Inspired Melody', 
      chords: [[329.63, 392, 523.25], [261.63, 329.63, 392], [293.66, 349.23, 440], [196.00, 246.94, 293.66]], // C G Am F
      melody: [523.25, 493.88, 523.25, 587.33, 523.25, 392, 329.63, 261.63],
      speed: 130
    },
    { 
      id: 1, 
      name: 'Midnight Drive - Synthwave Classic', 
      chords: [[220.00, 261.63, 329.63], [164.81, 196, 246.94], [174.61, 220, 261.63], [196, 246.94, 293.66]], // Am Em F G
      melody: [440, 392, 329.63, 293.66, 329.63, 392, 440, 523.25],
      speed: 120
    },
    { 
      id: 2, 
      name: 'Fly Away - Electro Pop Anthem', 
      chords: [[196, 246.94, 293.66], [293.66, 349.23, 440], [220, 261.63, 329.63], [261.63, 329.63, 392]], // G D Am C
      melody: [587.33, 523.25, 493.88, 392, 587.33, 523.25, 440, 329.63],
      speed: 110
    },
    { 
      id: 3, 
      name: 'Golden Hour - Chill House Flow', 
      chords: [[261.63, 329.63, 440], [293.66, 349.23, 523.25], [329.63, 392, 587.33], [349.23, 440, 659.25]], // Em7 F G Am
      melody: [329.63, 349.23, 392, 523.25, 392, 349.23, 329.63, 293.66],
      speed: 140
    },
    { 
      id: 4, 
      name: 'Galactic Horizon - Cosmic Ambient Symphony', 
      chords: [[220.00, 329.63, 440], [261.63, 392, 523.25], [293.66, 440, 587.33], [164.81, 246.94, 329.63]], // Am C D Em
      melody: [659.25, 587.33, 440, 392, 659.25, 523.25, 329.63, 440],
      speed: 160
    }
  ];

  constructor() {}

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getSongs() {
    return this.songs;
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute && this.ctx) {
      this.ctx.suspend();
    } else if (!mute && this.ctx) {
      this.ctx.resume();
    }
  }

  public setSongEnabled(enabled: boolean) {
    this.songEnabled = enabled;
    if (!enabled) {
      this.stop();
    } else {
      this.playSong(this.currentSong);
    }
  }

  public playSong(songIndex: number) {
    this.currentSong = songIndex;
    this.stop();
    if (!this.songEnabled || this.isMuted) return;

    this.initContext();
    const song = this.songs[songIndex];

    let beat = 0;
    this.currentInterval = setInterval(() => {
      if (!this.ctx || this.isMuted || !this.songEnabled) return;

      const currentChord = song.chords[Math.floor(beat / 8) % song.chords.length];
      const melodyNote = song.melody[beat % song.melody.length];

      // Play bassline & chords smoothly using high durations
      currentChord.forEach((freq) => {
        this.playTone(freq, 0.4, 0.02, 'triangle');
      });

      // Melodies using higher frequency and shorter snappy tones
      this.playTone(melodyNote, 0.25, 0.035, 'sine');

      // Kick drum simulation on downbeats
      if (beat % 4 === 0) {
        this.playDrum(120, 0.08, 0.06);
      }

      // Snare drum simulation on 2nd and 4th beats
      if (beat % 4 === 2) {
        this.playNoise(0.1, 0.015);
      }

      beat++;
    }, (60000 / song.speed) / 2);
  }

  public playTone(freq: number, duration: number = 0.25, volume: number = 0.04, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Tone creation issue:', e);
    }
  }

  private playDrum(startFreq: number, duration: number = 0.1, volume: number = 0.06) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  private playNoise(duration: number = 0.1, volume: number = 0.02) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Noise synthesizer using simple buffer node
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1100;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  public stop() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }
}

export const audioManager = new AudioManager();
