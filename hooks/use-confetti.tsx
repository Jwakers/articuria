import { useEffect, useRef } from "react";

export function useConfetti(shouldTrigger: boolean, delay = 300) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (confettiFired.current || !shouldTrigger) return;

    const launchConfetti = async () => {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ["#34e86e", "#5a34e8", "#47b4ea"];
      const confetti = (await import("canvas-confetti")).default;

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
        confettiFired.current = true;
      })();
    };

    const timer = setTimeout(launchConfetti, delay);
    return () => clearTimeout(timer);
  }, [shouldTrigger, delay]);
}
