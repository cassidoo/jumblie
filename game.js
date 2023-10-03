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

let theme = wordsForTheDay.theme;
let jumbledLetters = mixLetters(wordsForTheDay.words);
let letterGrid = document.getElementById("letterGrid");
let workingWordDiv = document.getElementById("workingWord");
let wordsList = document.getElementById("wordsList");
let themeDiv = document.getElementById("theme");
let selectedButtons = [];

themeDiv.textContent = theme;

jumbledLetters.forEach((letter, index) => {
	let letterButton = document.createElement("button");
	letterButton.textContent = letter;
	letterButton.classList.add("letter-button");
	letterButton.classList.add(`letter-${index}`);
	letterButton.addEventListener("click", (event) => {
		const button = event.target;
		const index = button.classList[1].split("-")[1];

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
	let workingWord = "";

	selectedButtons.forEach((index) => {
		const letterButton = document.querySelector(`.letter-${index}`);
		workingWord += letterButton.textContent;
	});

	workingWordDiv.textContent = workingWord;
}

document.getElementById("submit").addEventListener("click", () => {
	const workingWord = workingWordDiv.textContent;

	if (wordsForTheDay.words.includes(workingWord)) {
		const wordElement = document.createElement("li");
		wordElement.textContent = workingWord;
		wordsList.appendChild(wordElement);

		selectedButtons.forEach((index) => {
			const letterButton = document.querySelector(`.letter-${index}`);
			letterButton.remove();
		});

		selectedButtons = [];

		if (wordsList.children.length === 4) {
			document.getElementById("message").textContent =
				"Yay! You found all the words!";
		}
	} else {
		selectedButtons.forEach((index) => {
			const letterButton = document.querySelector(`.letter-${index}`);
			letterButton.classList.remove("selected");
		});

		selectedButtons = [];
	}

	workingWordDiv.textContent = "";
});

document.getElementById("help").addEventListener("click", () => {
	document.querySelector("dialog").showModal();
});
