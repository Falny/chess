const board = document.querySelector(".chess_board"); // получение доски
const text = document.querySelector(".text"); // текст для ходов
const whiteChess = document.querySelector(".chess-white"); // для вида какие фигуры съели
const blackChess = document.querySelector(".chess-black"); // для вида какие фигуры съели

const chessList = {};
const chesses = ["king", "bishop", "knight", "pawn", "queen", "rook"];
const colors = ["black", "white"];

// сбор 3 фигур для простого вызова
const unionBishopRookQueen = [
  {
    name: "bishop",
    steps: [7, -7, 9, -9],
  },
  {
    name: "rook",
    steps: [-1, 1, -8, 8],
  },
  {
    name: "queen",
    steps: [-1, 1, -8, 8, 7, -7, 9, -9],
  },
];
// тоже самое что и unionBishopRookQueen
const unionK = [
  {
    name: "king",
    steps: [1, -1, 8, -8, 7, -7, 9, -9],
  },
  {
    name: "knight",
    steps: [17, -17, 15, -15, -10, 10, -6, 6],
  },
];

let stepToggle = true; // смена хода; на тру ходят черные

let flagLine = false; // смена флага для смены раскраса линий
let indexForDesk = 1; // индекс для цивра рядом с доской'

let possibleStep = [];

const borderLeft = [];
let borderRight = [];

// обновление состояния текста
function updateText() {
  text.textContent = `Ходят ${stepToggle ? "черные" : "белые"}`;
}
updateText();

// добавляю ссылки на изображения в объект
chesses.forEach((chess) => {
  chessList[chess] = {};
  colors.forEach((color) => {
    const img = document.createElement("img");

    img.src = `./img/${color}-${chess}.svg`;
    img.classList.add("chess");

    chessList[chess][color] = img;
  });
});

const allChesses = document.getElementsByClassName("chess"); // получаю все шахматы

// разметка доски
for (let i = 1; i <= 64; i++) {
  const newEl = document.createElement("div"); // создаю элемент для доски

  // если флаг тру то закрашиваю одни поля и ноборот
  if ((i % 2 === 0) === flagLine) {
    newEl.classList.add("block-white");
  } else {
    newEl.classList.add("block-black");
  }

  // смена линии для цвета
  if (i % 8 === 0) {
    flagLine = !flagLine; // меняю линию закрашивании
    borderRight.push(i);

    const spanEl = document.createElement("span"); // создаю элемент для цифр рядом с доской
    spanEl.classList.add("block-index");
    spanEl.textContent = indexForDesk; // добавляю индекс для блока
    newEl.append(spanEl);
    indexForDesk += 1; // увеличиваю индекс блоков возле доски
  } else if (i % 8 === 7) {
    borderLeft.push(i);
  }

  // для добавления букв на доску
  if (i <= 8) {
    const charEl = document.createElement("span"); // создаю элемент для цифр рядом с доской
    charEl.classList.add("block-char");
    charEl.textContent = String.fromCharCode(64 + i); // добавляю буквы к доске с прибавлением индекса для смены
    newEl.append(charEl);
  }
  // добавление ладьи
  if (i === 57 || i === 64) {
    newEl.appendChild(chessList.rook.black.cloneNode());
  }
  if (i === 1 || i === 8) {
    newEl.appendChild(chessList.rook.white.cloneNode());
  }
  // добавление ферьзя
  if (i === 58 || i === 63) {
    newEl.appendChild(chessList.bishop.black.cloneNode());
  }
  if (i === 2 || i === 7) {
    newEl.appendChild(chessList.bishop.white.cloneNode());
  }
  // добавление коня
  if (i === 59 || i === 62) {
    newEl.appendChild(chessList.knight.black.cloneNode());
  }
  if (i === 3 || i === 6) {
    newEl.appendChild(chessList.knight.white.cloneNode());
  }

  // добавление королевы
  if (i === 61) {
    newEl.appendChild(chessList.queen.black.cloneNode());
  }
  if (i === 4) {
    newEl.appendChild(chessList.queen.white.cloneNode());
  }

  // добавление короля
  if (i === 60) {
    newEl.appendChild(chessList.king.black.cloneNode());
  }
  if (i === 5) {
    newEl.appendChild(chessList.king.white.cloneNode());
  }

  // добавление пешек
  if (i >= 49 && i <= 56) {
    newEl.appendChild(chessList.pawn.black.cloneNode());
  }
  if (i >= 9 && i <= 16) {
    newEl.appendChild(chessList.pawn.white.cloneNode());
  }
  newEl.classList.add("block"); // добавляю класс
  board.appendChild(newEl); // добавляю блок в главный див
}

