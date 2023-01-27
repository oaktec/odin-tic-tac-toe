/* eslint-disable no-use-before-define */
const TicTacToe = (() => {
  const NOUGHTS = 0;
  const CROSSES = 1;

  const grid = [];
  const players = [];
  let currTurn = 0;

  function resetGrid() {
    for (let x = 0; x < 3; x += 1) {
      grid[x] = ["", "", ""];
    }

    Gameboard.render(grid);
  }

  function determineFirstTurn() {
    if (Math.random() >= 0.5) {
      currTurn = NOUGHTS;
    } else {
      currTurn = CROSSES;
    }
    handleNextTurn();
  }

  function giveInput(cell) {
    const x = Math.floor(cell / 3);
    const y = cell % 3;
    grid[x][y] = currTurn;
    Gameboard.render(grid);
    if (checkGameState(x, y)) {
      currTurn = currTurn === 0 ? 1 : 0;
      handleNextTurn();
    }
  }

  function checkGameState(lastX, lastY) {
    // return true if game continues
    let gameWon = false;
    if (
      (grid[lastX][0] === grid[lastX][1] &&
        grid[lastX][1] === grid[lastX][2]) ||
      (grid[0][lastY] === grid[1][lastY] && grid[1][lastY] === grid[2][lastY])
    ) {
      gameWon = true;
    } else if (
      lastX === lastY &&
      grid[0][0] === grid[1][1] &&
      grid[1][1] === grid[2][2]
    ) {
      gameWon = true;
    } else if (
      ((lastX === 1 && lastY === 1) || Math.abs(lastX - lastY) === 2) &&
      grid[2][0] === grid[1][1] &&
      grid[1][1] === grid[0][2]
    ) {
      gameWon = true;
    }
    if (gameWon) {
      Gameboard.setInfoText(`${players[currTurn].getName()} WON!!`);
      Gameboard.displayNewGameButton();
      return false;
    }

    return true;
  }

  function handleNextTurn() {
    Gameboard.handleHumanTurn(players[currTurn].getName(), currTurn);
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
    const index = Array.from(gridDiv.children).indexOf(e.target);
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

  function displayNewGameButton() {
    startButton.classList.remove("hide");
  }

  return { render, setInfoText, handleHumanTurn, displayNewGameButton };
})();

const Player = (name) => {
  this.name = name;
  const getName = () => name;

  return { getName };
};
