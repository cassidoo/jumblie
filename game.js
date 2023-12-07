let todaysWords = wordsForTheDay.words;
let theme = wordsForTheDay.theme;
let jumbledLetters = mixLetters(todaysWords);

let letterGrid = document.getElementById("letterGrid");
let workingWordDiv = document.getElementById("workingWord");
let wordsList = document.getElementById("wordsList");
let guessesList = document.getElementById("guesses");

let themeDiv = document.getElementById("theme");
let mobileThemeDiv = document.getElementById("mobile");
let splashThemeDiv = document.getElementById("splashTheme");
let shareButton = document.getElementById("share");
let submitButton = document.getElementById("submit");
let jShareButton = document.getElementById("jshare");

let selectedButtons = [];
let guessedWords = 0;
let wrongGuesses = 0;

let scoreString = `Jumblie #${puzzleNumber}\n`;

const letterMap = {};

(function () {
	playedToday();
	handleAutosave();

	document.ondblclick = function (e) {
		e.preventDefault();
	};

	if (!navigator.share) {
		jShareButton.remove();
	}

	startNewGame();
})();

function startNewGame() {
	document.addEventListener("keydown", handleKeydown);
	submitButton.addEventListener("click", submitWord);

	themeDiv.textContent = `"${theme}"`;
	mobileThemeDiv.textContent = `"${theme}"`;
	splashThemeDiv.textContent = `"${theme}"`;

	document.getElementById("help").addEventListener("click", () => {
		document.querySelector("#helpDialog").showModal();
		fathom.trackEvent("Opened Help");
	});

	jumbledLetters.forEach((letter, index) => {
		let letterButton = document.createElement("button");
		letterButton.textContent = letter;
		letterButton.classList.add("letter-button");
		letterButton.classList.add(`letter-${index}`);
		letterButton.addEventListener("click", handleButtonClick);

		letterGrid.appendChild(letterButton);

		letterMap[letter] = index;
	});
}

function handleAutosave() {
	let autosavedGame = loadAutosave();
	if (
		autosavedGame &&
		autosavedGame?.savedDate === document.getElementById("today").textContent
	) {
		jumbledLetters = autosavedGame.currentLetters;
		wordsList.innerHTML = autosavedGame.currentGuessedWords.correct;
		guessesList.innerHTML = autosavedGame.currentGuessedWords.incorrect;
		seconds = autosavedGame.currentElapsedTime.seconds;
		minutes = autosavedGame.currentElapsedTime.minutes;
		hours = autosavedGame.currentElapsedTime.hours;
		updateTimer();

		guessedWords = wordsList.children.length + guessesList.children.length;
		wrongGuesses = guessesList.children.length;
		todaysWords = wordsForTheDay.words.filter(
			(word) => !wordsList.innerHTML.includes(word)
		);

		if (wrongGuesses >= 5) {
			document.getElementById("giveUp").classList.remove("hidden");
		}

		document.getElementById("wrong").textContent = wrongGuesses;

		extractNsFromList().forEach((n) => {
			scoreString += `${getEmoji(n)}`;
		});
	}
}

function mixLetters(words) {
	let letters = words.join("").split("");
	for (let i = letters.length - 1; i >= 0; i--) {
		let randomIndex = Math.floor(Math.random() * (i + 1));
		let temp = letters[i];
		letters[i] = letters[randomIndex];
		letters[randomIndex] = temp;
	}
	return letters;
}

function handleButtonClick(event) {
	const button = event.target;
	const index = Array.from(letterGrid.children).indexOf(button);

	if (selectedButtons.includes(index)) {
		selectedButtons = selectedButtons.filter((btnIndex) => btnIndex !== index);
	} else {
		selectedButtons.push(index);
	}

	button.classList.toggle("selected");

	updateWorkingWord();
}

function updateWorkingWord() {
	const initialSpan = document.querySelector("span#initial");
	if (initialSpan) {
		initialSpan.textContent = "";
	}

	let currentLetterButtons = document.querySelectorAll(".letter-button");
	let workingWord = "";

	selectedButtons.forEach((index) => {
		const button = currentLetterButtons[index];
		workingWord += button.textContent;
	});

	workingWordDiv.textContent = workingWord;
}

function deselectAll() {
	const letterButtons = document.querySelectorAll(".letter-button");

	letterButtons.forEach((button) => {
		button.classList.remove("selected");
	});

	selectedButtons = [];

	updateWorkingWord();
}