const blocks = document.querySelectorAll(".block"); // получаю клетки доски

// все фигуры; по клику добавляю класс; добавляю в глобальную переменную
Array.from(allChesses).forEach((chess) => {
  chess.addEventListener("click", (e) => {
    const itemChess = e.target; // фигура шахмат
    const currentPosition = Array.from(blocks).indexOf(itemChess.parentNode);

    // проверяю смену хода и содержание цвета в пути
    if (
      (stepToggle && itemChess.src.includes("black")) ||
      (!stepToggle && itemChess.src.includes("white"))
    ) {
      itemChess.classList.add("active-chess"); //добавление активного класса
      window.globalFigure = itemChess; // добавляю в глобальную переменную
    }

    // для подстветки ходов, если здесь не вызвать функцию, то массив не успевает набираться
    unionBishopRookQueen.forEach((block) => {
      if (itemChess.src.includes(block.name)) {
        logicRookBishopQueen(
          itemChess,
          currentPosition,
          null,
          null,
          block.steps // ходы
        );
      }
    });

    unionK.forEach((block) => {
      if (itemChess.src.includes(block.name)) {
        logicKingKnight(
          itemChess,
          currentPosition,
          null,
          null,
          block.steps,
          possibleStep
        );
      }
    });

    if (itemChess.src.includes("pawn")) {
      stepPawn(itemChess, currentPosition, null, null, possibleStep);
    }

    lightStep(possibleStep);
  });
});

// перемещение фигур по доске
blocks.forEach((block) => {
  block.addEventListener("click", async (e) => {
    const blockTarget = e.currentTarget; // клетка
    const figura = window.globalFigure; // вытаскивание глобальной переменной в константу

    if (!figura) return;

    // проверяю находится ли в клетке какая то фигура
    if (!blockTarget.contains(figura)) {
      const currentPosition = Array.from(blocks).indexOf(figura.parentNode); // текущая позиция фигуры
      const isBlack = figura.src.includes("black"); // проверка какой цвет фигуры, чтобы сходить

      // обработка пешек
      if (figura.src.includes("pawn")) {
        stepPawn(figura, currentPosition, isBlack, blockTarget);
      }

      // фунция вызова для ладьи, слона и королевы
      unionBishopRookQueen.forEach((block) => {
        if (figura.src.includes(block.name)) {
          logicRookBishopQueen(
            figura,
            currentPosition,
            blockTarget,
            isBlack,
            block.steps, // ходы
            possibleStep
          );
        }
        removeStep();
      });

      unionK.forEach((block) => {
        if (figura.src.includes(block.name)) {
          logicKingKnight(
            figura,
            currentPosition,
            blockTarget,
            isBlack,
            block.steps,
            possibleStep
          );
        }
        removeStep();
      });

      figura.classList.remove("active-chess"); // после перемещения фигуры удаляю активный класс
      window.globalFigure = null; //очищение фигуры
    }
  });
});

// небольшие махинации с правой границей из-за индекса, который начинается с 1
borderRight.pop();
borderRight.unshift(0);

// функция для добавления в массивы срубленных фигур
function addMassiveCut(pathBoolean, figura) {
  if (pathBoolean) {
    blackChess.appendChild(figura);
  } else {
    whiteChess.appendChild(figura);
  }
}

