import express from 'express';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    apiversion: '1',
    author: 'CholoDaBest',
    color: '#888888',
    head: 'default',
    tail: 'default',
  });
});

app.post('/start', (req, res) => {
  console.log('GAME START');
  res.send('ok');
});

app.post('/move', (req, res) => {
  const gameState = req.body;
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  const myHead = gameState.you.head;
  const myLength = gameState.you.length;
  const allSnakes = gameState.board.snakes;
  const food = gameState.board.food;

  let possibleMoves = ['up', 'down', 'left', 'right'];

  possibleMoves = possibleMoves.filter((move) => {
    let nextX = myHead.x;
    let nextY = myHead.y;

    if (move === 'up') nextY += 1;
    if (move === 'down') nextY -= 1;
    if (move === 'left') nextX -= 1;
    if (move === 'right') nextX += 1;

    if (nextX < 0 || nextX >= boardWidth || nextY < 0 || nextY >= boardHeight) {
      return false;
    }

    for (const snake of allSnakes) {
      for (const bodyPart of snake.body) {
        if (nextX === bodyPart.x && nextY === bodyPart.y) {
          return false;
        }
      }

      if (snake.id !== gameState.you.id && snake.length >= myLength) {
        const enemyHead = snake.head;
        const enemyNextUp = { x: enemyHead.x, y: enemyHead.y + 1 };
        const enemyNextDown = { x: enemyHead.x, y: enemyHead.y - 1 };
        const enemyNextLeft = { x: enemyHead.x - 1, y: enemyHead.y };
        const enemyNextRight = { x: enemyHead.x + 1, y: enemyHead.y };

        if (
          (nextX === enemyNextUp.x && nextY === enemyNextUp.y) ||
          (nextX === enemyNextDown.x && nextY === enemyNextDown.y) ||
          (nextX === enemyNextLeft.x && nextY === enemyNextLeft.y) ||
          (nextX === enemyNextRight.x && nextY === enemyNextRight.y)
        ) {
          return false;
        }
      }
    }
    return true;
  });

  let finalMove = 'down';

  if (possibleMoves.length > 0) {
    if (food.length > 0) {
      let closestFood = food[0];
      let minDistance = Infinity;

      for (const item of food) {
        const distance = Math.abs(myHead.x - item.x) + Math.abs(myHead.y - item.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestFood = item;
        }
      }

      let bestMove = possibleMoves[0];
      let bestMoveDistance = Infinity;

      for (const move of possibleMoves) {
        let nextX = myHead.x;
        let nextY = myHead.y;

        if (move === 'up') nextY += 1;
        if (move === 'down') nextY -= 1;
        if (move === 'left') nextX -= 1;
        if (move === 'right') nextX += 1;

        const distanceAfterMove = Math.abs(nextX - closestFood.x) + Math.abs(nextY - closestFood.y);

        if (distanceAfterMove < bestMoveDistance) {
          bestMoveDistance = distanceAfterMove;
          bestMove = move;
        }
      }
      finalMove = bestMove;
    } else {
      finalMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  } else {
    const fallbackMoves = ['up', 'down', 'left', 'right'].filter((move) => {
      let nextX = myHead.x;
      let nextY = myHead.y;
      if (move === 'up') nextY += 1;
      if (move === 'down') nextY -= 1;
      if (move === 'left') nextX -= 1;
      if (move === 'right') nextX += 1;
      return nextX >= 0 && nextX < boardWidth && nextY >= 0 && nextY < boardHeight;
    });

    finalMove = fallbackMoves.length > 0 ? fallbackMoves[0] : 'down';
  }

  console.log(`MOVE: ${finalMove}`);
  res.json({ move: finalMove });
});

app.post('/end', (req, res) => {
  console.log('GAME OVER');
  res.send('ok');
});

app.listen(port, () => {
  console.log(`Battlesnake server running on port ${port}...`);
});
