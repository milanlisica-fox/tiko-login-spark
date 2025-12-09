import confetti from "canvas-confetti";

export function triggerArrow(): Promise<void> {
  const arrow = document.querySelector<SVGElement>(".login-arrow");
  if (!arrow) {
    return Promise.resolve();
  }

  const previousTransition = arrow.style.transition;
  arrow.style.transition = "none";
  arrow.classList.remove("middle", "after");
  void arrow.getBoundingClientRect();
  arrow.style.transition = previousTransition;

  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        arrow.removeEventListener("transitionend", handleTransitionEnd);
        resolve();
      }
    }, 1000); // 1 second timeout as fallback

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform" || resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeout);
      arrow.removeEventListener("transitionend", handleTransitionEnd);
      resolve();
    };

    arrow.addEventListener("transitionend", handleTransitionEnd);
    requestAnimationFrame(() => {
      arrow.classList.add("middle");
    });
  });
}

export function finishArrow(): Promise<void> {
  const arrow = document.querySelector<SVGElement>(".login-arrow");
  if (!arrow) {
    return Promise.resolve();
  }

  arrow.classList.remove("after");

  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        arrow.removeEventListener("transitionend", handleTransitionEnd);
        arrow.classList.remove("middle");
        resolve();
      }
    }, 1000); // 1 second timeout as fallback

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform" || resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeout);
      arrow.removeEventListener("transitionend", handleTransitionEnd);
      arrow.classList.remove("middle");
      resolve();
    };

    arrow.addEventListener("transitionend", handleTransitionEnd);
    requestAnimationFrame(() => {
      arrow.classList.add("after");
    });
  });
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