// логика для пешек
function stepPawn(
  figura,
  currentPosition,
  isBlack,
  blockTarget,
  possibleStep = []
) {
  const direction = isBlack ? -8 : 8; // взависомости от цвета хожу лиюо на +8 либо на -8

  if (blocks[currentPosition + direction]?.querySelector("img")) return; // проверка на занятость клетки

  const eatPawnLeft = isBlack ? -9 : 9; // переменные для съедения фигуры слева
  const eatPawnRight = isBlack ? -7 : 7; // переменные для съедения фигуры справа

  // проверка первого хода пешки, чтобы она могла ходить только один раз +16, если она за пределами этого диапозона, то ходит только +8
  let firstStepPawn =
    (currentPosition >= 8 && currentPosition <= 15) ||
    (currentPosition >= 48 && currentPosition <= 55);

  const newPosition = Array.from(blocks).indexOf(blockTarget); // нахожу новую позицию фигуры для съедения другой пешки

  // проверяю наличие фигур на клетках +-7 и +-9
  const figuraLeft = currentPosition + eatPawnLeft;
  const figuraRight = currentPosition + eatPawnRight;

  if (figuraLeft === newPosition || newPosition === figuraRight) {
    const targetPawn = blocks[newPosition].querySelector("img"); // фигура которую должны съесть

    // если есть фигура для съедения значит ищем родителя(клетку)
    if (targetPawn.src.includes(isBlack ? "white" : "black")) {
      blocks[newPosition].removeChild(targetPawn);
      blocks[newPosition].appendChild(figura);
      stepToggle = !stepToggle; // меняю ход на другой цвет
      possibleStep.push(newPosition);
      updateText();

      // проврека на добавление в массив со съеденными фигурами
      addMassiveCut(targetPawn.src.includes("black"), targetPawn);
    }
  }

  // логика самих ходов
  if (
    (firstStepPawn && newPosition === currentPosition + direction * 2) ||
    newPosition === currentPosition + direction
  ) {
    blocks[newPosition].appendChild(figura); // добавляю фигуру на клетку
    possibleStep.push(newPosition);
    stepToggle = !stepToggle; // меняю ход на другой цвет
    updateText();
  }
}
// общая логика для фигур
function logicRookBishopQueen(
  figura,
  currentPosition,
  blockTarget,
  isBlack,
  directionRook
) {
  const startStr = currentPosition / 8; // начальная строка, чтобы не вызалить за границу
  // пробегаюсь по ходам
  for (const dir of directionRook) {
    for (let i = 1; i <= 8; i++) {
      const targetPosition = currentPosition + dir * i; // вычисление возможных позиций
      // console.log(targetPosition, currentPosition, dir, i);

      if (targetPosition < 0 || targetPosition > blocks.length) break; // проверка выхода за линию
      // проверка на выход за линию
      // if (dir !== -8 && dir !== 8) {
      //   if (Math.floor(startStr) !== Math.floor(targetPosition / 8)) break;
      // }

      // проверяю занята ли клетка другой фигурой
      if (blocks[targetPosition]?.querySelector("img")) {
        possibleStep.push(targetPosition); // добавляю в список возможных ход
        break; // если клетка занята, то прерываю цикл для расчета
      } else {
        possibleStep.push(targetPosition); // добавляю в список возможных ход
      }
      // console.log(possibleStep);
    }
  }

  const position = Array.from(blocks).indexOf(blockTarget); // индекс клетки на которую должена встать фигура
  // проверка есть ли эта позиции в списке возможных ходов
  if (possibleStep.includes(position)) {
    const cutFigura = blocks[position]?.querySelector("img"); // получения изображение на пути у ладьи
    // проверка цвета для сруба
    if (cutFigura && cutFigura.src.includes(isBlack ? "white" : "black")) {
      blocks[position].removeChild(cutFigura);
      addMassiveCut(cutFigura.src.includes("black"), cutFigura); // для добавления в массив срубленных фигур
    }
    blocks[position].appendChild(figura); // добавляю по индексу фигуру
    stepToggle = !stepToggle; // меняю ход
    updateText();
  }
}

// логика для короля и коня
function logicKingKnight(
  figura,
  currentPosition,
  blockTarget,
  isBlack,
  directionK,
  possibleStep
) {
  for (const dir of directionK) {
    for (let i = 1; i <= 8; i++) {
      const targetPositionKing = currentPosition + dir; // другая логика из-за расчета целевой клетки
      if (targetPositionKing < 0 || targetPositionKing > blocks.length) break;
      console.log(
        `CurrentPosition: ${currentPosition}; TargetPos: ${targetPositionKing}; TargetPos / 8: ${Math.ceil(
          targetPositionKing / 8
        )}`
      );
      if (Math.floor(targetPositionKing % 8) === 0) break;

      if (blocks[targetPositionKing]?.querySelector("img")) {
        possibleStep.push(targetPositionKing);
        break;
      } else {
        possibleStep.push(targetPositionKing);
      }
    }
  }

  const positionK = Array.from(blocks).indexOf(blockTarget);

  if (possibleStep.includes(positionK)) {
    const cutFiguraOfKing = blocks[positionK].querySelector("img");
    if (
      cutFiguraOfKing &&
      cutFiguraOfKing.src.includes(isBlack ? "white" : "black")
    ) {
      blocks[positionK].removeChild(cutFiguraOfKing);
      addMassiveCut(cutFiguraOfKing.src.includes("black"), cutFiguraOfKing); // для добавления в массив срубленных фигур
    }
    blocks[positionK].appendChild(figura);
    stepToggle = !stepToggle;
    updateText();
  }
}

