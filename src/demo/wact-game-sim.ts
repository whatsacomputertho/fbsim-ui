import '../register.js';
import { WasmSimService } from '../services/wasm-sim-service.js';
import type { WACTGameSim } from '../components/wact-game-sim.js';

async function main(): Promise<void> {
  try {
    const service = new WasmSimService();
    await service.initialize();

    await customElements.whenDefined('wact-game-sim');

    const gameSim = document.querySelector('wact-game-sim') as WACTGameSim;
    if (gameSim) {
      gameSim.setSimService(service);
    }
  } catch (error) {
    console.warn(
      'WasmSimService not available. Install @whatsacomputertho/fbsim-core to enable simulation.',
      error,
    );
  }
}

void main();
