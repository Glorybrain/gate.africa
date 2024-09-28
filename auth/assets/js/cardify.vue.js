import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import * as module from "./helper.js?ver=0.00000000000001";

const bodyWrapper = document.getElementById("v-main");

createApp({
	data: function () {
		return {
			phoneCountryCodeObject: {
				isVisibleDropdown: false,
				totalArray: [],
				filterSearchedArray: [],
				phoneOptionDefault: {
					phoneCode: "+234",
					country: "Nigeria",
					countryShortCode: "ng",
				},
			},

			btnLoadingState: {},
			dropdownsState: {
				countryPhoneCode: false,
			},

			searchState: {
				countryDropdownSearchTerm: "",
			},

			// verification details
			verificationDetails: {
				pins: {
					pin1: "",
					pin2: "",
					pin3: "",
					pin4: "",
				},
			},

			// registeration details
			registrationUserDetails: {
				email: "",
				firstname: "",
				lastname: "",
				username: "",
				referralSource: "",
			},

			toast: {
				toastMessage: "",
				toastStatus: "toast",
			},
		};
	},

	methods: {
		async fetchData(url, responseType) {
			try {
				const response = await fetch(url, {
					mode: "cors",
					headers: {
						"Access-Control-Allow-Origin": "*",
						Origin: "*",
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				if (responseType === "text") {
					console.log(responseType);
					return await response.text();
				} else if (responseType === "json") {
					return await response.json();
				} else {
					throw new Error(`Unsupported response type: ${responseType}`);
				}
			} catch (error) {
				throw error;
			}
		},

		showToast: function (type = "modal", status, message) {
			this.toast.toastStatus = status;
			this.toast.toastMessage = message ?? "Action has failed, try again";

			if (type.toLowerCase() === "toast") {
				const t = document.querySelector("#liveToast");
				if (t) {
					const toast = new bootstrap.Toast(t);
					toast.show();
				}
			} else if (type.toLowerCase() === "modal") {
				const t = document.getElementById("toastModal");
				if (t) {
					const button = document.createElement("button");
					button.setAttribute("type", "button");
					button.setAttribute("data-bs-toggle", "modal");
					button.setAttribute("data-bs-target", "#toastModal");
					document.body.appendChild(button);
					button.click();
					button.remove();
				}
			}
		},

		toggleAuthDropdown: function () {
			this.dropdownsState.countryPhoneCode = this.dropdownsState.countryPhoneCode === false ? true : false;
		},

		async getCountryDB() {
			const countriesDB = "https://app.cardify.co/beta/auth/country_db/countries.json";
			try {
				const results = await module.fetchData(countriesDB, "json");
				console.log(results);
				return results;
			} catch (error) {
				console.error("Error fetching country database:", error);
				throw error;
			}
		},

		async getSVGFiles() {
			const flagsFolder = "https://app.cardify.co/beta/auth/assets/media/countries/";
			try {
				const text = await this.fetchData(flagsFolder, "text");
				const matches = text.match(/href="([^"]+\.svg)"/g);
				console.log({ text, matches });
				if (matches) {
					const svgList = [];
					matches.forEach((match) => {
						const fileName = match.split('="')[1].split('.svg"')[0];
						if (fileName) {
							svgList.push({ name: fileName });
						}
					});
					return svgList;
				} else {
					console.error("No SVG files found.");
					return [];
				}
			} catch (error) {
				console.error("Error fetching flags:", error);
				throw error;
			}
		},

		showToastTest: function () {
			console.log("test");
			this.showToast("modal", "failed", "Test failed");
		},

		initializeDropdown: async function () {
			const svgs = await this.getSVGFiles();
			const countries = await this.getCountryDB().then(async (res) => await res.countries);

			const svgLength = svgs.length,
				countriesLength = countries.length;

			let newArr = [];
			for (let countryIndex = 0; countryIndex < countriesLength; countryIndex++) {
				const { countryName, code, phoneCode } = countries[countryIndex];
				for (let svgIndex = 0; svgIndex < svgLength; svgIndex++) {
					let { name } = svgs[svgIndex];
					name = name.split("/assets/media/countries/").at(-1);
					if (name.toLowerCase() === code.toLowerCase()) {
						const objectItem = {
							countryCode: code.toLowerCase(),
							phoneCode,
							countryName,
						};
						newArr.push(objectItem);
					}
				}
			}

			this.phoneCountryCodeObject.totalArray = newArr;
			this.phoneCountryCodeObject.filterSearchedArray = newArr;
		},
		filterSearch: function () {
			if (this.phoneCountryCodeObject.totalArray.length) {
				const queryString = this.searchState.countryDropdownSearchTerm.trim().toLowerCase();
				const filteredArray = this.phoneCountryCodeObject.totalArray.filter((eachResult) => {
					const { countryName, countryCode } = eachResult;
					if (countryCode.toLowerCase().includes(queryString) || countryName.toLowerCase().includes(queryString)) {
						return eachResult;
					}
				});
				this.phoneCountryCodeObject.filterSearchedArray = filteredArray;
			}
		},

		updateCountryCodeObject: function (country) {
			const { countryCode, phoneCode, countryName } = country;
			this.phoneCountryCodeObject.phoneOptionDefault.country = countryName;
			this.phoneCountryCodeObject.phoneOptionDefault.phoneCode = phoneCode;
			this.phoneCountryCodeObject.phoneOptionDefault.countryShortCode = `${countryCode}`;
			this.dropdownsState.countryPhoneCode = false;
		},
	},
	created() {
		// 		this.initializeDropdown();
		// 		this.getSVGFiles();
		// 		this.getCountryDB();
	},
}).mount(bodyWrapper);