function lightStep(position) {
  position.forEach((index) => {
    const img = blocks[index]?.querySelector("img")?.src.includes("black");
    // console.log(img, stepToggle, img !== stepToggle);
    if (img !== stepToggle) {
      blocks[index]?.classList.add("active-block");
    }
  });
}

function removeStep() {
  possibleStep.length = 0;
  const removeClass = document.getElementsByClassName("active-block");
  Array.from(removeClass).forEach((block) => {
    block.classList.remove("active-block");
  });
}

// function stepRook(figura, currentPosition, blockTarget, isBlack) {
//   const directionRook = [-1, 1, -8, 8]; // ходы для вычисления
//   const possibleStep = []; // массив для возможных ходов

//   // пробегаюсь по ходам
//   for (const dir of directionRook) {
//     for (let i = 1; i <= 8; i++) {
//       const targetPosition = currentPosition + dir * i; // вычисление возможных позиций

//       if (targetPosition < 0 || targetPosition > blocks.length) break; // проверка выхода за линию

//       // проверяю занята ли клетка другой фигурой
//       if (blocks[targetPosition].querySelector("img")) {
//         possibleStep.push(targetPosition); // добавляю в список возможных ход
//         break; // если клетка занята, то прерываю цикл для расчета
//       } else {
//         possibleStep.push(targetPosition); // добавляю в список возможных ход
//       }
//     }
//   }

//   const position = Array.from(blocks).indexOf(blockTarget); // индекс клетки на которую должена встать фигура
//   // проверка есть ли эта позиции в списке возможных ходов
//   if (possibleStep.includes(position)) {
//     const cutFigura = blocks[position]?.querySelector("img"); // получения изображение на пути у ладьи
//     // проверка цвета для сруба
//     if (cutFigura && cutFigura.src.includes(isBlack ? "white" : "black")) {
//       blocks[position].removeChild(cutFigura);
//     }
//     blocks[position].appendChild(figura); // добавляю по индексу фигуру
//     stepToggle = !stepToggle; // меняю ход
//   }
// }

// function stepBishop(figura, currentPosition, blockTarget, isBlack) {
//   const directionBishop = [7, -7, 9, -9];
//   const possibleStepBishop = [];

//   for (const dir of directionBishop) {
//     for (let i = 1; i <= 8; i++) {
//       const targetPositionBishop = currentPosition + dir * i;

//       if (targetPositionBishop < 0 || targetPositionBishop > blocks.length)
//         break;

//       if (blocks[targetPositionBishop]?.querySelector("img")) {
//         possibleStepBishop.push(targetPositionBishop);
//         break;
//       } else {
//         possibleStepBishop.push(targetPositionBishop);
//       }
//     }
//   }

//   const positionBishop = Array.from(blocks).indexOf(blockTarget);

//   if (possibleStepBishop.includes(positionBishop)) {
//     const cutFiguraBishop = blocks[positionBishop]?.querySelector("img");
//     if (
//       cutFiguraBishop &&
//       cutFiguraBishop.src.includes(isBlack ? "white" : "black")
//     ) {
//       blocks[positionBishop].removeChild(cutFiguraBishop);
//     }
//     blocks[positionBishop].appendChild(figura);
//     stepToggle = !stepToggle;
//   }
// }

// function stepKnight(figura, currentPosition, blockTarget, isBlack) {
//   const directionKnight = [17, -17, 15, -15, -10, 10, -6, 6];
//   const possibleStepKnight = [];

//   for (const dir of directionKnight) {
//     for (let i = 1; i <= 8; i++) {
//       const targetPositionKnight = currentPosition + dir * i;

//       if (targetPositionKnight < 0 || targetPositionKnight > blocks.length)
//         break;

//       possibleStepKnight.push(targetPositionKnight);
//     }
//   }

//   const positionKnight = Array.from(blocks).indexOf(blockTarget);

//   if (possibleStepKnight.includes(positionKnight)) {
//     const cutFiguraKnight = blocks[positionKnight]?.querySelector("img");

//     if (
//       cutFiguraKnight &&
//       cutFiguraKnight.src.includes(isBlack ? "white" : "black")
//     ) {
//       blocks[positionKnight].removeChild(cutFiguraKnight);
//     }
//     blocks[positionKnight].appendChild(figura);
//     stepToggle = !stepToggle;
//   }
// }


// придумала как границы исправить -> переписать доску на декартову систему
// после так же по блокам работать, но границы можно расставить будет таким образом,
// только с подстветкой пешек не знаю что делать