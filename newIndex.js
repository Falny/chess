const board = document.querySelector(".chess_board"); // получение доски
const text = document.querySelector(".text"); // текст для ходов
const whiteChess = document.querySelector(".chess-white"); // для вида какие фигуры съели
const blackChess = document.querySelector(".chess-black"); // для вида какие фигуры съели

const chessList = {};
const chesses = ["king", "bishop", "knight", "pawn", "queen", "rook"];
const colors = ["black", "white"];

const boardCell = []; // для обращения по координатам

let stepToggle = true; // ходят черные

// выношу в глобаные пременные для сохранения значений от переписывания при каждом клике
let figura = null;
let currentCol = null;
let currentRow = null;

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

      if (!figura) {
        // проврека содержания фигуры и добавление в глобаные переменные для сохранения
        if (cell.firstChild) {
          const img = cell.querySelector("img");
          const currentColor = img.src.includes("black"); // текущий цвет фигуры
          // проверка текущего цвета и цвета, который ходит

          img.classList.add("active-chess"); //добавляю класс к фигуре
          figura = img;
          currentCol = indexColumn;
          currentRow = indexRow;
        }
      }

      // проверка выхода за границы
      if (newCol >= 1 && newCol < 9 && newRow >= 1 && newRow < 9) {
        // логика пешек
        if (figura?.src.includes("pawn")) {
          stepPawn(newCol, newRow);
        }
      }
      console.log(figura)
    });
  });
});

function lightStep(col, row) {
  boardCell[col][row].classList.add("active-block");
}

function stepPawn(newCol, newRow) {
  const isBlack = figura.src.includes("black"); // определяю черная или белая фигура
  const direction = isBlack ? -1 : 1; // направление пешек

  lightStep(newCol, newRow);

  // проверка первого хода пешки
  const firstStep =
    (isBlack && currentCol === 7) || (!isBlack && currentCol === 2);

  // переменные для нахождения фигуры для съедения
  const cutFuguraCol = currentCol + direction;
  const cutFiguraRowRight = currentRow + 1;
  const cutFiguraRowLeft = currentRow - 1;

  // проверяю если новая позиция равна срезу фигуры по индексам, то нахожу клетку, потом фигуру в клетке,
  // проверяю цвет, должен быть отличен он текущй фигуры, удалю и добавляю текущую фигуру на новое место
  //удаляю активный класс и сбрасываю глобальное значение
  if (
    newCol === cutFuguraCol &&
    (newRow === cutFiguraRowLeft || newRow === cutFiguraRowRight)
  ) {
    const figuraCut = boardCell[newCol][newRow].querySelector("img");
    if (figuraCut && figuraCut.src.includes(isBlack ? "white" : "black")) {
      figuraCut.remove();
      boardCell[newCol][newRow].appendChild(figura);
      figura.classList.remove("active-chess"); // удаляю активный класс
      figura = null;
    }
  }

  // ход пешки; кликнутый столбец = текущему столбцу + направление
  // добавляю фигуру на новую клетку, удаляю активный класс
  // обновляю текущее состояние столбца и строки, и обнуляю фигуру
  if (
    (newCol === currentCol + direction + direction &&
      newRow === currentRow &&
      firstStep) ||
    (newCol === currentCol + direction && newRow === currentRow)
  ) {
    boardCell[newCol][newRow].appendChild(figura); // добавляю фигуру на новую клетку
    figura.classList.remove("active-chess"); // удаляю активный класс
    currentCol = newCol;
    currentRow = newRow;
    stepToggle = !stepToggle;
    figura = null;
  }
}
