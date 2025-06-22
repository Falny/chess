const chessList = {};
const chesses = ["rook", "pawn", "bishop", "knight", "queen", "king"];
const colors = ["black", "white"];

const text = document.querySelector(".text"); // текст для ходов
const whiteChess = document.querySelector(".chess-white"); // для вида какие фигуры съели
const blackChess = document.querySelector(".chess-black"); // для вида какие фигуры съели

// добавляю изображения в объект
chesses.forEach((chess) => {
  chessList[chess] = {};
  colors.forEach((color) => {
    const img = document.createElement("img");
    img.src = `./img/${color}-${chess}.svg`; // добавляю в путь изображение
    chessList[chess][color] = img;
  });
});

// начальная доска
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
    "white-king",
    "white-queen",
    "white-bishop",
    "white-knight",
    "white-rook",
  ],
];

// глобавльные состояние
const initialState = {
  board: structuredClone(initialBoard),
  currentStep: "white",
  currentChess: null,
  hightLight: [],
};

// отображение съеденных фигур
function addEatChess(y, x) {
  const chess = document.querySelector(`.block[data-y="${y}"][data-x="${x}"]`); // получаю клетку с изображением
  const img = chess.querySelector("img"); // нахожу само изображение

  // если изображение есть и в зависимости от цвета хода добавляю
  if (img) {
    if (initialState.currentStep === "white") {
      whiteChess.appendChild(img);
    } else {
      blackChess.appendChild(img);
    }
  }
}

// смена текста хода
function updateText() {
  text.textContent = `Ходят ${
    initialState.currentStep === "white" ? "белые" : "черные"
  }`;
}

updateText();

// проверка может ли пешка срубить короля
function checkPawn() {
  const direction = initialState.currentStep === "white" ? -1 : 1; // нахожу направление в зависимоти от цвета хода

  // пробгеаюсь по сущ подсвтеке и проверяю может ли на подсвеченную клетку встать пешка
  initialState.hightLight.forEach((light) => {
    for (let dir of [-1, 1]) {
      const col = light.y + direction;
      const row = light.x + dir;

      const chess = initialState.board[col][row];

      // провеяю если есть фигура и это пешка то фильтрую подсветку исключая возможное съедение короля
      if (chess && chess.includes("pawn")) {
        if (!chess.includes(initialState.currentStep)) {
          initialState.hightLight = initialState.hightLight.filter(
            (coord) => coord.y !== light.y || coord.x !== light.x
          );
        }
      }
    }
  });
}

// проверка съедение короля ладьей
function checkRook() {
  const direction = [
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 0, row: -1 },
  ];

  // пробгеаюсь по сущ подсвтеке и проверяю может ли на подсвеченную клетку встать ладья
  initialState.hightLight.forEach((light) => {
    for (let dir of direction) {
      for (let i = 1; i <= 7; i++) {
        const col = light.y + dir.col * i;
        const row = light.x + dir.row * i;

        if (col < 0 || col > 7 || row < 0 || row > 7) break;

        const chess = initialState.board[col][row];

        if (chess && chess.includes("rook")) {
          if (!chess.includes(initialState.currentStep)) {
            initialState.hightLight = initialState.hightLight.filter(
              (coord) => coord.y !== light.y || coord.x !== light.x
            );
          }
        }

        // проверка на перепрыгивание других фигур если есть фигуры на пути то прерываю цикл
        if (chess && !chess.includes("rook")) {
          break;
        }
      }
    }
  });
}

function checkBishop() {
  const direction = [
    { col: -1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: -1 },
    { col: -1, row: -1 },
  ];

  initialState.hightLight.forEach((light) => {
    for (let dir of direction) {
      for (let i = 1; i <= 7; i++) {
        const col = light.y + dir.col * i;
        const row = light.x + dir.row * i;

        if (col < 0 || col > 7 || row < 0 || row > 7) break;

        const chess = initialState.board[col][row];

        if (chess && chess.includes("bishop")) {
          if (!chess.includes(initialState.currentStep)) {
            initialState.hightLight = initialState.hightLight.filter(
              (coord) => coord.y !== light.y || coord.x !== light.x
            );
          }
        }

        if (chess && !chess.includes("bishop")) {
          break;
        }
      }
    }
  });
}

function checkQueen() {
  const direction = [
    { col: -1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: -1 },
    { col: -1, row: -1 },
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 0, row: -1 },
  ];

  initialState.hightLight.forEach((light) => {
    for (let dir of direction) {
      for (let i = 1; i <= 7; i++) {
        const col = light.y + dir.col * i;
        const row = light.x + dir.row * i;

        if (col < 0 || col > 7 || row < 0 || row > 7) break;

        const chess = initialState.board[col][row];

        if (chess && chess.includes("queen")) {
          if (!chess.includes(initialState.currentStep)) {
            initialState.hightLight = initialState.hightLight.filter(
              (coord) => coord.y !== light.y || coord.x !== light.x
            );
          }
        }

        if (chess && !chess.includes("queen")) {
          break;
        }
      }
    }
  });
}

