# Battlesnake - Panagiotis Chologkitas

This repository contains a Battlesnake AI built for the CCS2430 Software Development in Practice module.

## Installation and Setup

1. Clone the repository: `git clone https://github.com/CholoDaBest/battlesnake-ccs2430-resit.git`
2. Navigate to the project directory: `cd battlesnake-ccs2430-resit`
3. Install the dependencies: `npm install`[cite: 5]

## How to Run the Application

To run the server locally and connect it to the Battlesnake platform[cite: 5]:

1. Start the local server: `npm start` (Runs on port 8000).
2. Expose the server to the internet: `ngrok http 8000`. Ngrok is strictly utilized to ensure a stable, lag-free connection to the Battlesnake engine, resolving the authentication and latency hurdles previously encountered when testing with Microsoft Dev Tunnels.
3. Copy the generated HTTPS forwarding URL and paste it into your Battlesnake developer console.

## Testing and Linting

The project utilizes Jest for automated testing and ESLint/Prettier for code quality.

- Run tests and view coverage: `npm test`[cite: 5]
- Run the linter: `npm run lint`[cite: 5]

## Decision-Making Strategy

The snake utilizes a survival-first algorithmic approach[cite: 5]:

1. **Immediate Danger Avoidance:** Filters out moves that result in hitting walls, itself, or enemy bodies[cite: 5]. It calculates enemy head trajectories to avoid lethal head-to-head collisions with larger snakes[cite: 5].
2. **Flood-Fill Space Evaluation:** Runs a custom flood-fill algorithm to calculate the exact number of accessible squares for every safe move[cite: 5]. It ensures the snake never enters a path smaller than its own body length.
3. **Food Seeking:** When safe, it calculates the Manhattan distance to all food on the board and pursues the closest item[cite: 5].

## Repository Structure

- `index.js`: Contains the core movement logic, flood-fill algorithm, and Express server routes[cite: 5].
- `index.test.js`: Contains the Jest test suites and mocked game-state scenarios achieving >90% coverage[cite: 5].
- `package.json`: Project configuration and dependency scripts.

## Known Limitations

- If the snake survives long enough to occupy the majority of the board, the flood-fill algorithm will eventually run out of physical space, forcing the snake into an unavoidable collision[cite: 5].
