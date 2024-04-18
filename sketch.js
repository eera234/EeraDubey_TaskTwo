let w;
let columns;
let rows;
let board;
let next;
let colors = ['#F4FF61', '#F9B208', '#F98404', '#F94C10']; // Updated colors array
let colorIndex = 0;
let frameCounter = 0; // Counter to control color change rate
let colorChangeRate = 15; // Set the color change rate

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  createCanvas(720, 800); // Reduced canvas size
  w = 5; // Smaller value for 'w'
  // Calculate columns and rows based on the new value of 'w'
  columns = floor(width / w);
  rows = floor(height / w);
  // Wacky way to make a 2D array in JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (let i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(0); // Set background color to black
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == 1) fill(colors[colorIndex]);
      else fill(0); // Set fill color to black for the board
      stroke('#255'); // Set stroke color to white
      strokeWeight(1); // Set stroke weight to 1 pixel
      rect(i * w, j * w, w, w); // Draw a square for each cell
    }
  }

  // Increment frame counter
  frameCounter++;
  // Check if frameCounter reaches colorChangeRate
  if (frameCounter >= colorChangeRate) {
    // Reset frameCounter
    frameCounter = 0;
    // Cycle through colors
    colorIndex = (colorIndex + 1) % colors.length;
  }
}

// reset board when mouse is pressed
function mousePressed() {
  init();
}

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
}

// The process of creating the new generation
function generate() {
  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x + i][y + j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if ((board[x][y] == 1) && (neighbors < 2)) next[x][y] = 0; // Loneliness
      else if ((board[x][y] == 1) && (neighbors > 3)) next[x][y] = 0; // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1; // Reproduction
      else next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
}