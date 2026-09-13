import { Injectable, signal } from '@angular/core';

type Cue = 'tick' | 'unlock' | 'stamp' | 'chime';

interface Voice {
  readonly type: OscillatorType;
  readonly from: number;
  readonly to: number;
  readonly duration: number;
  readonly gain: number;
}

/** Pequeña paleta sonora, sintetizada: cero archivos de audio en el bundle. */
const VOICES: Record<Cue, Voice> = {
  tick: { type: 'square', from: 1180, to: 900, duration: 0.045, gain: 0.035 },
  unlock: { type: 'sawtooth', from: 180, to: 760, duration: 0.5, gain: 0.05 },
  stamp: { type: 'triangle', from: 220, to: 60, duration: 0.28, gain: 0.09 },
  chime: { type: 'sine', from: 523.25, to: 1046.5, duration: 1.1, gain: 0.05 },
};

/**
 * Sonido ambiental del expediente.
 *
 * Está apagado por defecto y sólo se enciende con el interruptor de la cabecera:
 * nada suena sin que la lectora lo pida.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  readonly enabled = signal(false);

  private context: AudioContext | null = null;

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);

    if (next) {
      // El clic del interruptor es el gesto que autoriza el AudioContext.
      void this.resume();
      this.play('tick');
    }
  }

  play(cue: Cue): void {
    if (!this.enabled()) {
      return;
    }

    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const { type, from, to, duration, gain } = VOICES[cue];
    const now = context.currentTime;

    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + duration);

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  private ensureContext(): AudioContext | null {
    if (this.context) {
      return this.context;
    }

    if (typeof AudioContext === 'undefined') {
      return null;
    }

    this.context = new AudioContext();
    return this.context;
  }

  private async resume(): Promise<void> {
    const context = this.ensureContext();
    if (context?.state === 'suspended') {
      await context.resume();
    }
  }
}
