const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue = "";
let secondCardValue = "";
// Items array
items = [
  { name: "ant", image: "./images/ant.png" },
  { name: "bee", image: "./images/bee.png" },
  { name: "butterfly", image: "./images/butterfly.png" },
  { name: "cow", image: "./images/cow.png" },
  { name: "elephant", image: "./images/elephant.png" },
  { name: "fox", image: "./images/fox.png" },
  { name: "gorilla", image: "./images/gorilla.png" },
  { name: "koala", image: "./images/koala.png" },
  { name: "lion", image: "./images/lion.png" },
  { name: "spider", image: "./images/spider.png" },
  { name: "turtle", image: "./images/turtle.png" },
  { name: "whale", image: "./images/whale.png" },
];
// Initial Time
let seconds = 0;
let minutes = 0;
// Inittial moves and win count
let movesCount = 0;
let winCount = 0;
let allowClickCard = true;

// For timer
const timeGenerator = () => {
  seconds++;
  // minutes logic
  if (seconds > 60) {
    minutes++;
    seconds = 0;
  }
  // Format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};
// For calculating moves
const movesCounter = () => {
  movesCount++;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
// Pick random object from items array
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  // initializes cardValue array
  let cardValues = [];
  // size should be double
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // sau khi random ra index thi se xoa phan tu o vi tri index do
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // troonj mang
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
    Tao card
    before => chua dau ?
    after => doa nguoc lai va chua data-card-values de check xem co match hay ko
     */
    gameContainer.innerHTML += `
    <div class = "card-container" data-card-value = "${cardValues[i].name}">
        <div class = "card-before">?</div>
        <div class = "card-after">
            <img src = "${cardValues[i].image}" class = "image"/>
        </div>
    </div>`;
  }
  // Grids
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
  // Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // khong cho nguoi choi double click vao card
      if (card === firstCard) return;
      // logic de chi click dc card trong luc 2 card truoc do dang an
      if (allowClickCard === true) {
        movesCounter();
        // neu firstCard === null thi set card hien tai la first
        if (firstCard === false) {
          firstCard = card;
          firstCardValue = firstCard.getAttribute("data-card-value");
          card.classList.add("flipped");
        } else {
          // set gia tri cua second card va hien thi no
          secondCard = card;
          secondCardValue = secondCard.getAttribute("data-card-value");
          card.classList.add("flipped");
          //
          allowClickCard = false;
          // neu 2 card ko trung nhau thi disable no di
          if (firstCardValue !== secondCardValue) {
            // sau khi card da an xong thi moi tiep tuc cho click
            setTimeout(() => {
              allowClickCard = true;
            }, 1300);
            setTimeout(() => {
              firstCard.classList.remove("flipped");
              secondCard.classList.remove("flipped");
              firstCard = false;
              secondCard = false;
            }, 900);
          } else {
            winCount++;
            // dieu kien de nguoi choi chien thang
            if (winCount === (size * size) / 2) {
              result.innerHTML = `<h2> You Won</h2>
              <h4>Move Count: ${movesCount}`;
              stopGame();
            }
            firstCard = false;
            secondCard = false;
            allowClickCard = true;
          }
        }
        console.log(firstCardValue, secondCardValue);
      } else {
        card.disabled = true;
      }
    });
  });
};

//strat game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // controls and button visibl
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // Start timer
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initalizer();
});
// Stop game
const stopGame = () => {
  // controls and button visibl
  seconds = 0;
  minutes = 0;
  timeGenerator();
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
};
stopButton.addEventListener("click", stopGame);
// tao gia tri va goi function
const initalizer = () => {
  result.innerHTML = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
