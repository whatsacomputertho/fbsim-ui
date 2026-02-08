import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiSimService } from '../../services/api-sim-service.js';

describe('ApiSimService', () => {
  let service: ApiSimService;

  beforeEach(() => {
    service = new ApiSimService('http://test-host:8080');
    vi.restoreAllMocks();
  });

  it('should not be ready before initialization', () => {
    expect(service.isReady()).toBe(false);
  });

  it('should report ready after initialization', async () => {
    await service.initialize();
    expect(service.isReady()).toBe(true);
  });

  it('should throw if simulateGame called before initialize', async () => {
    await expect(
      service.simulateGame({
        home: { name: 'A', offense_overall: 50, defense_overall: 50 },
        away: { name: 'B', offense_overall: 50, defense_overall: 50 },
      }),
    ).rejects.toThrow('not initialized');
  });

  it('should POST to /game/sim with correct body', async () => {
    await service.initialize();

    const mockResult = {
      home_team: 'Home',
      away_team: 'Away',
      home_score: 21,
      away_score: 14,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const matchup = {
      home: { name: 'Home', offense_overall: 70, defense_overall: 60 },
      away: { name: 'Away', offense_overall: 55, defense_overall: 65 },
    };

    const result = await service.simulateGame(matchup);

    expect(fetchSpy).toHaveBeenCalledWith('http://test-host:8080/game/sim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchup),
    });
    expect(result).toEqual(mockResult);
  });

  it('should throw on non-OK response', async () => {
    await service.initialize();

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Server Error', { status: 500, statusText: 'Internal Server Error' }),
    );

    await expect(
      service.simulateGame({
        home: { name: 'A', offense_overall: 50, defense_overall: 50 },
        away: { name: 'B', offense_overall: 50, defense_overall: 50 },
      }),
    ).rejects.toThrow('500');
  });
});
