const splash = document.getElementById("splash");
const startButton = document.getElementById("start");
const container = document.getElementById("container");
const timer = document.getElementById("timer");
const pauseButton = document.getElementById("pause");

let timerInterval;
let isPaused = false;
let seconds = 0;
let minutes = 0;
let hours = 0;
let display = "00:00";
let started = false;

function startGame() {
	started = true;
	splash.style.display = "none";
	container.style.display = "block";

	document.getElementById("splashTitle").textContent = "Paused";
	document.getElementById("splashTheme").style.display = "none";

	document
		.querySelectorAll(".hidden-start")
		.forEach((el) => el.classList.remove("hidden-start"));

	timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
	if (!isPaused) {
		seconds++;

		if (seconds === 60) {
			seconds = 0;
			minutes++;

			if (minutes === 60) {
				minutes = 0;
				hours++;
			}
		}

		display =
			(hours > 0 ? hours + ":" : "") +
			("0" + minutes).slice(-2) +
			":" +
			("0" + seconds).slice(-2);

		timer.textContent = display;
	}
}

function pauseGame() {
	clearInterval(timerInterval);
	isPaused = true;
	pauseButton.textContent = "⏵";
	splash.style.display = "flex";
	container.style.display = "none";
}

function unpauseGame() {
	isPaused = false;
	pauseButton.textContent = "⏸︎";
	splash.style.display = "none";
	container.style.display = "block";
	timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
	clearInterval(timerInterval);
	return convertTime(timer.textContent);
}

startButton.addEventListener("click", () => {
	if (!started) {
		startGame();
		startButton.textContent = "Resume";
	} else {
		unpauseGame();
	}
});
pauseButton.addEventListener("click", () => {
	if (isPaused) {
		unpauseGame();
	} else {
		pauseGame();
	}
});

function convertTime(timeStr) {
	const timeComponents = timeStr.split(":");

	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	if (timeComponents.length === 3) {
		hours = parseInt(timeComponents[0]);
		minutes = parseInt(timeComponents[1]);
		seconds = parseInt(timeComponents[2]);
	} else if (timeComponents.length === 2) {
		minutes = parseInt(timeComponents[0]);
		seconds = parseInt(timeComponents[1]);
	} else {
		return "Invalid time format";
	}

	let result = "";
	if (hours > 0) {
		result += hours + "h ";
	}
	if (minutes > 0) {
		result += minutes + "m ";
	}
	if (seconds > 0) {
		result += seconds + "s ";
	}

	return result.trim();
}
