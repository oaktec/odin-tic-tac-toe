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
    for (let i = 0; i < 4; i += 1) {
      if (i === 3) {
        Gameboard.setInfoText("DRAW!");
        Gameboard.displayNewGameButton();
        return false;
      }
      if (grid[i].some((x) => x === "")) {
        break;
      }
    }

    return true;
  }

  function handleNextTurn() {
    players[currTurn].handleTurn(currTurn, grid);
  }

  function startGame(p1Name, p2Name, opponentType) {
    resetGrid();
    players[0] = Player(p1Name !== "" ? p1Name : "Player 1");
    if (opponentType === "human") {
      players[1] = Player(p2Name !== "" ? p2Name : "Player 2");
    } else if (opponentType === "easy") {
      players[1] = EasyBot();
    } else {
      players[1] = HardBot();
    }
    determineFirstTurn();
  }

  return { startGame, giveInput };
})();

const Gameboard = (() => {
  const SYMBOL_EMOJIS = ["⭕", "❌"];
  // getDomElements
  const startButton = document.querySelector("#start-button");
  const newGameButton = document.querySelector("#new-game-button");
  const infoText = document.querySelector("#info-text");
  const namesInputDiv = document.querySelector("#names-input");
  const p1NameInput = document.querySelector("#player-1-name");
  const p2NameInput = document.querySelector("#player-2-name");
  const p2Select = document.querySelector("#player-2-select");
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
  newGameButton.addEventListener("click", newGame);
  p2Select.addEventListener("change", p2selectChange);

  function p2selectChange(e) {
    switch (e.target.value) {
      case "human":
        p2NameInput.removeAttribute("disabled");
        p2NameInput.value = "";
        break;
      case "easy":
        p2NameInput.setAttribute("disabled", "");
        p2NameInput.value = "Easy-bot";
        break;
      case "hard":
        p2NameInput.setAttribute("disabled", "");
        p2NameInput.value = "Impossi-bot";
        break;
      default:
        break;
    }
  }

  function newGame() {
    gridDiv.classList.add("hide");
    newGameButton.classList.add("hide");
    infoText.classList.add("hide");

    namesInputDiv.classList.remove("hide");
    startButton.classList.remove("hide");
  }

  function startGame() {
    gridDiv.classList.remove("hide");
    infoText.classList.remove("hide");
    infoText.textContent = "";
    startButton.classList.add("hide");
    namesInputDiv.classList.add("hide");

    TicTacToe.startGame(p1NameInput.value, p2NameInput.value, p2Select.value);
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

  function handleAITurn(name, nextMove) {
    infoText.textContent = `${name} is thinking...`;
    setTimeout(finishAITurn(nextMove), 500);
  }
  function finishAITurn(nextMove) {
    return () => TicTacToe.giveInput(nextMove);
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
    newGameButton.classList.remove("hide");
  }

  return {
    render,
    setInfoText,
    handleHumanTurn,
    handleAITurn,
    displayNewGameButton,
  };
})();

const HardBot = () => {
  const { getName } = Player("ImpossiBot");
  let myTeam;
  let bestMove;

  const handleTurn = (currTurn, grid) => {
    const singArr = [...grid[0], ...grid[1], ...grid[2]];
    myTeam = currTurn;
    minimax(singArr, currTurn);
    Gameboard.handleAITurn(getName(), bestMove);
  };

  const minimax = (state, currTurn) => {
    // If game over return final score up chain
    const gameState = getGameState(state);
    if (gameState !== "") {
      return score(gameState);
    }

    const scores = [];
    const moves = [];

    for (let i = 0; i < 9; i += 1) {
      if (state[i] === "") {
        // For each possible next move, recursively search
        const possibleState = [...state];
        possibleState[i] = currTurn;
        if (currTurn === 0) scores.push(minimax(possibleState, 1));
        else scores.push(minimax(possibleState, 0));
        moves.push(i);
      }
    }

    // Assume highest score (best move) for my moves
    if (currTurn === myTeam) {
      const max = Math.max(...scores);
      bestMove = moves[scores.indexOf(max)];
      return max;
    }

    // Assume lowest score (best move) for opp moves
    const min = Math.min(...scores);
    bestMove = moves[scores.indexOf(min)];
    return min;
  };

  const score = (gameState) => {
    if (gameState === myTeam) {
      return 10;
    }
    if (gameState === "over") {
      return 0;
    }
    return -10;
  };

  const getGameState = (state) => {
    for (let i = 0; i < 3; i += 1) {
      const i3 = i * 3;
      if (
        state[i3] !== "" &&
        state[i3] === state[i3 + 1] &&
        state[i3 + 1] === state[i3 + 2]
      ) {
        return state[i3];
      }
      if (
        state[i] !== "" &&
        state[i] === state[i + 3] &&
        state[i + 3] === state[i + 6]
      ) {
        return state[i];
      }
    }
    if (state[4] !== "") {
      if (
        (state[0] === state[4] && state[4] === state[8]) ||
        (state[2] === state[4] && state[4] === state[6])
      ) {
        return state[4];
      }
    }
    if (state.some((x) => x === "")) return "";
    return "over";
  };

  return { getName, handleTurn };
};

const EasyBot = () => {
  const { getName } = Player("EasyBot");

  const handleTurn = (currTurn, grid) => {
    for (;;) {
      const nextMove = Math.floor(Math.random() * 9);
      if (grid[Math.floor(nextMove / 3)][nextMove % 3] === "") {
        Gameboard.handleAITurn(getName(), nextMove);
        return;
      }
    }
  };
  return { getName, handleTurn };
};

const Player = (name) => {
  this.name = name;
  const getName = () => name;

  const handleTurn = (currTurn) => {
    Gameboard.handleHumanTurn(name, currTurn);
  };

  return { getName, handleTurn };
};
