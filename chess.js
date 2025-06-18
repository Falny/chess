const chessList = {};
const chesses = ["rook", "pawn", "bishop", "knight", "queen", "king"];
const colors = ["black", "white"];

chesses.forEach((chess) => {
  chessList[chess] = {};
  colors.forEach((color) => {
    const img = document.createElement("img");
    img.src = `./img/${color}-${chess}.svg`;
    chessList[chess][color] = img;
  });
});

const initialBoard = [
  [
    "black-rook",
    "black-knight",
    "black-bishop",
    "black-queen",
    "black-king",
    "black-bishop",
    "black-knight",
    "black-rook",
  ],
  [
    "black-pawn",
    "black-pawn",
    "black-pawn",
    "black-pawn",
    "black-pawn",
    "black-pawn",
    "black-pawn",
    "black-pawn",
  ],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "white-pawn",
    "white-pawn",
    "white-pawn",
    "white-pawn",
    "white-pawn",
    "white-pawn",
    "white-pawn",
    "white-pawn",
  ],
  [
    "white-rook",
    "white-knight",
    "white-bishop",
    "white-queen",
    "white-king",
    "white-bishop",
    "white-knight",
    "white-rook",
  ],
];

const initialState = {
  board: structuredClone(initialBoard),
  currentStep: "white",
  currentChess: null,
  hightLight: [],
};

function isValid(step, figuraStep, figura) {
  const { y, x } = figuraStep;
  if (figura.includes("pawn")) {
    const direction = initialState.currentStep === "white" ? -1 : 1;

    const firstStep = y === 6 || y === 1;

    // [-1, 1].forEach(dir => {
    //   const col = y + direction;
    //   const row = x + dir

    //   if ()
    // })

    console.log(figuraStep, figura, step, direction);
    if (
      (step.y === y + direction * 2 && x === step.x && firstStep) ||
      (step.y === y + direction && x === step.x)
    )
      return true;
  }
}

function moveChess(step, figuraStep) {
  if (!figuraStep) return;
  const chess = initialState.board[figuraStep.y][figuraStep.x];
  if (!chess) return;

  if (isValid(step, figuraStep, chess)) {
    console.log("puk");
    initialState.board[step.y][step.x] = chess;
    initialState.board[figuraStep.y][figuraStep.x] = "";
    initialState.currentChess = null;
    initialState.currentStep =
      initialState.currentStep === "white" ? "black" : "white";

    renderBoard();
  }
}

function handlerClick(x, y) {
  document.querySelectorAll("img").forEach((chess) => {
    chess.classList.remove("active-chess");
  });
  const chess = initialState.board[y][x];

  if (chess) {
    const cell = document.querySelector(`.block[data-y="${y}"][data-x="${x}"]`);
    const domChess = cell.querySelector("img");

    if (domChess.src.includes(initialState.currentStep)) {
      domChess.classList.add("active-chess");
      initialState.currentChess = { y, x };
    }
  } else {
    const figuraStep = initialState.currentChess;
    const step = { y, x };
    moveChess(step, figuraStep);
  }
}

function renderBoard() {
  const board = document.querySelector(".chess_board");
  board.innerHTML = "";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.classList.add("block");

      if ((x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1)) {
        cell.classList.add("block-white");
      } else {
        cell.classList.add("block-black");
      }

      cell.dataset.y = y;
      cell.dataset.x = x;

      const chess = initialState.board[y][x];

      if (chess) {
        const figura = findChess(chess);
        cell.append(figura);
      }

      cell.addEventListener("click", () => handlerClick(x, y));

      board.appendChild(cell);
    }
  }
}
renderBoard();

function findChess(chess) {
  const [color, figura] = chess.split("-");
  return chessList[figura][color].cloneNode();
}
