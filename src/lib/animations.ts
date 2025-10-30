import confetti from "canvas-confetti";

export function triggerArrow(): void {
  const arrow = document.querySelector('.login-arrow');
  if (arrow) {
    arrow.classList.add('arrow-slide');
  }
}

export function triggerConfetti(): void {
  // Create a burst of confetti from multiple angles
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#00D4FF', '#FFB800', '#1C1C1C', '#FFFFFF'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Fire confetti in multiple bursts for a more dramatic effect
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function triggerSuccessConfetti(): void {
  // Trigger confetti animation - single smooth burst
  const count = 200;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 100,
    zIndex: 9999,
    gravity: 0.8,
    decay: 0.94,
  };

  function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Single burst from both sides
  confetti({
    ...defaults,
    particleCount: count,
    origin: { x: randomInRange(0.2, 0.4), y: 0.5 },
    colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487'],
  });

  confetti({
    ...defaults,
    particleCount: count,
    origin: { x: randomInRange(0.6, 0.8), y: 0.5 },
    colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487'],
  });
}

