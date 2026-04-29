export type WaveBannerController = {
  show: (passedWave: number, incomingWave: number) => void;
  hide: () => void;
};

const DISPLAY_MS = 1800;

export function createWaveBanner(root: HTMLElement): WaveBannerController {
  const banner = document.createElement("section");
  banner.className = "wave-banner";
  banner.hidden = true;
  banner.setAttribute("aria-label", "Wave transition");

  const passed = document.createElement("strong");
  passed.className = "wave-banner__passed";

  const incoming = document.createElement("span");
  incoming.className = "wave-banner__incoming";

  let timeoutId: number | undefined;

  banner.append(passed, incoming);
  root.append(banner);

  return {
    show(passedWave, incomingWave) {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }

      passed.textContent = `WAVE ${passedWave} PASSED`;
      incoming.textContent = `WAVE ${incomingWave} INCOMING`;
      banner.hidden = false;
      timeoutId = window.setTimeout(() => {
        banner.hidden = true;
        timeoutId = undefined;
      }, DISPLAY_MS);
    },
    hide() {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      banner.hidden = true;
    }
  };
}
