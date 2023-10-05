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

let todaysWords = wordsForTheDay.words;
let theme = wordsForTheDay.theme;
let jumbledLetters = mixLetters(todaysWords);

let letterGrid = document.getElementById("letterGrid");
let workingWordDiv = document.getElementById("workingWord");
let wordsList = document.getElementById("wordsList");
let themeDiv = document.getElementById("theme");
let guessesList = document.getElementById("guesses");

let selectedButtons = [];
let guessedWords = 0;

let scoreString = `Jumblie #${puzzleNumber}\n`;

themeDiv.textContent = theme;

jumbledLetters.forEach((letter, index) => {
	let letterButton = document.createElement("button");
	letterButton.textContent = letter;
	letterButton.classList.add("letter-button");
	letterButton.classList.add(`letter-${index}`);
	letterButton.addEventListener("click", (event) => {
		const button = event.target;
		const index = Array.from(letterGrid.children).indexOf(button);

		if (selectedButtons.includes(index)) {
			selectedButtons = selectedButtons.filter(
				(btnIndex) => btnIndex !== index
			);
		} else {
			selectedButtons.push(index);
		}

		button.classList.toggle("selected");

		updateWorkingWord();
	});

	letterGrid.appendChild(letterButton);
});

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

document.addEventListener("keydown", handleKeydown);

const letterMap = {};
jumbledLetters.forEach((letter, index) => {
	letterMap[letter] = index;
});

function handleKeydown(event) {
	if (event.key === "Enter") {
		submitWord();
	}

	if (event.key === "Backspace") {
		if (selectedButtons.length > 0) {
			const index = selectedButtons.pop();
			const letterButtons = document.querySelectorAll(".letter-button");

			if (letterButtons[index]) {
				letterButtons[index].classList.remove("selected");
			}

			updateWorkingWord();
		}
	}

	const key = event.key;
	const letterButtons = document.querySelectorAll(".letter-button");

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

document.getElementById("submit").addEventListener("click", submitWord);

function submitWord() {
	const workingWord = workingWordDiv.textContent;
	const letterButtons = document.querySelectorAll(".letter-button");
	guessedWords++;

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

		if (wordsList.children.length === 4) {
			win();
		}
	} else {
		if (workingWord.length > 0) {
			const guessesElement = document.createElement("li");
			guessesElement.textContent = workingWord;
			guessesList.appendChild(guessesElement);
		}

		selectedButtons.forEach((index) => {
			const button = letterButtons[index];
			button.classList.remove("selected");
		});

		selectedButtons = [];
	}

	workingWordDiv.textContent = "";
}

document.getElementById("help").addEventListener("click", () => {
	document.querySelector("dialog").showModal();
});

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

let shareButton = document.getElementById("share");

function win() {
	document.getElementById("message").textContent =
		"Yay! You found all the words!";
	document.getElementById("submit").remove();
	document.getElementsByClassName("working-word")[0].remove();

	// make share button visible
	shareButton.classList.remove("hidden");
}

function copyScore() {
	navigator.clipboard.writeText(scoreString).then(() => {
		console.log("Copied score to clipboard");
	});
}

function shareLink() {
	if (navigator.share) {
		navigator
			.share({
				title: "Jumblies",
				text: scoreString,
				url: "https://jumblies.com",
			})
			.then(() => console.log("Successful share"))
			.catch((error) => console.log("Error sharing", error));
	} else {
		console.log("Share not supported");
	}
}