function checkKnight() {
  const direction = [
    { col: 2, row: 1 },
    { col: 2, row: -1 },
    { col: -2, row: 1 },
    { col: -2, row: -1 },
    { col: 1, row: 2 },
    { col: -1, row: 2 },
    { col: 1, row: -2 },
    { col: -1, row: -2 },
  ];

  initialState.hightLight.forEach((light) => {
    for (let dir of direction) {
      const col = light.y + dir.col;
      const row = light.x + dir.row;

      if (col < 0 || col > 7 || row < 0 || row > 7) break;

      const chess = initialState.board[col][row];

      if (chess && chess.includes("knight")) {
        if (!chess.includes(initialState.currentStep)) {
          initialState.hightLight = initialState.hightLight.filter(
            (coord) => coord.y !== light.y || coord.x !== light.x
          );
        }
      }
    }
  });
}

function checkKing() {
  const direction = [
    { col: -1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: -1 },
    { col: -1, row: -1 },
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 0, row: -1 },
  ];

  initialState.hightLight.forEach((light) => {
    for (let dir of direction) {
      const col = light.y + dir.col;
      const row = light.x + dir.row;

      if (col < 0 || col > 7 || row < 0 || row > 7) break;

      const chess = initialState.board[col][row];

      if (chess && chess.includes("king")) {
        if (!chess.includes(initialState.currentStep)) {
          initialState.hightLight = initialState.hightLight.filter(
            (coord) => coord.y !== light.y || coord.x !== light.x
          );
        }
      }
    }
  });
}

// функции проверки короля на шах и мат также логика выйгрыша
function checkEatKing() {
  checkPawn();
  checkRook();
  checkBishop();
  checkQueen();
  checkKnight();
  checkKing();

  if (initialState.hightLight.length === 0) {
    const win = document.createElement("div");
    const winText = document.createElement("p");
    winText.textContent = `Выйграли ${
      initialState.currentStep === "white" ? "черные" : "белые"
    }.
    Если хотите сыграть еще раз, обновите страницу.
    `;
    win.classList.add("win");
    winText.classList.add("win-text");
    win.appendChild(winText);
    document.body.appendChild(win);
  }
}

// для добавление класса подсвеченным клеткам
function handleNutureCell() {
  // пробегаюсь по клеткам и добавляю им подсветку 
  initialState.hightLight.map((coord) => {
    const cell = document.querySelector(
      `.block[data-y="${coord.y}"][data-x="${coord.x}"]`
    );
    cell && cell.classList.add("active-block");
  });
}

