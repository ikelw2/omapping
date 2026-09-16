const preferenceKeys = {
	darkMode: "omapping-dark-mode",
	fontSize: "omapping-font-size"
};

function readPreference(key) {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writePreference(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// Preferences remain available for the current page when storage is blocked.
	}
}

let isDarkMode = readPreference(preferenceKeys.darkMode) === "true";

function routeLegacyIndexHash() {
	const isIndexPage = /(?:^|\/)index\.html$/i.test(window.location.pathname)
		|| window.location.pathname.endsWith("/");
	if (!isIndexPage || !window.location.hash) return;

	const fragment = window.location.hash.slice(1);
	let chapterNumber = null;

	if (fragment === "L1") chapterNumber = 1;
	else if (fragment.startsWith("L2")) chapterNumber = 2;
	else if (fragment.startsWith("L3") || fragment === "wasted" || fragment === "movepurple") chapterNumber = 3;
	else if (fragment.startsWith("L4")) chapterNumber = 4;

	if (chapterNumber) {
		window.location.replace(`chapter-${chapterNumber}.html${window.location.hash}`);
	}
}

routeLegacyIndexHash();

document.documentElement.classList.add("day");

function googleTranslateElementInit() {
	if (window.google?.translate?.TranslateElement) {
		return new window.google.translate.TranslateElement(
			{ pageLanguage: "en" },
			"google_translate_element"
		);
	}
}

function updateLightDarkInterface() {
	document.documentElement.classList.toggle("night", isDarkMode);
	document.body.classList.toggle("dark-mode", isDarkMode);
}

function toggleDarkMode() {
	isDarkMode = !isDarkMode;
	writePreference(preferenceKeys.darkMode, String(isDarkMode));
	updateLightDarkInterface();
}

const darkModeButton = document.getElementById("darkModeButton");
if (darkModeButton) {
	darkModeButton.addEventListener("click", toggleDarkMode);
}

const fontSizeSlider = document.getElementById("font-size-slider");
if (fontSizeSlider) {
	const savedFontSize = readPreference(preferenceKeys.fontSize);
	if (savedFontSize) {
		fontSizeSlider.value = savedFontSize;
		document.body.style.fontSize = `${savedFontSize}px`;
	}

	fontSizeSlider.addEventListener("input", () => {
		document.body.style.fontSize = `${fontSizeSlider.value}px`;
		writePreference(preferenceKeys.fontSize, fontSizeSlider.value);
	});
}

updateLightDarkInterface();