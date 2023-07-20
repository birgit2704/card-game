let deckId = "";
const drawBtn = document.getElementById("draw");
const winMessEl = document.getElementById("winning-message");
const remainCardsEl = document.getElementById("remaining-cards");
let computerScoreEl = document.getElementById("computer-score");
let yourScoreEl = document.getElementById("your-score");
let computerScore = 0;
let yourScore = 0;

document.getElementById("new-deck").addEventListener("click", handleGetNewDeck);

drawBtn.addEventListener("click", handleDraw);

function handleGetNewDeck() {
  computerScore = 0;
  yourScore = 0;
  showScores();

  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      drawBtn.disabled = false;
      remainCardsEl.textContent = `Remaining cards: ${data.remaining}`;
    });
}

function handleDraw() {
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("cards-container").innerHTML = `
      <img src="${data.cards[0].image}"/>
      <img src="${data.cards[1].image}"/>
      `;
      winMessEl.textContent = findWinner(data.cards[0], data.cards[1]);
      remainCardsEl.textContent = `Remaining cards: ${data.remaining}`;
      showScores();
      if (data.remaining === 0) {
        computerScore > yourScore
          ? (winMessEl.textContent = "The final winner is the computer")
          : computerScore < yourScore
          ? (winMessEl.textContent = "YOU are the final winner")
          : (winMessEl.textContent = "It's a tie game");

        drawBtn.disabled = true;
      }
    });
}

function findWinner(card1, card2) {
  const valueOptions = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "JACK",
    "QUEEN",
    "KING",
    "ACE",
  ];
  const card1ValueIndex = valueOptions.indexOf(card1.value);
  const card2ValueIndex = valueOptions.indexOf(card2.value);

  if (card1ValueIndex > card2ValueIndex) {
    computerScore += 1;
    return "Computer wins";
  } else if (card1ValueIndex < card2ValueIndex) {
    yourScore += 1;
    return "You win";
  } else {
    return "It's a tie";
  }
}

function showScores() {
  computerScoreEl.textContent = `Computer's score: ${computerScore}`;
  yourScoreEl.textContent = `Your score: ${yourScore}`;
}
