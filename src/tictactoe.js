import "./styles.css";

var game_over = false;
var current_player = 1;
var board = [];
var clock = 0; // milliseconds
var timer = false;

// Creating markers for X, O and empty
// Could just use strings but this in my opinion serves as good practice
// as I am rather new with javascript
const marking = {
  X: "X", // p1
  O: "O", // p2
  Empty: ""
};
Object.freeze(marking);

// A function to process clicks on the board
function on_cell_click(id) {
  if (!timer) {
    timer = setInterval(tick_clock, 50);
  } else {
    clock = 0;
  }

  var row = id.split(";")[0];
  var column = id.split(";")[1];

  if (board[row][column] !== marking.Empty || game_over) {
    return;
  }

  board[row][column] = get_current_player_mark();
  check_victory(row, column);
  update_current_player();

  document.getElementById(id).innerHTML = get_current_player_mark();
}

function get_current_player_mark() {
  return current_player % 2 === 0 ? marking.O : marking.X;
}

function update_current_player() {
  current_player = current_player === 1 ? 2 : 1;
  if (!game_over) {
    document.getElementById("turn_indicator").innerHTML =
      "Player " +
      current_player +
      " (" +
      get_current_player_mark() +
      "), your turn.";
  }
}

function check_victory(row, column) {
  const start_row = row;
  const start_column = column;
  var longest = 1;

  column--;

  // Horizontal check left
  while (column >= 0 && board[row][column] === get_current_player_mark()) {
    longest++;
    column--;
  }

  column = +start_column + +1;

  // Horizontal check right
  while (
    column < board[row].length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column++;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }

  longest = 1;
  row--;
  column = start_column;

  // Vertical check up
  while (row >= 0 && board[row][column] === get_current_player_mark()) {
    longest++;
    row--;
  }

  row = +start_row + +1;

  // Vertical check down
  while (
    row < board.length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    row++;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }

  longest = 1;
  column = start_column - 1;
  row = start_row - 1;

  // Diagonal check up left
  while (
    row >= 0 &&
    column >= 0 &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column--;
    row--;
  }

  column = +start_column + +1;
  row = +start_row + +1;

  // Diagonal check down right
  while (
    row >= 0 &&
    row < board.length &&
    column < board[row].length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column++;
    row++;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }

  longest = 1;
  column = start_column - 1;
  row = +start_row + +1;

  // Diagonal check up right
  while (
    row >= 0 &&
    row < board.length &&
    column < board[row].length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column--;
    row++;
  }

  column = +start_column + +1;
  row = start_row - 1;

  // Diagonal check down left
  while (
    row >= 0 &&
    row < board.length &&
    column >= 0 &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column++;
    row--;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }
}

function declare_victory() {
  reset_clock();
  game_over = true;
  document.getElementById("turn_indicator").innerHTML =
    "Congratulations player " +
    current_player +
    " (" +
    get_current_player_mark() +
    "), you win!";

  alert("Player " + current_player + " won!");
  document.getElementById("reset_button").innerHTML = "Play again";
}

function tick_clock() {
  clock += 50;
  if (clock >= 10000) {
    clock = 0;
    update_current_player();
  }
  var percentage = (clock / 10000) * 100;
  document.getElementById("timer_progress").style.width = percentage + "%";
}

function reset_clock() {
  clearInterval(timer);
  timer = false;
  clock = 0;
  document.getElementById("timer_progress").style.width = "0%";
}

function init_materialize() {
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function () {
      on_cell_click(this.id);
    });
  }

  reset_materialize();
}

function reset_materialize() {
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = marking.Empty;
  }

  if (timer) {
    reset_clock();
  }

  board = [];

  for (i = 0; i < 5; i++) {
    board.push([
      marking.Empty,
      marking.Empty,
      marking.Empty,
      marking.Empty,
      marking.Empty
    ]);
  }

  console.log("Board initialized");

  document.getElementById("turn_indicator").innerHTML =
    "Player 1 (X), please begin.";
  document.getElementById("reset_button").innerHTML = "Reset board";
  game_over = false;
  current_player = 1;
}

// Enabling the reset functionality
document
  .getElementById("reset_button")
  .addEventListener("click", reset_materialize);

init_materialize();
