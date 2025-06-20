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

const direction = {
  knight: [
    { col: 2, row: 1, chess: "knight" },
    { col: 2, row: -1, chess: "knight" },
    { col: -2, row: 1, chess: "knight" },
    { col: -2, row: -1, chess: "knight" },
    { col: 1, row: 2, chess: "knight" },
    { col: -1, row: 2, chess: "knight" },
    { col: 1, row: -2, chess: "knight" },
    { col: -1, row: -2, chess: "knight" },
  ],
  king: [
    { col: -1, row: 1, chess: "king" },
    { col: 1, row: 1, chess: "king" },
    { col: 1, row: -1, chess: "king" },
    { col: -1, row: -1, chess: "king" },
    { col: 1, row: 0, chess: "king" },
    { col: -1, row: 0, chess: "king" },
    { col: 0, row: 1, chess: "king" },
    { col: 0, row: -1, chess: "king" },
  ],
  queen: [
    { col: -1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: -1 },
    { col: -1, row: -1 },
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 0, row: -1 },
  ],
  bishop: [
    { col: -1, row: 1, chess: "bishop" },
    { col: 1, row: 1, chess: "bishop" },
    { col: 1, row: -1, chess: "bishop" },
    { col: -1, row: -1, chess: "bishop" },
  ],
  rook: [
    { col: 1, row: 0, chess: "rook" },
    { col: -1, row: 0, chess: "rook" },
    { col: 0, row: 1, chess: "rook" },
    { col: 0, row: -1, chess: "rook" },
  ],
};

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

function handleNutureCell() {
  initialState.hightLight.map((coord) => {
    const cell = document.querySelector(
      `.block[data-y="${coord.y}"][data-x="${coord.x}"]`
    );
    cell && cell.classList.add("active-block");
  });
}

function isLight(currentStep) {
  const { y, x } = currentStep;
  const figura = initialState.board[y][x];

  if (figura.includes("pawn")) {
    const direction = initialState.currentStep === "white" ? -1 : 1;

    const firstStep = y === 6 || y === 1;

    for (let dir of [-1, 1]) {
      const col = y + direction;
      const row = x + dir;

      const chess = initialState.board[col][row];
      if (chess && !chess.includes(initialState.currentStep)) {
        initialState.hightLight.push({ y: col, x: row });
      }
    }

    if (firstStep) {
      initialState.hightLight.push({ y: y + direction + direction, x: x });
    }
    initialState.hightLight.push({ y: y + direction, x: x });
  }

  if (figura.includes("rook")) {
    const direction = [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ];

    for (let dir of direction) {
      for (let i = 1; i <= 7; i++) {
        const col = y + dir.col * i;
        const row = x + dir.row * i;

        if (col < 0 || col > 7 || row < 0 || row > 7) break;

        const chess = initialState.board[col][row];

        if (!chess) {
          initialState.hightLight.push({ y: col, x: row });
        } else {
          if (chess && !chess.includes(initialState.currentStep)) {
            initialState.hightLight.push({ y: col, x: row });
          }
          break;
        }
      }
    }
  }

  handleNutureCell();
}

// function isValid(futureStep, currentStep, figura) {
//   const { y, x } = currentStep;
//   if (figura.includes("pawn")) {
//     const direction = initialState.currentStep === "white" ? -1 : 1;

//     const firstStep = y === 6 || y === 1;

//     for (let dir of [-1, 1]) {
//       const col = y + direction;
//       const row = x + dir;

//       if (futureStep.y === col && futureStep.x === row) {
//         const chess = initialState.board[col][row];
//         if (chess && !chess.includes(initialState.currentStep)) {
//           return true;
//         }
//       }
//     }

//     if (
//       (futureStep.y === y + direction * 2 && x === futureStep.x && firstStep) ||
//       (futureStep.y === y + direction && x === futureStep.x)
//     )
//       return true;
//   }

//   const isOneStep = figura.includes("knight") || figura.includes("king");

//   Object.entries(direction).map(([i, direct]) => {
//     if (figura.includes(i)) {
//       for (let dir of direct) {
//         const maxStep = isOneStep ? 1 : 8;

//         for (let i = 0; i < maxStep; i++) {
//           const col = y + dir.col * i;
//           const row = x + dir.row * i;

//           if ((col < 1 || col > 8) && (row < 1 || row > 8)) break;

//           if (futureStep.y === col && futureStep.x === row) {
//             const chess = initialState.board[col][row];
//             if (chess && !chess.includes(initialState.currentStep)) return true;
//           }
//         }
//       }
//     }
//   });
// }

function moveChess(futureStep, currentStep) {
  if (!currentStep) return;
  const chess = initialState.board[currentStep.y][currentStep.x];

  initialState.hightLight.map((coord) => {
    if (coord.y === futureStep.y && coord.x === futureStep.x) {
      initialState.board[futureStep.y][futureStep.x] = "";
      initialState.board[futureStep.y][futureStep.x] = chess;
      initialState.board[currentStep.y][currentStep.x] = "";
      initialState.currentChess = null;
      initialState.hightLight = [];
      initialState.currentStep =
        initialState.currentStep === "white" ? "black" : "white";

      renderBoard();
    }
  });
}

function handlerClick(x, y) {
  document.querySelectorAll("img").forEach((chess) => {
    chess.classList.remove("active-chess");
  });

  const chess = initialState.board[y][x];

  if (chess.includes(initialState.currentStep)) {
    const cell = document.querySelector(`.block[data-y="${y}"][data-x="${x}"]`);
    const domChess = cell.querySelector("img");
    domChess.classList.add("active-chess");
    initialState.currentChess = { y, x };

    isLight(initialState.currentChess);
  } else {
    const currentStep = initialState.currentChess;
    const futureStep = { y, x };

    moveChess(futureStep, currentStep);

    renderBoard();
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
