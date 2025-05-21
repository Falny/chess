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

let stepToggle = true; // ходят черные

// выношу в глобаные пременные для сохранения значений от переписывания при каждом клике
let figura = null;
let currentCol = null;
let currentRow = null;

let lightMoves = []; // для сбора подсвтеки ходов

// добавляю алфиват и нумерацию на доску
// for (let i = 1; i <= 8; i++){
//   const newSpanAlpha = document.createElement('span')
//   const newSpanNum = document.createElement("span");

//   newSpanAlpha.textContent = String.fromCharCode(64 + i)
//   newSpanNum.textContent = i

//   textAlpha.appendChild(newSpanAlpha)
//   textNum.appendChild(newSpanNum)

// }

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

// const blocks = document.querySelectorAll(".block");

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
          stepRookBishopQueen(
            newCol,
            newRow,
            (direction = [
              { col: 1, row: 0 },
              { col: -1, row: 0 },
              { col: 0, row: 1 },
              { col: 0, row: -1 },
            ])
          );
        }

        // логика для ладьи
        if (figura?.src.includes("bishop")) {
          stepRookBishopQueen(
            newCol,
            newRow,
            (direction = [
              { col: -1, row: 1 },
              { col: 1, row: 1 },
              { col: 1, row: -1 },
              { col: -1, row: -1 },
            ])
          );
        }

        // логика для ладьи
        if (figura?.src.includes("queen")) {
          stepRookBishopQueen(
            newCol,
            newRow,
            (direction = [
              { col: -1, row: 1 },
              { col: 1, row: 1 },
              { col: 1, row: -1 },
              { col: -1, row: -1 },
              { col: 1, row: 0 },
              { col: -1, row: 0 },
              { col: 0, row: 1 },
              { col: 0, row: -1 },
            ])
          );
        }

        // логика для коня
        if (figura?.src.includes("knight")) {
          stepKnightKing(
            newCol,
            newRow,
            (direction = [
              { col: 2, row: 1 },
              { col: 2, row: -1 },
              { col: -2, row: 1 },
              { col: -2, row: -1 },
              { col: 1, row: 2 },
              { col: -1, row: 2 },
              { col: 1, row: -2 },
              { col: -1, row: -2 },
            ])
          );
        }

        if (figura?.src.includes("king")) {
          King(newCol, newRow);
        }
      }
    });
  });
});

function logicOnClick(figura, newCol, newRow) {
  if (figura.src.includes("pawn")) {
    lightPawn(newCol, newRow);
  }

  if (figura.src.includes("rook")) {
    highLightMoves(
      (direction = [
        { col: 1, row: 0 },
        { col: -1, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: -1 },
      ])
    );
  }

  if (figura.src.includes("bishop")) {
    highLightMoves(
      (direction = [
        { col: -1, row: 1 },
        { col: 1, row: 1 },
        { col: 1, row: -1 },
        { col: -1, row: -1 },
      ])
    );
  }

  if (figura.src.includes("queen")) {
    highLightMoves(
      (direction = [
        { col: -1, row: 1 },
        { col: 1, row: 1 },
        { col: 1, row: -1 },
        { col: -1, row: -1 },
        { col: 1, row: 0 },
        { col: -1, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: -1 },
      ])
    );
  }

  if (figura.src.includes("knight")) {
    highLightKnightKing(
      (direction = [
        { col: 2, row: 1 },
        { col: 2, row: -1 },
        { col: -2, row: 1 },
        { col: -2, row: -1 },
        { col: 1, row: 2 },
        { col: -1, row: 2 },
        { col: 1, row: -2 },
        { col: -1, row: -2 },
      ])
    );
  }

  if (figura.src.includes("king")) {
    highLightKnightKing(
      (direction = [
        { col: -1, row: 1 },
        { col: 1, row: 1 },
        { col: 1, row: -1 },
        { col: -1, row: -1 },
        { col: 1, row: 0 },
        { col: -1, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: -1 },
      ])
    );
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
    lightMoves.push(boardCell[newCol + direction + direction][newRow]);
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
        stepToggle = !stepToggle;
        updateText();
        figura = null;
      }
    }
  });

  if (boardCell[currentCol + direction][newRow].querySelector("img")) return; // проверка на занятость клетки фигурой

  // ход пешки; кликнутый столбец = текущему столбцу + направление
  // добавляю фигуру на новую клетку, удаляю активный класс
  // обновляю текущее состояние столбца и строки, и обнуляю фигуру
  if (
    (newCol === currentCol + direction + direction &&
      newRow === currentRow &&
      firstStep) ||
    (newCol === currentCol + direction && newRow === currentRow)
  ) {
    addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру на новую клетку
    stepToggle = !stepToggle;
    updateText();
    figura = null;
  }
}

