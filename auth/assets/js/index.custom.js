import * as helperModules from "./helper.js";

const allPasswordTogglers = document.querySelectorAll("[data-toggle-password]");
const codeInputs = document.querySelectorAll(".v-form-input-inner.v-pin .form-control");
const visible = `
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
			<path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
			<path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7" />
		</g>
	</svg>
`;
const hidden = `
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<path
				stroke-linejoin="round"
				d="M10.73 5.073A10.96 10.96 0 0 1 12 5c4.664 0 8.4 2.903 10 7a11.595 11.595 0 0 1-1.555 2.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12c1.6 4.097 5.336 7 10 7a10.44 10.44 0 0 0 5.48-1.52m-7.6-7.6a3 3 0 1 0 4.243 4.243" />
			<path d="m4 4l16 16" />
		</g>
	</svg>
`;

function hideElement(element, state = "active") {
	if (!element) return;
	element.classList.remove(state);
}

function showElement(element, state = "active") {
	if (!element) return;
	element.classList.add(state);
}
if (allPasswordTogglers.length) {
	allPasswordTogglers.forEach(function (eachToggler) {
		eachToggler.addEventListener("click", function () {
			const attr = this.getAttribute("data-toggle-password");

			if (attr) {
				const formInput = document.querySelector(`[data-password-receiver=${attr}]`);
				formInput.type = formInput.type === "password" ? "text" : "password";
				formInput.type === "password" ? (eachToggler.innerHTML = visible) : (eachToggler.innerHTML = hidden);
			}
		});
	});
}
if (codeInputs.length) {
	codeInputs.forEach((input, inputIndex, currentArray) => {
		input.addEventListener("keyup", function (e) {
			const keyBoardKey = e.key;
			if (keyBoardKey !== "Backspace" && keyBoardKey !== "Delete") {
				if (inputIndex + 1 < codeInputs.length) {
					currentArray[inputIndex + 1].focus();
				}
			} else if (keyBoardKey === "Backspace" || keyBoardKey === "Delete") {
				if (inputIndex - 1 >= 0) {
					currentArray[inputIndex - 1].focus();
				}
			}
		});
		input.dispatchEvent(new Event("input"));
		input.dispatchEvent(new Event("change"));
	});

	codeInputs.forEach((input, _, inputsArrays) => {
		input.addEventListener("input", function () {
			const isAllInputsFilled = helperModules.areAllInputsFilled(inputsArrays);
			const submitFormBtn = document.querySelector(".v-form .v-action-call");
			if (isAllInputsFilled) {
				submitFormBtn.removeAttribute("disabled");
			} else {
				submitFormBtn.setAttribute("disabled", true);
			}
		});
	});
}
