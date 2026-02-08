import type { SimService, MatchupInput, SimResult } from './types.js';

export class ApiSimService implements SimService {
  private host: string;
  private ready = false;

  constructor(host: string = 'http://localhost:8080') {
    this.host = host;
  }

  async initialize(): Promise<void> {
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async simulateGame(matchup: MatchupInput): Promise<SimResult> {
    if (!this.ready) {
      throw new Error('ApiSimService not initialized. Call initialize() first.');
    }

    const response = await fetch(`${this.host}/game/sim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchup),
    });

    if (!response.ok) {
      throw new Error(`Simulation API request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as SimResult;
  }
}
