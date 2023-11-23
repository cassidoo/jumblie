(function () {
	addWordsToArchive();
})();

function addWordsToArchive() {
	let dayDifference = getDayDifference();
	let archive = document.getElementById("archive");

	for (let i = dayDifference - 1; i >= 0; i--) {
		let row = document.createElement("tr");
		let puzzleNumber = i + 1;
		let theme = wordList[i % wordList.length].theme;
		let words = wordList[i % wordList.length].words;

		let puzzleNumberCell = document.createElement("th");
		puzzleNumberCell.classList.add("num");
		puzzleNumberCell.textContent = puzzleNumber;
		row.appendChild(puzzleNumberCell);

		let themeCell = document.createElement("td");
		themeCell.textContent = theme;
		row.appendChild(themeCell);

		for (let j = 0; j < words.length; j++) {
			let wordCell = document.createElement("td");
			wordCell.textContent = words[j];
			row.appendChild(wordCell);
		}

		archive.appendChild(row);
	}
}

function playJumblie() {
	window.location.href =
		"https://jumblie.com/?utm_campaign=archive&utm_source=archive";
}
