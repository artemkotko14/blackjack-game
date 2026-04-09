import { stackOfCards } from "./stackOfCards.js";
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let dealerSumEl = document.getElementById("dealer-sum-el");
let cardsEl = document.getElementById("cards-el");
let balanceEl = document.getElementById("balance-el");
let cardsImagesEl = document.getElementById("player-cards-images-el");
let dealerCardsImagesEl = document.getElementById("dealer-cards-images-el");
let dealBtn = document.getElementById("deal-btn");
let hitBtn = document.getElementById("hit-btn");
let standBtn = document.getElementById("stand-btn");
let startBtn = document.getElementById("start-btn");
let nameInput = document.getElementById("name-input");
let startScreen = document.getElementById("start-screen");
let gameScreen = document.getElementById("game-screen");
let playerOptions = document.querySelector(".player-options");
let restartBtn = document.getElementById("restart-btn");
let gameScreenHeader = document.getElementById("game-screen-header");
let backOfCardImg = `<img src="images/back_dark.png" alt="Back of Card" class="card">`;

let player = {
  name: "",
  chips: 200,
};
let deck = [];
let cards = [];
let playerSum = 0;
let dealerCards = [];
let dealerSum = 0;

let message = "";

startBtn.addEventListener("click", function () {
  preloadImages();
  let playerName = nameInput.value.trim();
  if (playerName !== "") {
    player.name = playerName;
  } else {
    alert("Please enter your name to start the game.");
    return;
  }

  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  updateBalance();
  dealCards();
});
function updateBalance() {
  balanceEl.textContent = player.name + ": $" + player.chips;
}
function checkPlayerBalance() {
  if (player.chips <= 0) {
    gameScreenHeader.textContent = "Game Over";
    messageEl.textContent = "You've run out of chips! Please restart the game.";
    playerOptions.style.display = "none";
    dealBtn.style.display = "none";
    restartBtn.style.display = "block";
    gameScreen.classList.add("container-red");
  }
}
function initDeck() {
  deck = [...stackOfCards];
}

function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * deck.length);
  let card = deck.splice(randomNumber, 1)[0];

  return {
    value: card.value,
    image: card.image,
  };
}
function getTwoRandomCards() {
  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  let firstCardImg = `<img src="${firstCard.image}" alt="${firstCard.value}" class="card">`;
  let secondCardImg = `<img src="${secondCard.image}" alt="${secondCard.value}" class="card">`;
  return [firstCard, secondCard, firstCardImg, secondCardImg];
}
function dealCards() {
  initDeck();
  let [firstCard, secondCard, firstCardImg, secondCardImg] =
    getTwoRandomCards();
  cards = [firstCard, secondCard];
  cardsImagesEl.innerHTML = firstCardImg + secondCardImg;
  playerSum = calculateSum(cards);
  renderGame();

  dealerPlay();
}
function playerLost() {
  player.chips -= 50;
  updateBalance();
  endRound();

  standBtn.classList.remove("button-centered");
}

function renderGame() {
  cardsEl.textContent = "Your Cards: ";
  sumEl.textContent = "Your Sum: " + playerSum;
  hitBtn.style.display = "";
  if (playerSum <= 20) {
    message = "Do you want to draw a new card?";
    playerOptions.style.display = "block";
    dealBtn.style.display = "none";

    standBtn.classList.remove("button-centered");
  } else if (playerSum === 21 && cards.length === 2) {
    message = "You've got Blackjack!";
    player.chips += 100;
    updateBalance();
    endRound();
    standBtn.classList.remove("button-centered");
  } else if (playerSum === 21) {
    message = "You've got 21! You must stand.";
    hitBtn.style.display = "none";
    standBtn.classList.add("button-centered");
  } else {
    message = "You've lost!";
    playerLost();
  }
  messageEl.textContent = message;
  checkPlayerBalance();
}

function compareSums() {
  if (dealerSum > 21) {
    messageEl.textContent = "Dealer busts! You win!";
    player.chips += 50;
  } else if (dealerSum > playerSum) {
    messageEl.textContent = "Dealer wins!";
    player.chips -= 50;
  } else if (dealerSum < playerSum) {
    messageEl.textContent = "You win!";
    player.chips += 50;
  } else {
    messageEl.textContent = "It's a tie!";
  }
  updateBalance();
  checkPlayerBalance();
}

function newCard() {
  let card = getRandomCard();
  cardsImagesEl.innerHTML += `<img src="${card.image}" alt="${card.value}" class="card">`;
  cards.push(card);
  playerSum = calculateSum(cards);

  renderGame();
}
function calculateSum(cards) {
  let sum = 0;
  let aceCount = 0;

  for (let i = 0; i < cards.length; i++) {
    sum += cards[i].value;

    if (cards[i].value === 11) {
      aceCount++;
    }
  }

  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }

  return sum;
}
function resetGame() {
  player.name = "";
  player.chips = 200;
  cards = [];
  dealerCards = [];
  deck = [];
  playerSum = 0;
  dealerSum = 0;
  message = "";

  gameScreenHeader.textContent = "Blackjack";
  messageEl.textContent = "Want to play a round?";
  sumEl.textContent = "Your Sum: ";
  nameInput.value = "";
  cardsImagesEl.innerHTML = "";
  cardsEl.textContent = "Your Cards: ";
  dealerCardsImagesEl.innerHTML = "";
  dealerSumEl.textContent = "Dealer's Sum:";
  endRound();
  restartBtn.style.display = "none";
  gameScreen.classList.remove("container-red");

  updateBalance();
}
restartBtn.addEventListener("click", function () {
  resetGame();
  startScreen.style.display = "flex";
  gameScreen.style.display = "none";
});
function dealerPlay() {
  let [firstCard, secondCard, firstCardImg, secondCardImg] =
    getTwoRandomCards();
  dealerCardsImagesEl.innerHTML = backOfCardImg + secondCardImg;
  dealerCards = [firstCard, secondCard];
  dealerSum = calculateSum([secondCard]);
  dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
}
function endRound() {
  playerOptions.style.display = "none";
  dealBtn.style.display = "block";
}
standBtn.addEventListener("click", function () {
  endRound();
  let firstCard = dealerCards[0];
  let secondCard = dealerCards[1];
  dealerCardsImagesEl.innerHTML = `
    <img src="${firstCard.image}" class="card">
    <img src="${secondCard.image}" class="card">
  `;
  dealerSum = calculateSum(dealerCards);
  dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
  if (dealerSum === 21 && dealerCards.length === 2) {
    player.chips -= 50;
    updateBalance();
    endRound();
    hitBtn.style.display = "";
    standBtn.classList.remove("button-centered");
    messageEl.textContent = "Dealer has Blackjack! Dealer wins!";
  } else if (dealerSum < 17) {
    while (dealerSum < 17) {
      let card = getRandomCard();
      dealerCardsImagesEl.innerHTML += `<img src="${card.image}" alt="${card.value}" class="card">`;
      dealerCards.push(card);
      dealerSum = calculateSum(dealerCards);
      dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
    }
    compareSums();
  } else if (dealerSum >= 17 && dealerSum <= 21) {
    compareSums();
  } else {
    messageEl.textContent = "Dealer busts! You win!";
    player.chips += 50;
    updateBalance();
  }
});

function preloadImages() {
  stackOfCards.forEach((card) => {
    const img = new Image();
    img.src = card.image;
  });
}

dealBtn.addEventListener("click", dealCards);
hitBtn.addEventListener("click", newCard);
