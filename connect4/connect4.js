// connect4.js
const rows = 6;
const columns = 7;
const player1 = 'player1';
const player2 = 'player2';
let currentPlayer = player1;
let gameBoard = [];

function createBoard() {
  for (let i = 0; i < rows; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < columns; j++) {
      gameBoard[i][j] = null;
    }
  }
}

function renderBoard() {
  const table = document.querySelector("#game-board table");
  let tableHTML = "";

  for (let i = 0; i < rows; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < columns; j++) {
      tableHTML += `<td data-row="${i}" data-column="${j}"></td>`;
    }
    tableHTML += "</tr>";
  }
  table.innerHTML = tableHTML;
}

function switchPlayer() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

function isValidMove(row, column) {
  return gameBoard[row][column] === null;
}

function makeMove(row, column) {
  gameBoard[row][column] = currentPlayer;
}

function getLowestEmptyRow(column) {
  for (let i = rows - 1; i >= 0; i--) {
    if (gameBoard[i][column] === null) {
      return i;
    }
  }
  return -1;
}

function isWinningMove(row, column) {
  const player = gameBoard[row][column];

  // Check horizontal
  let count = 0;
  for (let i = 0; i < columns; i++) {
    count = gameBoard[row][i] === player ? count + 1 : 0;
    if (count >= 4) {
      return true;
    }
  }

  // Check vertical
  count = 0;
  for (let i = 0; i < rows; i++) {
    count = gameBoard[i][column] === player ? count + 1 : 0;
    if (count >= 4) {
      return true;
    }
  }

  // Check diagonal (top-left to bottom-right)
  count = 0;
  let startRow = row - Math.min(row, column);
  let startColumn = column - Math.min(row, column);
  while (startRow < rows && startColumn < columns) {
    count = gameBoard[startRow][startColumn] === player ? count + 1 : 0;
    if (count >= 4) {
      return true;
    }
    startRow++;
    startColumn++;
  }
  // Check diagonal (top-right to bottom-left)
  count = 0;
  startRow = row - Math.min(row, columns - column - 1);
  startColumn = column + Math.min(row, columns - column - 1);
  while (startRow < rows && startColumn >= 0) {
    count = gameBoard[startRow][startColumn] === player ? count + 1 : 0;
    if (count >= 4) {
      return true;
    }
    startRow++;
    startColumn--;
  }

  return false;
}

function handleClick(event) {
  const column = parseInt(event.target.dataset.column);
  const row = getLowestEmptyRow(column);

  if (row !== -1 && isValidMove(row, column)) {
    makeMove(row, column);
    event.target.parentNode.parentNode.rows[row].cells[column].classList.add(currentPlayer);

    if (isWinningMove(row, column)) {
      setTimeout(() => {
        alert
      }, 100);
      setTimeout(() => {
        alert(`${currentPlayer.toUpperCase()} wins!`);
        resetGame();
      }, 200);
    } else {
      switchPlayer();
    }
  }
}

function resetGame() {
  createBoard();
  renderBoard();
  currentPlayer = player1;
}

function init() {
  createBoard();
  renderBoard();
  document.querySelector("#game-board table").addEventListener("click", handleClick);
}

init();
