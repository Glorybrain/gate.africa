const allToggleButtons = document.querySelectorAll("[data-toggler]");
const sidebarLinksWithDropdown = document.querySelectorAll(".v-main-link-container:has(.v-is-dropdown) .v-sidebar-link");

function hideElement(element, state = "active") {
	if (!element) return;
	element.classList.remove(state);
}

function showElement(element, state = "active") {
	if (!element) return;
	element.classList.add(state);
}

function toggleElementVisibility(element, state = "active") {
	if (!element) return;
	if (element.classList.contains(state)) {
		hideElement(element, state);
	} else {
		showElement(element, state);
	}
}

function toggleSideBarLinkDropdown(event, allArr) {
	event.stopPropagation();
	const self = event.target;
	if (self && self.classList.contains("active")) {
		return hideElement(self, "active");
	}
	allArr.forEach(function (elem) {
		if (self !== elem) {
			hideElement(elem, "active");
		}
	});

	return showElement(self, "active");
}
if (sidebarLinksWithDropdown.length) {
	sidebarLinksWithDropdown.forEach((link, _, allArr) => {
		link.addEventListener("click", (event) => toggleSideBarLinkDropdown(event, allArr));
	});
}

if (allToggleButtons.length) {
	allToggleButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			const attr = button.getAttribute("data-toggler");
			if (!attr) return;

			const dropdown = document.querySelector(`[data-receiver=${attr}]`);
			if (!dropdown) return;

			allToggleButtons.forEach((btn) => {
				const otherAttr = btn.getAttribute("data-toggler");
				if (otherAttr && otherAttr !== attr) {
					const otherDropdown = document.querySelector(`[data-receiver=${otherAttr}]`);
					if (otherDropdown && otherDropdown.classList.contains("active")) {
						hideElement(otherDropdown);
					}
					if (btn.classList.contains("active")) {
						hideElement(btn);
					}
				}
			});

			toggleElementVisibility(dropdown);
			toggleElementVisibility(button);
		});

		document.addEventListener("click", function (event) {
			const itsDropdown = document.querySelector(`[data-receiver=${button.getAttribute("data-toggler")}]`);
			if (event.target !== button && button.classList.contains("active")) {
				button.classList.remove("active");
				itsDropdown.classList.remove("active");
			}
		});
	});
}
