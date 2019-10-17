class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
  }

  difference() {
    return Math.abs(this.winningNumber - this.playersGuess);
  }

  isLower() {
    if (this.playersGuess < this.winningNumber) {
      return true;
    } else {
      return false;
    }
  }

  playersGuessSubmission(guess) {
    const guessNum = parseInt(guess);
    if (guessNum > 0 && guessNum < 101) {
      this.playersGuess = guessNum;
      return this.checkGuess();
    } else {
      try {
        throw "That is an invalid guess.";
      } catch (err) {
        return err;
      }
    }
  }

  checkGuess() {
    if (this.playersGuess === this.winningNumber) {
      return "You Win!";
    } else if (this.pastGuesses.includes(this.playersGuess)) {
      return "You have already guessed that number.";
    } else if (this.pastGuesses.length === 4) {
      this.pastGuesses.push(this.playersGuess);
      return `You Lose. The number was ${this.winningNumber}.`;
    } else {
      this.pastGuesses.push(this.playersGuess);
      if (this.difference() < 10) {
        return "You're burning up!";
      } else if (this.difference() < 25) {
        return "You're lukewarm.";
      } else if (this.difference() < 50) {
        return "You're a bit chilly.";
      } else {
        return "You're ice cold!";
      }
    }
  }

  provideHint() {
    return shuffle([
      this.winningNumber,
      generateWinningNumber(),
      generateWinningNumber()
    ]);
  }
}

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
  //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
  for (let i = arr.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let tempIndex = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = tempIndex;
  }
  return arr;
}

function newGame() {
  return new Game();
}

function play() {
  let game = newGame();

  const guessButton = document.getElementById("guess");
  const hintButton = document.getElementById("hint");
  const resetButton = document.getElementById("reset");
  let headerText = document.querySelector("h2");

  guessButton.addEventListener("click", guess);
  document
    .getElementById("guess-input")
    .addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        guess();
      }
    });

  hintButton.addEventListener("click", function() {
    let hints = game.provideHint();
    fade("game-message", true);
    setTimeout(function() {
      headerText.textContent = `Possible winning numbers: ${hints[0]}, ${
        hints[1]
      }, ${hints[2]}`;
    }, 300);
    fade("game-message", false);
  });

  resetButton.addEventListener("click", function() {
    guessButton.disabled = false;
    hintButton.disabled = false;
    document.getElementById("guess-input").disabled = false;

    fade("game-message", true);
    fade("guess-input", true);
    fade("attempt-row", true);

    setTimeout(function() {
      document.getElementById("guess-input").value = "";
      headerText.textContent = "Guess a number from 1 to 100";
      for (let i = 1; i <= 5; i++) {
        document.getElementById(`guess-${i}`).textContent = "•";
        document.getElementById(`arrow-${i}`).setAttribute("class", "fa");
      }
    }, 300);

    fade("game-message", false);
    fade("guess-input", false);
    fade("attempt-row", false);

    game = newGame();
  });

  function guess() {
    let pastGuesses = game.pastGuesses.length;
    let playerGuess = document.getElementById("guess-input").value;

    fade("game-message", true);

    let gameMessage = game.playersGuessSubmission(playerGuess);

    setTimeout(function() {
      headerText.textContent = gameMessage;
    }, 300);

    fade("game-message", false);

    if (game.pastGuesses.length > 0) {
      let guessNum = game.pastGuesses.length;

      let direction = num => {
        if (game.pastGuesses[guessNum - 1] < game.winningNumber) {
          document.getElementById(`arrow-${num}`).classList.add("fa-caret-up");
        } else {
          document
            .getElementById(`arrow-${num}`)
            .classList.add("fa-caret-down");
        }
      };

      if (pastGuesses !== guessNum) {
        fade(`guess-${guessNum}`, true);

        setTimeout(function() {
          document.getElementById(`guess-${guessNum}`).textContent = `${
            game.pastGuesses[guessNum - 1]
          }`;
          direction(guessNum);
        }, 300);

        fade(`guess-${guessNum}`, false);
      }
    }

    if (gameMessage.includes("Lose") || gameMessage.includes("Win")) {
      guessButton.disabled = true;
      hintButton.disabled = true;
      document.getElementById("guess-input").disabled = true;
    } else {
      document.getElementById("guess-input").value = "";
    }
  }

  function fade(id, boolean) {
    if (boolean) {
      document.getElementById(id).classList.add("fade");
    } else {
      setTimeout(function() {
        document.getElementById(id).classList.remove("fade");
      }, 300);
    }
  }
}

play();
