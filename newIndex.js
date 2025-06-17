const board = document.querySelector(".chess_board"); // получение доски
const text = document.querySelector(".text"); // текст для ходов
const whiteChess = document.querySelector(".chess-white"); // для вида какие фигуры съели
const blackChess = document.querySelector(".chess-black"); // для вида какие фигуры съели
const textAlpha = document.querySelector(".text-alpha"); // для вида какие фигуры съели
const textNum = document.querySelector(".text-num"); // для вида какие фигуры съели

const chessList = {};
const chesses = ["king", "bishop", "knight", "pawn", "queen", "rook"];
const colors = ["black", "white"];

const boardCell = []; // для обращения по координатам
let checkWin = 0

let stepToggle = true; // ходят черные

// выношу в глобаные пременные для сохранения значений от переписывания при каждом клике
let figura = null;
let currentCol = null;
let currentRow = null;

let lightMoves = []; // для сбора подсвтеки ходов

//для добавления съеденых фигур
function addEatFigura(pathBoolean, figura) {
  if (pathBoolean) {
    blackChess.appendChild(figura);
  } else {
    whiteChess.appendChild(figura);
  }
}
// смена текста
function updateText() {
  text.textContent = `Ходят ${stepToggle ? "белые" : "черные"}`;
}
updateText();

const directionRook = [
  { col: 1, row: 0, chess: "rook" },
  { col: -1, row: 0, chess: "rook" },
  { col: 0, row: 1, chess: "rook" },
  { col: 0, row: -1, chess: "rook" },
];

const directionBishop = [
  { col: -1, row: 1, chess: "bishop" },
  { col: 1, row: 1, chess: "bishop" },
  { col: 1, row: -1, chess: "bishop" },
  { col: -1, row: -1, chess: "bishop" },
];

