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
  // --- ADVANCED COVERAGE TESTS ---

  // Helper function to build a fake game board
  function createFakeGame(myHead, myBody, food, otherSnakes) {
    const youSnake = {
      id: 'cholo-snake',
      name: 'CholoDaBest',
      head: myHead,
      body: myBody,
      length: myBody.length,
    };

    // A real Battlesnake board always includes your own snake in the snakes array!
    const allSnakes = otherSnakes ? [...otherSnakes, youSnake] : [youSnake];

    return {
      board: {
        height: 11,
        width: 11,
        food: food || [],
        snakes: allSnakes,
      },
      you: youSnake,
    };
  }

  test('Coverage: Should move towards closest food when hungry', () => {
    // Snake is at (5,5), food is at (5,7) [two squares up].
    const state = createFakeGame(
      { x: 5, y: 5 },
      [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
      ],
      [
        { x: 5, y: 7 },
        { x: 1, y: 1 },
      ],
      []
    );
    const result = move(state);
    expect(result.move).toBe('up');
  });

  test('Coverage: Should avoid head-to-head collisions with larger snakes', () => {
    // We are length 2 at (5,5). Enemy is length 10 at (5,7).
    // Moving 'up' to (5,6) risks a head-to-head collision. The logic must ban 'up'.
    const enemySnake = {
      id: 'big-enemy',
      head: { x: 5, y: 7 },
      body: [
        { x: 5, y: 7 },
        { x: 5, y: 8 },
        { x: 5, y: 9 },
      ],
      length: 10,
    };

    const state = createFakeGame(
      { x: 5, y: 5 },
      [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
      ],
      [],
      [enemySnake]
    );
    const result = move(state);
    expect(result.move).not.toBe('up');
  });

  test('Coverage: Should pick the roomiest path when flood-fill fails', () => {
    // We set our length artificially high (100) so flood-fill always fails to find enough room.
    const state = createFakeGame(
      { x: 1, y: 1 },
      [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      [],
      []
    );
    state.you.length = 100;

    // Box it in a bit with an enemy body to create dead ends
    const enemyBody = {
      id: 'wall',
      head: { x: 10, y: 10 },
      body: [
        { x: 0, y: 2 },
        { x: 1, y: 2 }, // Roof over left side
        { x: 2, y: 1 },
        { x: 2, y: 0 }, // Wall on right side
      ],
      length: 4,
    };
    state.board.snakes.push(enemyBody);

    // It should safely fall back to the moveSpaces dictionary
    const result = move(state);
    expect(['left', 'down']).toContain(result.move);
  });

  test('Coverage: Should return down when completely trapped on all sides', () => {
    // Head at top-left corner (0,10). Right is blocked by body (1,10), Up is the board ceiling (y=11).
    const state = createFakeGame(
      { x: 0, y: 10 },
      [
        { x: 0, y: 10 },
        { x: 1, y: 10 },
        { x: 0, y: 9 },
      ],
      [],
      []
    );
    const result = move(state);
    // It has no choice but to go down or left into a wall, so it will fall back to 'down'
    expect(result.move).toBe('down');
  });
});
