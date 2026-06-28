# Rock Paper Scissors

A browser-based Rock Paper Scissors game built with vanilla HTML, CSS, and JavaScript. Play against the computer and be the first to reach 5 points to win.

---

## Description

This is a week-one project from the Aurax Summer 2026 JavaScript series. It was built step by step — first the HTML structure, then the CSS styling, then the JavaScript logic — to practice the fundamentals of DOM manipulation, event handling, and game logic without any libraries or frameworks.

---

## Features

- Play Rock, Paper, or Scissors against a computer opponent
- Computer makes a random choice each round
- Displays both the player's and computer's choice after each round
- Shows the result of each round (You Win / Computer Wins / Tie)
- Live scoreboard that updates after every round
- Game ends automatically when either side reaches 5 points
- Restart button resets the entire game back to its initial state
- Responsive layout that works on mobile and desktop
- Hover and active animations on all buttons
- Disabled button state prevents play after the game ends

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, layout (Flexbox), animations, responsive design |
| JavaScript (ES6+) | Game logic, DOM manipulation, event handling |

No external libraries, frameworks, or build tools were used.

---

## Folder Structure

```
week-one-rock-paper-scissors/
├── index.html      # HTML structure
├── style.css       # All styles and responsive layout
├── script.js       # Game logic and DOM interactions
└── README.md       # Project documentation
```

---

## Installation

No installation or build step required.

1. Clone or download the repository
2. Open `index.html` in any modern browser

```bash
git clone https://github.com/your-username/aurax-summer-2026-js-projects.git
cd aurax-summer-2026-js-projects/week-one-rock-paper-scissors
open index.html
```

---

## Usage

1. Click **Rock**, **Paper**, or **Scissors** to make your choice
2. The computer picks at random
3. The result and both choices are displayed instantly
4. The scoreboard updates after every round
5. The first to reach **5 points** wins the game
6. Click **Restart** at any time to reset and play again

---

## Game Rules

- **Rock** beats **Scissors**
- **Scissors** beats **Paper**
- **Paper** beats **Rock**
- If both choices are the same, the round is a **Tie** (no points awarded)
- First player to reach **5 wins** ends the game

---

## Screenshots

> _Screenshots coming soon._

| Game Start | Mid Game | Game Over |
|---|---|---|
| ![Game Start](screenshots/start.png) | ![Mid Game](screenshots/mid.png) | ![Game Over](screenshots/end.png) |

---

## Future Improvements

- Add sound effects for wins, losses, and ties
- Animate the choice reveal with a short delay
- Add a best-of selector (e.g. first to 3, 5, or 10)
- Track win/loss history across multiple games
- Add keyboard shortcuts for Rock (R), Paper (P), Scissors (S)
- Light mode / dark mode toggle

---

## Author

Built by **ab** as part of the Aurax Summer 2026 JavaScript Projects series.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