// сама подстветка 
function isLight(currentStep) {
  const { y, x } = currentStep;
  const figura = initialState.board[y][x];

  // если пешка
  if (figura.includes("pawn")) {
    const direction = initialState.currentStep === "white" ? -1 : 1; // направление в зависимости от цвета

    const firstStep = y === 6 || y === 1; // проверка первого хода

    // срубить фигуру
    for (let dir of [-1, 1]) {
      const col = y + direction;
      const row = x + dir;

      const chess = initialState.board[col][row];
      if (chess && !chess.includes(initialState.currentStep)) {
        initialState.hightLight.push({ y: col, x: row });
      }
    }

    const chess = initialState.board[y + direction][x]; //проверяю к ходу пешки есть ли там фигура

    // ход пешки если первая строка
    if (firstStep) {
      initialState.hightLight.push({ y: y + direction + direction, x: x });
    }
    // если фигуры нет, то хожу
    if (!chess) {
      initialState.hightLight.push({ y: y + direction, x: x });
    }
  }

  // если фигура - ладья
  if (figura.includes("rook")) {
    const direction = [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ];
    // пробегаюсь по направлением ладьи в цикле
    for (let dir of direction) {
      // начинаю с 1 потому что иначе фигура находит сама себя же и шахматы падают
      for (let i = 1; i <= 7; i++) {
        const col = y + dir.col * i;
        const row = x + dir.row * i;

        if (col < 0 || col > 7 || row < 0 || row > 7) break;

        const chess = initialState.board[col][row];

        // если фигуры нет то добавляю подсветку если есть на пути фигура противополжного цвета тоже добавляю в противном случаю обрываю массив
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

  if (figura.includes("bishop")) {
    const direction = [
      { col: -1, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: -1 },
      { col: -1, row: -1 },
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

  if (figura.includes("queen")) {
    const direction = [
      { col: -1, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: -1 },
      { col: -1, row: -1 },
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
  if (figura.includes("knight")) {
    const direction = [
      { col: 2, row: 1 },
      { col: 2, row: -1 },
      { col: -2, row: 1 },
      { col: -2, row: -1 },
      { col: 1, row: 2 },
      { col: -1, row: 2 },
      { col: 1, row: -2 },
      { col: -1, row: -2 },
    ];

    for (let dir of direction) {
      const col = y + dir.col;
      const row = x + dir.row;

      if (col < 0 || col >= 8 || row < 0 || row >= 8) continue;

      const chess = initialState.board[col][row];

      if (!chess) {
        initialState.hightLight.push({ y: col, x: row });
      } else {
        if (chess && !chess.includes(initialState.currentStep)) {
          initialState.hightLight.push({ y: col, x: row });
        }
      }
    }
  }

  if (figura.includes("king")) {
    const direction = [
      { col: -1, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: -1 },
      { col: -1, row: -1 },
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ];

    for (let dir of direction) {
      const col = y + dir.col;
      const row = x + dir.row;

      if (col < 0 || col >= 8 || row < 0 || row >= 8) continue;

      const chess = initialState.board[col][row];

      if (!chess) {
        initialState.hightLight.push({ y: col, x: row });
      } else {
        if (chess && !chess.includes(initialState.currentStep)) {
          initialState.hightLight.push({ y: col, x: row });
        }
      }
    }

    checkEatKing();
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

// логика хода фигур
function moveChess(futureStep, currentStep) {
  if (!currentStep) return;
  const chess = initialState.board[currentStep.y][currentStep.x];

  // если координаты в подстветке совпадают с кликнутыми координатами то перемещаю фигуру и вызываю смену текста добавление в съеденные фигуры
  // обнуляю глоабные переменные и перерендыриваю доску
  initialState.hightLight.map((coord) => {
    if (coord.y === futureStep.y && coord.x === futureStep.x) {
      initialState.board[futureStep.y][futureStep.x] = "";
      initialState.board[futureStep.y][futureStep.x] = chess;
      initialState.board[currentStep.y][currentStep.x] = "";
      initialState.currentChess = null;
      initialState.hightLight = [];
      initialState.currentStep =
        initialState.currentStep === "white" ? "black" : "white";
      updateText();
      addEatChess(coord.y, coord.x);
    }
  });

  renderBoard();
}

// логика клика на фигуру и пустую клетку 
function handlerClick(x, y) {
  // при клике удаляю класс с поднятием фигуры
  document.querySelectorAll("img").forEach((chess) => {
    chess.classList.remove("active-chess");
  });

  const chess = initialState.board[y][x];

  // если фигура есть и она цвета который ходит то добавляю ей активный класс; добавляю координаты фигуры 
  if (chess.includes(initialState.currentStep)) {
    const cell = document.querySelector(`.block[data-y="${y}"][data-x="${x}"]`);
    const domChess = cell.querySelector("img");
    domChess.classList.add("active-chess");
    initialState.currentChess = { y, x };
    initialState.hightLight = []; // обнуляю массив с подстветкой (потому что если нажимать на фигуры то подсвтека не убирается)
    renderBoard(); // рендерю доску чтобы отображалась текущая подсвтека
    isLight(initialState.currentChess); // проверяю подсвтеку 
  } else {
    // если фигура уже есть то получаю координаты другой любой клетку и отправляю все в локигу хода
    const currentStep = initialState.currentChess;
    const futureStep = { y, x };
    moveChess(futureStep, currentStep);
  }
}

// рендер доски
function renderBoard() {
  const board = document.querySelector(".chess_board"); // получаю саму доску
  board.innerHTML = ""; // обнуляю ее с каждым новым рендером

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.classList.add("block");

      // разукрашиваю доску в цвета
      if ((x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1)) {
        cell.classList.add("block-white");
      } else {
        cell.classList.add("block-black");
      }

      // добавляю цифры
      if (x === 0) {
        const newNum = document.createElement("span");
        newNum.classList.add("block-index");
        newNum.textContent = y + 1;
        cell.append(newNum);
      }

      // добавляю буквы
      if (y === 0) {
        const newChar = document.createElement("span");
        newChar.classList.add("block-char");
        newChar.textContent = String.fromCharCode(64 + x + 1);
        cell.appendChild(newChar);
      }

      // добавляю идентификацию всем клеткам
      cell.dataset.y = y;
      cell.dataset.x = x;

      const chess = initialState.board[y][x];

      // расставляю фигуры
      if (chess) {
        const figura = findChess(chess);
        cell.append(figura);
      }

      // клик по клеткке
      cell.addEventListener("click", () => handlerClick(x, y));

      board.appendChild(cell);
    }
  }
}
renderBoard();

// нахожу изображения в объекте с фигурами
function findChess(chess) {
  const [color, figura] = chess.split("-");
  return chessList[figura][color].cloneNode();
}