function handleKeydown(event) {
	const key = event.key;
	let letterButtons = document.querySelectorAll(".letter-button");

	if (key === "Enter") {
		submitWord();
	}

	if (key === "Escape") {
		deselectAll();
	}

	if (key === " ") {
		event.preventDefault(); // to prevent scrolling
		shuffleLetters();
	}

	if (key === "Backspace") {
		if (selectedButtons.length > 0) {
			const index = selectedButtons.pop();

			if (letterButtons[index]) {
				letterButtons[index].classList.remove("selected");
			}

			updateWorkingWord();
		}
	}

	if (key.length === 1 && key >= "a" && key <= "z") {
		const indexes = [];
		letterButtons.forEach((button, index) => {
			if (button.textContent === key) {
				indexes.push(index);
			}
		});

		const availableIndex = indexes.find((index) => {
			const button = letterButtons[index];
			return !button.classList.contains("selected");
		});

		if (availableIndex !== undefined) {
			const button = letterButtons[availableIndex];
			button.classList.add("selected");
			selectedButtons.push(availableIndex);
			updateWorkingWord();
		}
	}
}

function submitWord() {
	document.activeElement.blur();
	const workingWord = workingWordDiv.textContent;
	const letterButtons = document.querySelectorAll(".letter-button");

	if (workingWord.length !== 0) {
		guessedWords++;
	}

	if (todaysWords.includes(workingWord)) {
		const wordElement = document.createElement("li");
		const wordOrder = wordsForTheDay.words.indexOf(workingWord);

		wordElement.classList.add(`word-${wordOrder}`);
		wordElement.textContent = workingWord;
		wordsList.appendChild(wordElement);

		scoreString += `${getEmoji(wordOrder)}`;

		selectedButtons.forEach((index) => {
			const button = letterButtons[index];
			button.remove();
		});

		selectedButtons = [];
		todaysWords = todaysWords.filter((word) => word !== workingWord);

		workingWordDiv.textContent = "";

		if (wordsList.children.length === 4) {
			win();
		}
	} else {
		if (workingWord.length > 0) {
			document.getElementsByClassName("working-word")[0].classList.add("shake");
			setTimeout(() => {
				document
					.getElementsByClassName("working-word")[0]
					.classList.remove("shake");
				workingWordDiv.textContent = "";
			}, 400);

			if (
				!Array.from(guessesList.children).some(
					(word) => word.textContent === workingWord
				)
			) {
				wrongGuesses++;
				document.getElementById("wrong").textContent = wrongGuesses;
				const guessesElement = document.createElement("li");
				guessesElement.textContent = workingWord;
				guessesList.appendChild(guessesElement);
			}
		}

		selectedButtons.forEach((index) => {
			const button = letterButtons[index];
			button.classList.remove("selected");
		});

		selectedButtons = [];
	}

	if (wrongGuesses >= 5) {
		document.getElementById("giveUp").classList.remove("hidden");
	}

	autosave(getGameState());
	fathom.trackEvent("Guessed a word");
}

function getEmoji(index) {
	switch (index) {
		case 0:
			return "🔴";
		case 1:
			return "🟠";
		case 2:
			return "🟢";
		case 3:
			return "🔵";
	}
}

function extractNsFromList() {
	const ns = [];
	const liElements = wordsList.getElementsByTagName("li");

	for (let i = 0; i < liElements.length; i++) {
		const liClass = liElements[i].getAttribute("class");
		const nMatch = liClass.match(/word-(\d+)/);

		if (nMatch) {
			ns.push(parseInt(nMatch[1]));
		}
	}

	return ns;
}

function win() {
	let finalTime = endGame();
	scoreString += `\n${guessedWords} guesses in ${convertTimeHMS(
		finalTime
	)}\nhttps://jumblie.com`;

	updateStreakAndFastestTimes(
		convertTimeToMilliseconds(finalTime),
		scoreString
	);

	jShareButton.remove();
	document.getElementById("pause").remove();
	document.getElementById("message").textContent =
		"Yay! You found all the words!";
	document.getElementById("submit").remove();
	document.getElementsByClassName("working-word")[0].remove();
	document.getElementsByClassName("submission")[0].remove();
	shareButton.classList.remove("hidden");
	if (jShareButton) {
		jShareButton?.classList.remove("hidden");
	}

	fathom.trackEvent("Winning", {
		_value: guessedWords,
	});
}

function confirmGiveUp() {
	let giveUpButton = document.getElementById("giveUp");
	giveUpButton.textContent = "Are you sure?";
	giveUpButton.onclick = giveUp;
}

