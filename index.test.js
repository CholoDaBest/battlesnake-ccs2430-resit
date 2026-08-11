/* global describe, test, expect */
import { info, start, end, move } from './index.js';

describe('Battlesnake API Core Functions', () => {
  test('info() should return a valid Battlesnake configuration object', () => {
    const response = info();

    expect(response.apiversion).toBe('1');
    expect(response.author).toBeDefined();
    expect(response.color).toBeDefined();
    expect(response.head).toBeDefined();
    expect(response.tail).toBeDefined();
  });

  test('start() should execute without throwing errors', () => {
    expect(() => start({})).not.toThrow();
  });

  test('end() should execute without throwing errors', () => {
    expect(() => end({})).not.toThrow();
  });

  test('move() should return a valid move direction', () => {
    const gameState = {
      game: { id: 'test-game', ruleset: { name: 'standard', version: 'v1.2.3' }, timeout: 500 },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        snakes: [
          {
            id: 'my-snake',
            name: 'CholoDaBest',
            health: 100,
            body: [
              { x: 5, y: 5 },
              { x: 5, y: 6 },
              { x: 5, y: 7 },
            ],
            head: { x: 5, y: 5 },
            length: 3,
          },
        ],
        food: [{ x: 2, y: 2 }],
        hazards: [],
      },
      you: {
        id: 'my-snake',
        name: 'CholoDaBest',
        health: 100,
        body: [
          { x: 5, y: 5 },
          { x: 5, y: 6 },
          { x: 5, y: 7 },
        ],
        head: { x: 5, y: 5 },
        length: 3,
      },
    };

    const response = move(gameState);

    expect(['up', 'down', 'left', 'right']).toContain(response.move);
  });
});
