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
  const allSnakes = gameState.board.snakes;

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
    }

    return true;
  });

  const safeMove =
    possibleMoves.length > 0
      ? possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      : 'down';

  console.log(`MOVE: ${safeMove}`);
  res.json({ move: safeMove });
});

app.post('/end', (req, res) => {
  console.log('GAME OVER');
  res.send('ok');
});

app.listen(port, () => {
  console.log(`Battlesnake server running on port ${port}...`);
});
