// Web Speech API text-to-speech engine with en-GB preference, en-US fallback, and rate controls

export type SpeechRate = 0.75 | 1.0 | 1.25;

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentRate: SpeechRate = 1.0;
  private isSpeakingState: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // 1. Look for British English voice (en-GB)
    const britishVoice = this.voices.find(
      (v) => v.lang === 'en-GB' || v.lang.startsWith('en-GB') || v.name.includes('UK') || v.name.includes('British')
    );
    // 2. Look for US English voice (en-US)
    const usVoice = this.voices.find(
      (v) => v.lang === 'en-US' || v.lang.startsWith('en-US') || v.name.includes('US') || v.name.includes('American')
    );
    // 3. Any English voice
    const anyEnglish = this.voices.find((v) => v.lang.startsWith('en'));

    this.selectedVoice = britishVoice || usVoice || anyEnglish || (this.voices.length > 0 ? this.voices[0] : null);
  }

  public getVoiceName(): string {
    if (!this.selectedVoice) return 'Default Voice';
    return `${this.selectedVoice.name} (${this.selectedVoice.lang})`;
  }

  public setRate(rate: SpeechRate) {
    this.currentRate = rate;
  }

  public getRate(): SpeechRate {
    return this.currentRate;
  }

  public subscribe(cb: (speaking: boolean) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach((cb) => cb(speaking));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public speak(
    text: string,
    options?: {
      rate?: SpeechRate;
      onEnd?: () => void;
      onError?: () => void;
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isSupported() || !this.synth) {
        console.warn('Speech synthesis is not supported on this browser.');
        options?.onError?.();
        resolve();
        return;
      }

      this.stop();

      // Clean punctuation for smooth utterance
      const cleanText = text.replace(/\[.*?\]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options?.rate || this.currentRate;
      utterance.pitch = 1.0;
      utterance.lang = this.selectedVoice?.lang || 'en-GB';

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.notify(false);
        this.currentUtterance = null;
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.notify(false);
        this.currentUtterance = null;
        console.warn('Speech error:', e);
        options?.onError?.();
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.notify(false);
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.notify(true);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
      this.currentUtterance = null;
    }
  }
}

export const speech = new SpeechEngine();
