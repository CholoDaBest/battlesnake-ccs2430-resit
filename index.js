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
  const possibleMoves = ['up', 'down', 'left', 'right'];
  const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  console.log(`MOVE: ${randomMove}`);
  res.json({ move: randomMove });
});

app.post('/end', (req, res) => {
  console.log('GAME OVER');
  res.send('ok');
});

app.listen(port, () => {
  console.log(`Battlesnake server running on port ${port}...`);
});
