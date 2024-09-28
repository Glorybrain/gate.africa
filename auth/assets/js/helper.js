function checkIfFalse(data) {
	const falsies = ["", undefined, null, [], false].includes(data);
	if (falsies) {
		return true;
	}
	return false;
}

function areAllInputsFilled(formInputsArray, element = null) {
	if (element === null) {
		for (const input of formInputsArray) {
			if (checkIfFalse(input.value.trim())) {
				return false;
			}
		}
	} else {
		for (const input of element.querySelectorAll(formInputsArray)) {
			if (checkIfFalse(input.value.trim())) {
				return false;
			}
		}
	}
	return true;
}

function toggleThings(el, toggleStateValue = "active") {
	el && el.classList.contains(toggleStateValue) ? el.classList.remove(toggleStateValue) : el.classList.add(toggleStateValue);
}

async function fetchData(url, expectedResponseType = null) {
	let responseType;
	const response = await fetch(url, { mode: "no-cors" });
	switch (expectedResponseType?.toLowerCase()) {
		case null:
		case "json":
			responseType = await response.json();
			break;
		case "text":
			responseType = await response.text();
			break;
	}

	return responseType;
}

function createElement(elementToCreate) {
	if (elementToCreate) {
		return document.createElement(elementToCreate);
	}
}

export { checkIfFalse, areAllInputsFilled, toggleThings, fetchData, createElement };