function giveUp() {
	let finalTime = endGame();
	scoreString += `\nI gave up after ${guessedWords} guesses in ${convertTimeHMS(
		finalTime
	)}\nhttps://jumblie.com`;

	updateStreakAndFastestTimes(null, scoreString);

	jShareButton.remove();
	document.getElementById("giveUp").remove();
	document.getElementById("pause").remove();
	document.getElementById("message").textContent =
		"Better luck next time! You can try again tomorrow.";
	document.getElementById("submit").remove();
	document.getElementsByClassName("working-word")[0].remove();
	document.getElementsByClassName("submission")[0].remove();
	document.getElementById("letterGrid").remove();
	shareButton.classList.remove("hidden");
	todaysWords.forEach((word) => {
		const wordElement = document.createElement("li");
		wordElement.textContent = word;
		const index = wordsForTheDay.words.indexOf(word);
		wordElement.classList.add(`word-${index}`);
		wordsList.appendChild(wordElement);
	});
	if (jShareButton) {
		jShareButton?.classList.remove("hidden");
	}

	fathom.trackEvent("Giving up", {
		_value: guessedWords,
	});
}

function playedToday() {
	let message = "";
	if (parseInt(localStorage.getItem("currentStreak")) !== 0) {
		message = "You found all the words today! ";
	}

	if (hasPlayedToday()) {
		clearAutosave();
		jShareButton.remove();
		splash.style.display = "none";
		container.style.display = "block";
		scoreString = localStorage.getItem("latestScoreString");
		shareButton.classList.remove("hidden");
		document.getElementById("pause").remove();
		document.getElementById(
			"message"
		).textContent = `${message}Can't wait to play again tomorrow!`;
		document.getElementById("submit").remove();
		document.getElementsByClassName("working-word")[0].remove();
		document.getElementsByClassName("submission")[0].remove();
		document.getElementById("letterGrid").remove();
		document.getElementsByTagName("details")[0].remove();
		wordsForTheDay.words.map((word, index) => {
			const wordElement = document.createElement("li");
			wordElement.textContent = word;
			wordElement.classList.add(`word-${index}`);
			wordsList.appendChild(wordElement);
		});
		if (jShareButton) {
			jShareButton?.classList.remove("hidden");
		}
	}
}

function copyScore() {
	navigator.clipboard.writeText(scoreString).then(() => {
		shareButton.textContent = "Copied!";
	});
}

function shareLink() {
	if (navigator.share) {
		navigator
			.share({
				title: "Jumblie",
				text: scoreString,
				url: "https://jumblie.com",
			})
			.then(() => console.log("Successful share"))
			.catch((error) => console.log("Error sharing", error));
	} else {
		console.log("Share not supported");
	}
}

function shuffleLetters() {
	const currentButtons = document.querySelectorAll(".letter-button");
	const currentLetters = [];

	currentButtons.forEach((button) => {
		currentLetters.push(button.textContent);
		button.remove();
	});

	currentLetters.sort(() => Math.random() - 0.5);

	currentLetters.forEach((letter, index) => {
		const button = document.createElement("button");
		button.textContent = letter;
		button.classList.add("letter-button");
		button.classList.add(`letter-${index}`);

		button.addEventListener("click", handleButtonClick);
		letterGrid.appendChild(button);
	});

	selectedButtons = [];
	updateWorkingWord();
}

document.getElementById("stats").addEventListener("click", () => {
	const currentStreak = localStorage.getItem("currentStreak") || 0;
	const longestStreak = localStorage.getItem("longestStreak") || 0;
	const totalDaysPlayed = localStorage.getItem("totalDaysPlayed") || 0;
	const fastestTimes = JSON.parse(localStorage.getItem("fastestTimes")) || [];

	const currentStreakElement = document.getElementById("currentStreak");
	const longestStreakElement = document.getElementById("longestStreak");
	const totalDaysPlayedElement = document.getElementById("totalDaysPlayed");
	const fastestTimesElement = document.getElementById("fastestTimes");

	currentStreakElement.textContent = `${currentStreak} days`;
	longestStreakElement.textContent = `${longestStreak} days`;
	totalDaysPlayedElement.textContent = `${totalDaysPlayed} games`;

	fastestTimesElement.innerHTML = "";
	fastestTimes.forEach((entry) => {
		const tr = document.createElement("tr");
		const tdDate = document.createElement("td");
		const tdTime = document.createElement("td");

		tdDate.textContent = `${entry.date}`;
		tdTime.textContent = convertMillisecondsToTime(entry.time);

		tr.appendChild(tdDate);
		tr.appendChild(tdTime);

		fastestTimesElement.appendChild(tr);
	});

	document.querySelector("#statsDialog").showModal();
	fathom.trackEvent("Checked Stats");
});

function getGameState() {
	let today = getCurrentDate();
	let now = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

	if (now === document.getElementById("today")) {
		return null;
	}

	let currentLetters = [];
	let currentButtons = document.querySelectorAll(".letter-button");
	currentButtons.forEach((button) => {
		currentLetters.push(button.textContent);
	});

	return {
		savedDate: now,
		currentLetters,
		currentGuessedWords: {
			correct: wordsList.innerHTML,
			incorrect: guessesList.innerHTML,
		},
		currentElapsedTime: {
			hours,
			minutes,
			seconds,
		},
	};
}
