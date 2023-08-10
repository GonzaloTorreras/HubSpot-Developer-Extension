// Send a message to the background script to open the options page
document.addEventListener('DOMContentLoaded', function () {
	// Find the button element
	var openOptionsButton = document.getElementById('open-options-button');

	// Add a click event listener
	openOptionsButton.addEventListener('click', function () {
		// Send a message to the background script to open the options page
		chrome.runtime.sendMessage({ action: 'openOptionsPage' });
	});
});

function toggleQueryParam(paramName) {
	var api = typeof browser !== 'undefined' ? browser : chrome;

	api.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
		var currentTab = tabs[0];
		var url = new URL(currentTab.url);

		if (url.searchParams.has(paramName)) {
			url.searchParams.delete(paramName);
		} else {
			url.searchParams.set(paramName, 'true');
		}

		api.tabs.update(currentTab.id, { url: url.toString() });
	});
}

function openLink(url) {
	(typeof browser !== 'undefined' ? browser.tabs.create : chrome.tabs.create)({ url: url });
}

function hsDebug() {
	toggleQueryParam('hsDebug');
}

function hsMoveJQueryToFooter() {
	toggleQueryParam('hsMoveJQueryToFooter');
}

function hsAmp() {
	toggleQueryParam('hsAmp');
}

function developerMode() {
	toggleQueryParam('developerMode');
}

function hsOpenDesignManager(button) {
	openLink(button.dataset.url);
}

function getCurrentURL(callback) {
	if (typeof browser !== 'undefined') {
		browser.tabs
			.query({ active: true, currentWindow: true })
			.then((tabs) => {
				const currentUrl = tabs[0].url;
				callback(currentUrl);
			})
			.catch((error) => {
				console.error('Error getting current URL:', error);
				callback(null);
			});
	} else if (typeof chrome !== 'undefined') {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const currentUrl = tabs[0].url;
			callback(currentUrl);
		});
	} else {
		console.error('Unsupported browser API');
		callback(null);
	}
}

function pageSpeed() {
	getCurrentURL(function (currentUrl) {
		openLink('https://developers.google.com/speed/pagespeed/insights/?url=' + currentUrl);
	});
}

function hsCacheBuster() {
	var api = typeof browser !== 'undefined' ? browser : chrome;
	var paramName = 'hsCacheBuster';

	api.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
		var currentTab = tabs[0];
		var url = new URL(currentTab.url);

		if (url.searchParams.has(paramName)) {
			url.searchParams.set(paramName, getRandomNumber());
		} else {
			url.searchParams.set(paramName, getRandomNumber());
		}

		api.tabs.update(currentTab.id, { url: url.toString() });
	});
}

function getRandomNumber() {
	return (Math.floor(Math.random() * 9000) + 1000).toString();
}

function waitForEl(selector, callback) {
	const observer = new MutationObserver(() => {
		const element = document.querySelector(selector);
		if (element) {
			observer.disconnect();
			callback();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

function setTitle(siteName) {
	var portal = siteName.replace('www.', '');
	if (currentScreen === 'design-manager') {
		document.title = 'DM | ' + portal + ' | HS';
	} else if (currentScreen === 'content-staging') {
		document.title = 'CS | ' + portal + ' | HS';
	} else if (currentScreen === 'dashboard') {
		document.title = 'DB | ' + portal + ' | HS';
	} else if (currentScreen === 'website-pages') {
		document.title = 'WP | ' + portal + ' | HS';
	} else if (currentScreen === 'landing-pages') {
		document.title = 'LP | ' + portal + ' | HS';
	} else if (currentScreen === 'file-manager') {
		document.title = 'FM | ' + portal + ' | HS';
	} else if (currentScreen === 'hubdb') {
		document.title = 'DB | ' + portal + ' | HS';
	} else if (currentScreen === 'settings') {
		document.title = 'ST | ' + portal + ' | HS';
	} else if (currentScreen === 'navigation-settings') {
		document.title = 'NS | ' + portal + ' | HS';
	} else if (currentScreen === 'blog') {
		document.title = 'BL | ' + portal + ' | HS';
	} else if (currentScreen === 'url-redirects') {
		document.title = 'UR | ' + portal + ' | HS';
	}
}

waitForEl('.account-name', function () {
	setTitle(document.querySelector('.account-name').textContent);
});

const buttons = document.querySelectorAll('.hsButton');

// Add click event listener to each button
buttons.forEach((button) => {
	button.addEventListener('click', function () {
		const functionName = button.id;
		if (typeof window[functionName] === 'function') {
			window[functionName](button);
		} else {
			console.log('Function not found: ' + functionName);
		}
	});
});

// Get all buttons with the class "hsToggle"
const toggleButtons = document.querySelectorAll('.hsToggle');

// Function to toggle item in extension storage
function toggleItemStorage(storageId, checked) {
	const api = typeof browser !== 'undefined' ? browser : chrome;

	const storageItem = { [storageId]: checked };

	api.storage.local.set(storageItem, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		} else {
			console.log('Item stored successfully');
		}
	});
}

toggleButtons.forEach((button) => {
	const toggleIcon = button.querySelector('span[aria-hidden="true"]');
	const storageToggle = button.getAttribute('data-storage');

	// Check if the item is already stored
	const api = typeof browser !== 'undefined' ? browser : chrome;

	api.storage.local.get(storageToggle, function (result) {
		const itemStored = result[storageToggle];
		if (itemStored) {
			button.setAttribute('aria-checked', 'true');
			button.classList.add('bg-indigo-600');
			toggleIcon.classList.add('translate-x-5');
		}
	});

	button.addEventListener('click', function () {
		const isChecked = button.getAttribute('aria-checked') === 'true';

		// Toggle the state
		button.setAttribute('aria-checked', !isChecked);

		// Toggle the item in storage
		toggleItemStorage(storageToggle, !isChecked);

		button.classList.toggle('bg-gray-200');
		button.classList.toggle('bg-indigo-600');
		toggleIcon.classList.toggle('translate-x-0');
		toggleIcon.classList.toggle('translate-x-5');
	});
});

// Get all tab links
const tabLinks = document.querySelectorAll('nav a');

// Get all tab contents
const tabContents = document.getElementsByClassName('tab-content');

// Add click event listener to each tab link
tabLinks.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();

		// Remove active class from all tab links
		tabLinks.forEach((link) => {
			link.classList.remove('tab-active');
		});

		// Hide all tab contents
		for (let i = 0; i < tabContents.length; i++) {
			tabContents[i].classList.add('hidden');
		}

		// Show the selected tab content based on the data attribute
		const tabId = link.dataset.tab;
		document.getElementById(tabId).classList.remove('hidden');

		// Add active class to the current tab link
		link.classList.add('tab-active');
	});
});
