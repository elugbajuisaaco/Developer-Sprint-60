import confetti from 'canvas-confetti';

export function fireConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#6366f1', '#f59e0b', '#ec4899'],
      disableForReducedMotion: true,
    });
  } catch {}
}

export function fireGrandCelebration(): void {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#06b6d4', '#10b981', '#818cf8', '#38bdf8'],
        disableForReducedMotion: true,
      });
    }, 250);
  } catch {}
}
