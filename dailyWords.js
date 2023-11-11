// Date of start, gonna just say October 4, 2023 for now
const startDate = new Date("October 4, 2023");

function getCurrentDate() {
	let currentDate = new Date();
	document.getElementById("today").textContent = `${
		currentDate.getMonth() + 1
	}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
	return currentDate;
}

function getDayDifference() {
	let timeDifference = getCurrentDate() - startDate;
	return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

let dayDifference = getDayDifference();

let wordsForTheDay = wordList[dayDifference % wordList.length];
let puzzleNumber = (dayDifference % wordList.length) + 1;
