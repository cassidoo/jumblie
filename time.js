const splash = document.getElementById("splash");
const startButton = document.getElementById("start");
const container = document.getElementById("container");
const timer = document.getElementById("timer");

let timerInterval;

function startGame() {
	splash.style.display = "none";
	container.style.display = "block";

	let seconds = 0;
	let minutes = 0;
	let hours = 0;

	let display = "00:00";

	timerInterval = setInterval(() => {
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
	}, 1000);
}

function endGame() {
	clearInterval(timerInterval);
	return convertTime(timer.textContent);
}

startButton.addEventListener("click", startGame);

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