const directionQueen = [
  { col: -1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: -1 },
  { col: -1, row: -1 },
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

const directionKnight = [
  { col: 2, row: 1, chess: "knight" },
  { col: 2, row: -1, chess: "knight" },
  { col: -2, row: 1, chess: "knight" },
  { col: -2, row: -1, chess: "knight" },
  { col: 1, row: 2, chess: "knight" },
  { col: -1, row: 2, chess: "knight" },
  { col: 1, row: -2, chess: "knight" },
  { col: -1, row: -2, chess: "knight" },
];

const directionKing = [
  { col: -1, row: 1, chess: "king" },
  { col: 1, row: 1, chess: "king" },
  { col: 1, row: -1, chess: "king" },
  { col: -1, row: -1, chess: "king" },
  { col: 1, row: 0, chess: "king" },
  { col: -1, row: 0, chess: "king" },
  { col: 0, row: 1, chess: "king" },
  { col: 0, row: -1, chess: "king" },
];

//получение изображений
chesses.forEach((chess) => {
  chessList[chess] = {};
  colors.forEach((color) => {
    const img = document.createElement("img");
    img.src = `./img/${color}-${chess}.svg`;
    img.classList.add("chess");

    chessList[chess][color] = img;
  });
});

for (let y = 1; y <= 8; y++) {
  boardCell[y] = []; // строка по у
  for (let x = 1; x <= 8; x++) {
    const block = document.createElement("div"); // создание клетки
    block.classList.add("block"); //добаляю клетки класс
    boardCell[y][x] = block; // добавление х по строкам

    // раскрас клеток
    if ((y % 2 === 1 && x % 2 === 0) || (y % 2 === 0 && x % 2 === 1)) {
      block.classList.add("block-white");
    } else {
      block.classList.add("block-black");
    }

    // добавляю цифры на доску
    if (x === 1) {
      const newNum = document.createElement("span");
      newNum.classList.add("block-index");
      newNum.textContent = y;
      block.appendChild(newNum);
    }

    if (y === 1) {
      const newChar = document.createElement("span");
      newChar.classList.add("block-char");
      newChar.textContent = String.fromCharCode(64 + x);
      block.appendChild(newChar);
    }

    board.append(block); //добавляю клетку на доску
  }
}

// расстановка фигур
addChessPawn(boardCell[2], chessList.pawn.white); // белые пешки
addChessPawn(boardCell[7], chessList.pawn.black); // черные пешки

addChessWithoutQueenAndKing(
  boardCell[1][1],
  boardCell[1][8],
  chessList.rook.white
); //расстановка ладьи
addChessWithoutQueenAndKing(
  boardCell[8][1],
  boardCell[8][8],
  chessList.rook.black
); //расстановка ладьи

addChessWithoutQueenAndKing(
  boardCell[1][3],
  boardCell[1][6],
  chessList.bishop.white
); //расстановка слона
addChessWithoutQueenAndKing(
  boardCell[8][3],
  boardCell[8][6],
  chessList.bishop.black
); //расстановка слона

addChessWithoutQueenAndKing(
  boardCell[1][2],
  boardCell[1][7],
  chessList.knight.white
); //расстановка коня
addChessWithoutQueenAndKing(
  boardCell[8][2],
  boardCell[8][7],
  chessList.knight.black
); //расстановка коня

addQueenAndKing(boardCell[1][4], chessList.queen.white); // расстановка королев
addQueenAndKing(boardCell[8][5], chessList.queen.black); // расстановка королев

addQueenAndKing(boardCell[1][5], chessList.king.white); // расстановка корлей
addQueenAndKing(boardCell[8][4], chessList.king.black); // расстановка корлей

// функиции для расстновки фигур
function addChessPawn(blocks, chess) {
  blocks.forEach((block) => {
    block.appendChild(chess.cloneNode());
  });
}

function addChessWithoutQueenAndKing(block1, block2, chess) {
  block1.appendChild(chess.cloneNode());
  block2.appendChild(chess.cloneNode());
}

function addQueenAndKing(block1, chess) {
  block1.appendChild(chess);
}

// обращение по типу столбец строка [2][3]
boardCell.forEach((blocks, indexColumn) => {
  blocks.forEach((block, indexRow) => {
    block.addEventListener("click", (e) => {
      const cell = e.currentTarget; // клетка

      const newCol = indexColumn; // текущий столбец
      const newRow = indexRow; // текущая строка

      clearLight();

      // для выбора новой фигуры того же цвета
      if (figura && cell.firstChild) {
        const newFigura = cell.querySelector("img");
        if (newFigura) {
          const currentColor = newFigura.src.includes("black"); // текущий цвет фигуры
          if (
            newFigura.src.includes(currentColor) ===
            figura.src.includes(currentCol)
          ) {
            if (currentColor != stepToggle) {
              figura.classList.remove("active-chess");
              newFigura.classList.add("active-chess"); //добавляю класс к фигуре
              figura = newFigura;
              currentCol = newCol;
              currentRow = newRow;

              logicOnClick(newFigura, newCol, newRow);
            }
          }
        }
      }

      // проврека содержания фигуры и добавление в глобаные переменные для сохранения
      if (!figura && cell.firstChild) {
        const img = cell.querySelector("img");

        if (img) {
          const currentColor = img.src.includes("black"); // текущий цвет фигуры

          // проверка хода
          if (currentColor !== stepToggle) {
            // проверка текущего цвета и цвета, который ходит
            img.classList.add("active-chess"); //добавляю класс к фигуре
            figura = img;
            currentCol = newCol;
            currentRow = newRow;

            logicOnClick(figura, newCol, newRow);
          }
        }
      }

      // проверка выхода за границы
      if (newCol >= 1 && newCol < 9 && newRow >= 1 && newRow < 9) {
        // логика пешек
        if (figura?.src.includes("pawn")) {
          stepPawn(newCol, newRow);
        }

        // логика для ладьи
        if (figura?.src.includes("rook")) {
          Steps(newCol, newRow, directionRook, false);
        }

        // логика для ладьи
        if (figura?.src.includes("bishop")) {
          Steps(newCol, newRow, directionBishop, false);
        }

        // логика для ладьи
        if (figura?.src.includes("queen")) {
          Steps(newCol, newRow, directionQueen, false);
        }

        // логика для коня
        if (figura?.src.includes("knight")) {
          Steps(newCol, newRow, directionKnight, true);
        }

        if (figura?.src.includes("king")) {
          Steps(newCol, newRow, directionKing, true);
        }
      }
    });
  });
});

// функция с подсветкой
function logicOnClick(figura, newCol, newRow) {
  if (figura.src.includes("pawn")) {
    lightPawn(newCol, newRow);
  }

  if (figura.src.includes("rook")) {
    hightLight(directionRook, false, false);
  }

  if (figura.src.includes("bishop")) {
    hightLight(directionBishop, false, false);
  }

  if (figura.src.includes("queen")) {
    hightLight(directionQueen, false, false);
  }

  if (figura.src.includes("knight")) {
    hightLight(directionKnight, false, true);
  }

  if (figura.src.includes("king")) {
    hightLight(directionKing, true, true);
  }

  lightStep();
}

// функция для подсветки, пробегаюсь по ктекам и добавляю к ним класс
function lightStep() {
  lightMoves.forEach((block) => {
    block.classList.add("active-block");
  });
}
// функция для удаленияподсветки, пробегаюсь по ктекам и удаляю у ним класс
function clearLight() {
  lightMoves.forEach((block) => {
    block.classList.remove("active-block");
  });
  lightMoves = [];
}
// подсветка пешек
function lightPawn(newCol, newRow) {
  const isBlack = figura.src.includes("black"); // определяю черная или белая фигура
  const direction = isBlack ? -1 : 1; // направление пешек

  const firstStep =
    (isBlack && currentCol === 7) || (!isBlack && currentCol === 2);

  [-1, 1].forEach((dir) => {
    const col = newCol + direction;
    const row = newRow + dir;

    const target = boardCell[col][row]?.querySelector("img");
    if (target && target.src.includes(isBlack ? "white" : "black")) {
      lightMoves.push(boardCell[col][row]);
    }
  });

  if (boardCell[newCol + direction][newRow].querySelector("img")) return;

  if (firstStep && boardCell[newCol + direction + direction][newRow]) {
    if (
      firstStep &&
      !boardCell[currentCol + direction + direction][newRow].querySelector(
        "img"
      )
    ) {
      lightMoves.push(boardCell[newCol + direction + direction][newRow]);
    }
  }
  lightMoves.push(boardCell[newCol + direction][newRow]);
}
// логика ходов пешей
function stepPawn(newCol, newRow) {
  const isBlack = figura.src.includes("black"); // определяю черная или белая фигура
  const direction = isBlack ? -1 : 1; // направление пешек

  // проверка первого хода пешки
  const firstStep =
    (isBlack && currentCol === 7) || (!isBlack && currentCol === 2);

  // проверяю если новая позиция равна по индексам, то нахожу клетку, потом фигуру в клетке,
  // проверяю цвет, должен быть отличен он текущй фигуры, удаляю и добавляю текущую фигуру на новое место
  //удаляю активный класс и сбрасываю глобальное значение
  [-1, 1].forEach((dir) => {
    const col = currentCol + direction; // столбец
    const row = currentRow + dir; // строка с цифрами из цикла

    if (newCol === col && newRow === row) {
      const figuraCut = boardCell[newCol][newRow].querySelector("img");
      if (figuraCut && figuraCut.src.includes(isBlack ? "white" : "black")) {
        const copyFiguraCut = figuraCut.cloneNode();
        addEatFigura(figuraCut.src.includes("black"), copyFiguraCut);
        figuraCut.remove();
        addInFiguraAndLight(newCol, newRow, figura);
        updateText();
      }
    }
  });

  if (boardCell[currentCol + direction][newRow].querySelector("img")) return; // проверка на занятость клетки фигурой

  // проверка на занятость клетки фигурой

  // ход пешки; кликнутый столбец = текущему столбцу + направление
  // добавляю фигуру на новую клетку, удаляю активный класс
  // обновляю текущее состояние столбца и строки, и обнуляю фигуру

  if (
    newCol === currentCol + direction + direction &&
    newRow === currentRow &&
    firstStep
  ) {
    // доп проверка на первый ход, то есть если передо мной стоит фигура проитвоположного цвета, когда я стою на первоначальной линии
    if (
      firstStep &&
      !boardCell[currentCol + direction + direction][newRow].querySelector(
        "img"
      )
    )
      addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру на новую клетку
    updateText();
  }

  if (newCol === currentCol + direction && newRow === currentRow) {
    addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру на новую клетку
    updateText();
  }
}

// общая подсветка для фигур кроме пешек
function hightLight(direction, isKing, isOneStep) {
  const isBlack = figura.src.includes("black");

  // пробегаюсь по ходам в цикле и заворачиваю еще в один цикл для увелеичения ходов по всей доске
  for (const dir of direction) {
    const maxStep = isOneStep ? 1 : 8;

    for (let i = 1; i <= maxStep; i++) {
      const targetCol = currentCol + dir.col * i;
      const targetRow = currentRow + dir.row * i;

      if ((targetCol < 1 || targetCol > 8) && (targetRow < 1 || targetRow > 8))
        break;

      if (boardCell[targetCol]) {
        if (boardCell[targetCol][targetRow]) {
          const figuraInWay =
            boardCell[targetCol][targetRow]?.querySelector("img");
          // если фигура отлична от цвета фигуры то ее тоже подсвечиваю
          if (
            figuraInWay &&
            figuraInWay.src.includes(isBlack ? "white" : "black")
          ) {
            lightMoves.push(boardCell[targetCol][targetRow]);
          }

          if (!figuraInWay) {
            // здесь я добавила проверку с ходом короля
            if (isKing && CheckEatKing(targetCol, targetRow, isBlack)) {
              continue;
            }

            lightMoves.push(boardCell[targetCol][targetRow]);
          }

          if (figuraInWay && !isKing) break;
        }
      }
    }
  }
}

// логика всех фигур кроме пешек
function Steps(newCol, newRow, direction, isOneStep) {
  const isBlack = figura.src.includes("black");

  // пробегаюсь по ходам в цикле и заворачиваю еще в один цикл для увелеичения ходов по всей доске
  for (const dir of direction) {
    const maxStep = isOneStep ? 1 : 8;
    for (let i = 1; i <= maxStep; i++) {
      const targetCol = currentCol + dir.col * i; // ходы по колонке
      const targetRow = currentRow + dir.row * i; // ходы по строке

      // проверка выхода за границы доски
      if ((targetCol < 1 || targetCol > 8) && (targetRow < 1 || targetRow > 8))
        break;

      // сама логика ходов; новая позиция должна быть равно цели и также со строкой
      if (newCol === targetCol && newRow === targetRow) {
        if (figura.src.includes("king")) {
          if (CheckEatKing(targetCol, targetRow, isBlack)) {
            alert("вы не можете сюда ходить");
            return;
          }
        }
        // нахожу изображение по новым координатам
        const figuraCut = boardCell[newCol][newRow]?.querySelector("img");
        // если фигура есть и она противоположного цвета, то срубить ее
        if (figuraCut && figuraCut.src.includes(isBlack ? "white" : "black")) {
          const copyFiguraCut = figuraCut.cloneNode();
          addEatFigura(figuraCut.src.includes("black"), copyFiguraCut);
          figuraCut.remove(); // удаляю фигуру
          addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру
          updateText();
        } else {
          addInFiguraAndLight(newCol, newRow, figura);
          updateText();
        }
      }

      // тк есть ораничение по границам, то проверяю существование и столбца и строки, получаю фигуру если она есть и сбрасываю для того, чтобы фигура не перепрыгивала через другие
      if (boardCell[targetCol]) {
        if (boardCell[targetCol][targetRow]) {
          const figuraInWay =
            boardCell[targetCol][targetRow]?.querySelector("img");
          if (figuraInWay) break;
        }
      }
    }
  }
}

// добавление фигуры на клетку; удаление класса; обновление глобальных переменных
function addInFiguraAndLight(col, row, figuraCurrent) {
  boardCell[col][row].appendChild(figuraCurrent);
  figuraCurrent.classList.remove("active-chess"); // удаляю активный класс
  currentCol = col;
  currentRow = row;
  figura = null; // обнуляю глобал переменную
  stepToggle = !stepToggle; // меняю ход
}

//проверка ходов короля
const CheckEatKing = (colKing, rowKing, isBlack) => {
  if (CheckPawn(colKing, rowKing, isBlack)) return true;
  for (let i of [directionBishop, directionRook, directionQueen]) {
    if (CheckSteps(colKing, rowKing, isBlack, i, false)) return true;
  }
  if (CheckSteps(colKing, rowKing, isBlack, directionKnight, true)) return true;
  if (checkKing(colKing, rowKing, isBlack, directionKing)) return true;

  // checkWin = 0;

  return false;
};

// проверка для пешек
function CheckPawn(colKing, rowKing, isBlack) {
  const direction = isBlack ? -1 : 1;

  for (var dirRow of [-1, 1]) {
    const targetCol = colKing + direction;
    const targetRow = rowKing + dirRow;
    // если на пути встречается изображение и оно противоположного цвета то пропускаю
    if (
      boardCell[targetCol][targetRow]
        ?.querySelector("img")
        ?.src.includes(isBlack ? "white-pawn" : "black-pawn")
    ) {
      checkWin++
      return true;
    }
  }
  return false;
}
// проверка короля
function checkKing(colKing, rowKing, isBlack, direction) {
  const colorCheck = isBlack ? "white" : "black";
// пробегаюсь по координатам короля
  for (let dir of direction) {
    const targetCol = colKing + dir.col;
    const targetRow = rowKing + dir.row;

    if (targetCol > 8 || targetRow > 8 || targetCol < 1 || targetRow < 1) // выход за гранциу
      continue;

    const cell = boardCell[targetCol][targetRow]?.querySelector("img"); // нахожу ячейку с изображением

    const king =
      dir.chess === "king" && cell?.src.includes(`${colorCheck}-king`); // проверяю что изображение это король

    // есди король, то ходить нельзя - пропускаю
    if (king) {
      checkWin++;
      return true;
    }
  }
  return false;
}
// остальные фигуры 
function CheckSteps(colKing, rowKing, isBlack, direction, isOneStep) {
  const colorCheck = isBlack ? "white" : "black";

  for (let dir of direction) {
    const maxStep = isOneStep ? 1 : 8; //проверка на то как ходит фигура - скользящая она или нет

    //ПОХОЖИЙ КОД ЕСТЬ В ФУНКЦИИ С КОРОЛЕМ
    for (let i = 1; i <= maxStep; i++) {
      const targetCol = colKing + dir.col * i;
      const targetRow = rowKing + dir.row * i;

      if (targetCol > 8 || targetRow > 8 || targetCol < 1 || targetRow < 1)
        continue;

      const cell = boardCell[targetCol][targetRow]?.querySelector("img");

      const rook =
        dir.chess === "rook" && cell?.src.includes(`${colorCheck}-rook`);
      const bishop =
        dir.chess === "bishop" && cell?.src.includes(`${colorCheck}-bishop`);
      const queen = cell?.src.includes(`${colorCheck}-queen`);
      const knight =
        dir.chess === "knight" && cell?.src.includes(`${colorCheck}-knight`);

      if (!knight) {
        if (cell && !rook && !bishop && !queen) break; // проверка фигур на пути, не косается фигуры коня
      }

      if (rook || bishop || queen || knight) {
        checkWin++;
        return true;
      }
    }
  }
  return false;
}
console.log(checkWin)

if (checkWin === 8) {
  win()
}
  function win() {
    alert("вы выйграли");
  }
