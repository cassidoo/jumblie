(function () {
	toggleInputFields();

	const creditRadios = document.querySelectorAll('input[name="credit"]');
	creditRadios.forEach((radio) => {
		radio.addEventListener("change", toggleInputFields);
	});

	if (!navigator.share) {
		document.getElementById("jshare").remove();
	}
})();

function toggleInputFields() {
	const creditValue = document.querySelector(
		'input[name="credit"]:checked'
	).value;

	switch (creditValue) {
		case "credit-name":
			document.getElementById("handle-input").style.display = "none";
			document.getElementById("link-input").style.display = "flex";
			break;
		case "credit-username":
			document.getElementById("handle-input").style.display = "flex";
			document.getElementById("link-input").style.display = "flex";
			break;
		case "no-credit":
			document.getElementById("handle-input").style.display = "none";
			document.getElementById("link-input").style.display = "none";
			break;
	}
}

function shareLink() {
	if (navigator.share) {
		navigator
			.share({
				title: "Jumblie",
				text: "Check out Jumblie, a fun word search game!",
				url: "https://jumblie.com",
			})
			.then(() => console.log("Successful share"))
			.catch((error) => console.log("Error sharing", error));
	} else {
		console.log("Share not supported");
	}
}
