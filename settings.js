const defaultSettings = {
	// difficulty: "hard", // TODO
	theme: "light",
	letters: "lowercase",
	visibilityAssist: false,
};

let settings = defaultSettings;

(function () {
	loadSettings();
	applySettings();
	updateTheme();
	updateLetters();
	updateVisibility();

	document
		.getElementById("settingsDialog")
		.addEventListener("show", function () {
			loadSettings();
			applySettings();
		});

	document
		.getElementById("settingsDialog")
		.addEventListener("close", function () {
			updateSettings();
			updateTheme();
			updateLetters();
			updateVisibility();
		});
})();

function loadSettings() {
	if (localStorage.getItem("settings")) {
		settings = JSON.parse(localStorage.getItem("settings"));
	} else {
		settings = defaultSettings;
	}
}

function saveSettings() {
	localStorage.setItem("settings", JSON.stringify(settings));
}

function applySettings() {
	// document.getElementById("difficultySelect").value = settings.difficulty;
	document.getElementById("themeSelect").value = settings.theme;
	document.getElementById("letterSelect").value = settings.letters;
	document.getElementById("visibilitySelect").value = settings.visibilityAssist;
}

function updateSettings() {
	// settings.difficulty = document.getElementById("difficultySelect").value;
	settings.theme = document.getElementById("themeSelect").value;
	settings.letters = document.getElementById("letterSelect").value;
	settings.visibilityAssist = document.getElementById("visibilitySelect").value;
	saveSettings();
}

function updateTheme() {
	if (settings.theme == "dark") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
}

function updateLetters() {
	if (settings.letters == "uppercase") {
		document.getElementById("letterGrid").classList.add("uppercase");
	} else {
		document.getElementById("letterGrid").classList.remove("uppercase");
	}
}

function updateVisibility() {
	if (!settings.visibilityAssist || settings.visibilityAssist === "false") {
		document.getElementById("wordsList").classList.remove("assist");
	} else {
		document.getElementById("wordsList").classList.add("assist");
	}
}

function getEmoji(index) {
	if (!settings.visibilityAssist || settings.visibilityAssist === "false") {
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
	} else {
		switch (index) {
			case 0:
				return "🔴";
			case 1:
				return "🔶";
			case 2:
				return "💚";
			case 3:
				return "🟦";
		}
	}
}
