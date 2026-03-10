import '../register.js';
import type { WACTButton } from '../components/wact-button.js';

await customElements.whenDefined('wact-button');

function wireLoadingDemo(
  id: string,
  confirmText?: string,
  duration?: number,
  delayMs = 2000,
): void {
  const btn = document.getElementById(id) as WACTButton | null;
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.startLoading();
    setTimeout(() => {
      btn.stopLoading(confirmText, duration);
    }, delayMs);
  });
}

wireLoadingDemo('btn-load-reset');
wireLoadingDemo('btn-load-confirm', 'Saved!');
wireLoadingDemo('btn-load-confirm-long', 'Done!', 5000);
wireLoadingDemo('btn-load-hold', 'Confirm held', 0);

const resetBtn = document.getElementById('btn-manual-reset') as WACTButton | null;
const holdBtn = document.getElementById('btn-load-hold') as WACTButton | null;
resetBtn?.addEventListener('click', () => holdBtn?.reset());
