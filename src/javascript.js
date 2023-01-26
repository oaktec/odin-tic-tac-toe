/* eslint-disable no-use-before-define */
const TicTacToe = (() => {
  const NOUGHTS = 0;
  const CROSSES = 1;

  const grid = [];
  const players = [];
  let nextTurn = 0;

  function resetGrid() {
    for (let x = 0; x < 3; x += 1) {
      grid[x] = ["", "", ""];
    }

    Gameboard.render(grid);
  }

  function determineFirstTurn() {
    if (Math.random() >= 0.5) {
      nextTurn = NOUGHTS;
    } else {
      nextTurn = CROSSES;
    }
    handleNextTurn();
  }

  function giveInput(cell) {
    const x = Math.floor(cell / 3);
    const y = cell % 3;
    grid[x][y] = nextTurn;
    Gameboard.render(grid);
  }

  function handleNextTurn() {
    Gameboard.handleHumanTurn(players[nextTurn].getName(), nextTurn);
  }

  function startGame(p1Name = "Player 1", p2Name = "Player 2") {
    resetGrid();
    players[0] = Player(p1Name !== "" ? p1Name : "Player 1");
    players[1] = Player(p2Name !== "" ? p2Name : "Player 2");
    determineFirstTurn();
  }

  return { startGame, giveInput };
})();

const Gameboard = (() => {
  const SYMBOL_EMOJIS = ["⭕", "❌"];
  // getDomElements
  const startButton = document.querySelector("#start-button");
  const infoText = document.querySelector("#info-text");
  const namesInputDiv = document.querySelector("#names-input");
  const p1NameInput = document.querySelector("#player-1-name");
  const p2NameInput = document.querySelector("#player-2-name");
  const gridDiv = document.querySelector("#board-wrapper");
  const cellGrid = [];
  for (let x = 0; x < 3; x += 1) {
    cellGrid[x] = [];
    for (let y = 0; y < 3; y += 1) {
      cellGrid[x][y] = gridDiv.children[3 * x + y];
    }
  }

  // addEventListeners
  startButton.addEventListener("click", startGame);

  function startGame() {
    gridDiv.classList.remove("hide");
    infoText.classList.remove("hide");
    infoText.textContent = "";
    startButton.classList.add("hide");
    namesInputDiv.classList.add("hide");

    TicTacToe.startGame(p1NameInput.value, p2NameInput.value);
  }

  function render(grid) {
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cellGrid[x][y].textContent =
          grid[x][y] === "" ? "" : SYMBOL_EMOJIS[grid[x][y]];
      }
    }
  }

  function handleHumanTurn(name, val) {
    infoText.textContent = `${name}'s turn! ${SYMBOL_EMOJIS[val]}`;
    [...gridDiv.children].forEach((cell) => {
      if (cell.textContent === "") {
        cell.addEventListener("click", cellClickCallback);
      }
    });
  }

  function cellClickCallback(e) {
    let index = Array.from(gridDiv.children).indexOf(e.target);
    [...gridDiv.children].forEach((cell) => {
      if (cell.textContent === "") {
        cell.removeEventListener("click", cellClickCallback);
      }
    });
    TicTacToe.giveInput(index);
  }

  function setInfoText(msg) {
    infoText.textContent = msg;
  }

  return { render, setInfoText, handleHumanTurn };
})();

const Player = (name) => {
  this.name = name;
  const getName = () => name;

  return { getName };
};
