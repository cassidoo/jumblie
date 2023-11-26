(function () {
	addWordsToArchive();
	if (!navigator.share) {
		document.getElementById("jshare").remove();
	}
})();

function addWordsToArchive() {
	let dayDifference = getDayDifference();
	let archive = document.getElementById("archivecontainer");

	for (let i = dayDifference - 1; i >= 0; i--) {
		let row = document.createElement("details");
		let puzzleNumber = i + 1;
		let theme = wordList[i % wordList.length].theme;
		let words = wordList[i % wordList.length].words;

		let puzzleSummary = document.createElement("summary");
		puzzleSummary.classList.add("puzzle-number");
		puzzleSummary.innerHTML = `#${puzzleNumber} ${coloredBullets()} ${theme}`;
		row.appendChild(puzzleSummary);

		let wordListCell = document.createElement("ul");
		wordListCell.classList.add("word-result");

		for (let j = 0; j < words.length; j++) {
			let wordCell = document.createElement("li");
			wordCell.classList.add(`word-${j}`);
			wordCell.textContent = words[j];
			wordListCell.appendChild(wordCell);
		}

		row.appendChild(wordListCell);
		archive.appendChild(row);
	}
}

function coloredBullets() {
	let bullets = "";
	for (let i = 0; i < 4; i++) {
		bullets += `<span class="color-${i}">•</span>`;
	}
	return bullets;
}