// подсветка ладьи слона королевы
function highLightMoves(direction) {
  const isBlack = figura.src.includes("black");

  direction.forEach((dir) => {
    for (let i = 1; i <= 8; i++) {
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

          if (figuraInWay) break;

          lightMoves.push(boardCell[targetCol][targetRow]);
        }
      }
    }
  });
}

// логика ладьи слона королевы
function stepRookBishopQueen(newCol, newRow, direction) {
  const isBlack = figura.src.includes("black");

  // пробегаюсь по ходам в цикле и заворачиваю еще в один цикл для увелеичения ходов по всей доске
  direction.forEach((dir) => {
    for (let i = 1; i <= 8; i++) {
      const targetCol = currentCol + dir.col * i; // ходы по колонке
      const targetRow = currentRow + dir.row * i; // ходы по строке

      // проверка выхода за границы доски
      if ((targetCol < 1 || targetCol > 8) && (targetRow < 1 || targetRow > 8))
        break;

      // сама логика ходов; новая позиция должна быть равно цели и также со строкой
      if (newCol === targetCol && newRow === targetRow) {
        // нахожу изображение по новым координатам
        const figuraCut = boardCell[newCol][newRow]?.querySelector("img");
        // если фигура есть и она противоположного цвета, то срубить ее
        if (figuraCut && figuraCut.src.includes(isBlack ? "white" : "black")) {
          const copyFiguraCut = figuraCut.cloneNode();
          addEatFigura(figuraCut.src.includes("black"), copyFiguraCut);
          figuraCut.remove(); // удаляю фигуру
          addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру
          stepToggle = !stepToggle; // меняю ход
          updateText();
          figura = null; // обнуляю глобал переменную
        } else {
          addInFiguraAndLight(newCol, newRow, figura);
          stepToggle = !stepToggle;
          updateText();
          figura = null;
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
  });
}

function highLightKnightKing(direction) {
  const isBlack = figura.src.includes("black");

  // пробегаюсь по ходам в цикле и заворачиваю еще в один цикл для увелеичения ходов по всей доске
  for (const dir of direction) {
    const targetCol = currentCol + dir.col; // ходы по колонке
    const targetRow = currentRow + dir.row; // ходы по строке

    // проверка выхода за границы доски
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
        // если клеткая пустая, то подсвечиваю
        if (!figuraInWay) {
          lightMoves.push(boardCell[targetCol][targetRow]);
        }
      }
    }
  }
}

function stepKnightKing(newCol, newRow, direction) {
  const isBlack = figura.src.includes("black");

  // пробегаюсь по ходам в цикле и заворачиваю еще в один цикл для увелеичения ходов по всей доске
  for (const dir of direction) {
    const targetCol = currentCol + dir.col; // ходы по колонке
    const targetRow = currentRow + dir.row; // ходы по строке

    // проверка выхода за границы доски
    if ((targetCol < 1 || targetCol > 8) && (targetRow < 1 || targetRow > 8))
      break;

    if (newCol === targetCol && newRow === targetRow) {
      // сама логика ходов; новая позиция должна быть равно цели и также со строкой
      // нахожу изображение по новым координатам
      const figuraCut = boardCell[newCol][newRow]?.querySelector("img");
      // если фигура есть и она противоположного цвета, то срубить ее
      if (figuraCut && figuraCut.src.includes(isBlack ? "white" : "black")) {
        const copyFiguraCut = figuraCut.cloneNode();
        addEatFigura(figuraCut.src.includes("black"), copyFiguraCut);
        figuraCut.remove(); // удаляю фигуру
        addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру
        stepToggle = !stepToggle; // меняю ход
        updateText();
        figura = null; // обнуляю глобал переменную
      } else {
        addInFiguraAndLight(newCol, newRow, figura);
        stepToggle = !stepToggle;
        updateText();
        figura = null;
      }
    }
  }
}
// добавление фигуры на клетку; удаление класса; обновление глобальных переменных
function addInFiguraAndLight(col, row, figura) {
  boardCell[col][row].appendChild(figura);
  figura.classList.remove("active-chess"); // удаляю активный класс
  currentCol = col;
  currentRow = row;
}

// дальше только реализация короля и его логики
function King(newCol, newRow) {
  direction = [
    { col: -1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: -1 },
    { col: -1, row: -1 },
    { col: 1, row: 0 },
    { col: -1, row: 0 },
    { col: 0, row: 1 },
    { col: 0, row: -1 },
  ];

  const isBlack = figura.src.includes("black");

  for (const dir of direction) {
    const targetCol = currentCol + dir.col;
    const targetRow = currentRow + dir.row;

    if ((targetCol < 1 || targetCol > 8) && (targetRow < 1 || targetRow > 8))
      break;

    if (
      newCol === targetCol &&
      newRow === targetRow &&
      !checkInKing(targetCol, targetRow, isBlack)
    ) {
      const figuraCut = boardCell[newCol][newRow]?.querySelector("img");
      // если фигура есть и она противоположного цвета, то срубить ее
      if (figuraCut && figuraCut.src.includes(isBlack ? "white" : "black")) {
        const copyFiguraCut = figuraCut.cloneNode();
        addEatFigura(figuraCut.src.includes("black"), copyFiguraCut);
        figuraCut.remove(); // удаляю фигуру
        addInFiguraAndLight(newCol, newRow, figura); // добавляю фигуру
        stepToggle = !stepToggle; // меняю ход
        updateText();
        figura = null; // обнуляю глобал переменную
      } else {
        addInFiguraAndLight(newCol, newRow, figura);
        stepToggle = !stepToggle;
        updateText();
        figura = null;
      }
    }
  }
}

function checkInKing(kingCol, kingRow, isBlack) {
  for (let y = 1; y <= 8; y++) {
    for (let x = 1; x <= 8; x++) {
      const chess = boardCell[y][x].querySelector("img"); // нахожу все фигуры
      if (chess && chess.src.includes(isBlack ? "black" : "white")) break; // если они того же цвета что и король выхожу из цикла

      let canAttack = false;
      if (chess?.src.includes("pawn")) {
        canAttack = canAttackPawn(y, x, kingCol, kingRow, isBlack);
      } else if (chess?.src.includes("rook")) {
        canAttack = canAttackRook(y, x, kingCol, kingRow);
      } else if (chess?.src.includes("bishop")) {
        canAttack = canAttackBishop(y, x, kingCol, kingRow, isBlack);
      } else if (chess?.src.includes("queen")) {
        canAttack =
          canAttackRook(y, x, kingCol, kingRow) ||
          canAttackBishop(y, x, kingCol, kingRow, isBlack);
      } else if (chess?.src.includes("knight")) {
        canAttack = canAttackKnight(y, x, kingCol, kingRow, isBlack);
      }

      if (canAttack) return true;
    }
  }
  return false;
}

function canAttackPawn(y, x, kingCol, kingRow, isBlack) {
  const direction = isBlack ? 1 : -1;
  return kingCol === y + direction && (kingRow === x + 1 || kingRow === x - 1);
}

function canAttackRook(y, x, kingCol, kingRow) {
  // если колонки равны то смотрим строки на наличии преград
  if (y === kingCol) {
    const step = x < kingRow ? 1 : -1; // ход; если ладья выше короля то прибавляем и наоборот
    for (let row = x + step; row != kingRow; row += step) {
      // пробагаюсь в цикле по строке с прибавлением хода
      if (row < 1 || row > 8) break; // выход за границы
      const img = boardCell[y][row].querySelector("img"); // нахожу изображение
      if (img) return false; // если оно сущестует и не является королем то пропускаем
    }
    return true;
  }

  if (x === kingRow) {
    const step = y < kingCol ? 1 : -1;
    for (let col = y + step; col !== kingCol; col += step) {
      if (col < 1 || col > 8) break;
      const img = boardCell[col][x].querySelector("img");
      if (img) return false;
    }
    return true;
  }
}

function canAttackBishop(y, x, kingCol, kingRow, isBlack) {
  const stepCol = y < kingCol ? 1 : -1;
  const stepRow = x < kingRow ? 1 : -1;

  for (let i = 1; i <= 8; i++) {
    const col = y + stepCol * i;
    const row = x + stepRow * i;

    // Проверка границ доски
    if (col < 1 || col > 8 || row < 1 || row > 8) break;

    if (col === kingCol && row === kingRow) {
      return true;
    }

    const img = boardCell[col][row].querySelector("img");
    if (img) {
      if (img.src.includes(isBlack ? "black" : "white")) {
        continue;
      }
      return false;
    }
  }

  return false;
}

function canAttackKnight(y, x, kingCol, kingRow, isBlack) {
  
}
