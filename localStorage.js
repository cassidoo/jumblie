function updateStreakAndFastestTimes(time, scoreString) {
	const currentDate = getCurrentDate();
	let now = `${
		currentDate.getMonth() + 1
	}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
	const lastPlayedDate = localStorage.getItem("lastPlayedDate");

	if (lastPlayedDate !== now) {
		const lastDate = new Date(lastPlayedDate);
		const lastTime = lastDate.getTime();
		const currentTime = currentDate.getTime();

		const dayDifference = Math.floor(
			(currentTime - lastTime) / (1000 * 60 * 60 * 24)
		);

		if (dayDifference === 1) {
			let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
			currentStreak++;
			localStorage.setItem("currentStreak", currentStreak);
		} else if (dayDifference > 1) {
			localStorage.setItem("currentStreak", "1");
		}
	}

	if (time === null) {
		localStorage.setItem("currentStreak", "0");
	}

	localStorage.setItem("lastPlayedDate", now);

	let currentStreak = parseInt(localStorage.getItem("currentStreak"));
	let longestStreak = parseInt(localStorage.getItem("longestStreak")) || 0;
	if (currentStreak > longestStreak) {
		localStorage.setItem("longestStreak", currentStreak);
	}

	let totalDaysPlayed = parseInt(localStorage.getItem("totalDaysPlayed")) || 0;
	totalDaysPlayed++;
	localStorage.setItem("totalDaysPlayed", totalDaysPlayed);

	if (time !== null) {
		let fastestTimes = JSON.parse(localStorage.getItem("fastestTimes")) || [];
		fastestTimes.push({ time, date: now });
		fastestTimes.sort((a, b) => a.time - b.time);
		if (fastestTimes.length > 3) {
			fastestTimes.pop();
		}
		localStorage.setItem("fastestTimes", JSON.stringify(fastestTimes));
	}

	localStorage.setItem("latestScoreString", scoreString);
	localStorage.setItem("latestTimeString", convertMillisecondsToTime(time));
}

function hasPlayedToday() {
	let today = getCurrentDate();
	let now = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
	let lastPlayedDate = localStorage.getItem("lastPlayedDate");

	return lastPlayedDate === now;
}

function autosave(game) {
	if (game === null) {
		clearAutosave();
	}

	localStorage.setItem("autosave", JSON.stringify(game));
}

function loadAutosave() {
	let autosave = JSON.parse(localStorage.getItem("autosave"));
	if (autosave) {
		return autosave;
	} else {
		return null;
	}
}

function clearAutosave() {
	localStorage.removeItem("autosave");
}
