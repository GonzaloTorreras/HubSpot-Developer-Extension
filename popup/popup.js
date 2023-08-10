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

function openTab(tabName) {
	const tabs = document.getElementsByClassName('tab');
	const tabButtons = document.querySelectorAll('#tabsContainer button');

	Array.from(tabs).forEach((tab) => {
		tab.style.display = 'none';
	});

	Array.from(tabButtons).forEach((button) => {
		button.classList.remove('active');
	});

	const activeTab = document.getElementById(tabName);
	const activeButton = document.getElementById(tabName + 'Btn');

	activeTab.style.display = 'grid';
	activeButton.classList.add('active');
}

function getRandomNumber() {
	return (Math.floor(Math.random() * 9000) + 1000).toString();
}

function getDefaultTab() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		var url = tabs[0].url;
		if (url.includes('app.hubspot.com')) {
			openTab('developerTab');
		} else {
			openTab('debugTab'); // Specify the default tab name for other URLs
		}
	});
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

function createToggle(buttonData) {
	const toggleContainer = document.createElement('div');

	const toggleCheckbox = document.createElement('input');
	toggleCheckbox.id = buttonData.id;
	toggleCheckbox.type = 'checkbox';

	const toggleLabel = document.createElement('label');
	toggleLabel.htmlFor = buttonData.id;
	toggleLabel.textContent = buttonData.label;

	const paramName = buttonData.id;

	const updateButtonState = function () {
		const api = typeof browser !== 'undefined' ? browser : chrome;

		api.storage.local.get([paramName], function (result) {
			toggleCheckbox.checked = !!result[paramName];
		});
	};

	toggleCheckbox.addEventListener('change', function () {
		const api = typeof browser !== 'undefined' ? browser : chrome;
		const checked = toggleCheckbox.checked;

		api.storage.local.set({ [paramName]: checked });

		// Perform any additional actions when the toggle changes here

		updateButtonState();
	});

	updateButtonState();

	toggleContainer.appendChild(toggleCheckbox);
	toggleContainer.appendChild(toggleLabel);

	return toggleContainer;
}

function createButton(buttonData) {
	let button;
	if (buttonData.toggle) {
		button = createToggle(buttonData);
	} else {
		button = document.createElement('button');
		button.id = buttonData.id;
		if (buttonData.width) button.dataset.width = buttonData.width;
		if (buttonData.url) button.dataset.url = buttonData.url;

		button.textContent = buttonData.label;

		button.addEventListener('click', function () {
			const functionName = buttonData.id;
			if (typeof window[functionName] === 'function') {
				window[functionName](button);
			} else {
				console.log('Function not found: ' + functionName);
			}
		});
	}

	return button;
}

function createLink(link) {
	const li = document.createElement('li');
	const linkText = document.createElement('a');
	linkText.textContent = link.label;

	if (link.url) {
		linkText.href = link.url;
		linkText.addEventListener('click', function (event) {
			event.preventDefault();
			chrome.tabs.create({ url: link.url });
		});
	}

	li.appendChild(linkText);

	if (link.children && link.children.length) {
		const ul = document.createElement('ul');

		link.children.forEach(function (childLink) {
			const childLi = createLink(childLink);
			ul.appendChild(childLi);
		});

		li.appendChild(ul);
	}

	return li;
}

function createTabContent(tab) {
	const div = document.createElement('div');
	div.id = tab.name;
	div.className = 'tab';

	tab.buttons.forEach(function (buttonData) {
		const button = createButton(buttonData);
		div.appendChild(button);
	});

	if (tab.toggles) {
		tab.toggles.forEach(function (toggleData) {
			const toggle = createToggle(toggleData);
			div.appendChild(toggle);
		});
	}

	if (tab.links) {
		const ul = document.createElement('ul');
		tab.links.forEach(function (linkData) {
			const li = createLink(linkData);
			ul.appendChild(li);
		});
		div.appendChild(ul);
	}

	return div;
}

document.addEventListener('DOMContentLoaded', function () {
	fetch('../content.json')
		.then(function (response) {
			return response.json();
		})
		.then(function (tabData) {
			var tabsContainer = document.getElementById('tabsContainer');
			var tabContentContainer = document.getElementById('tabContentContainer');

			// Create tab buttons and content dynamically based on JSON data
			tabData.tabs.forEach(function (tab) {
				var button = document.createElement('button');
				button.id = tab.name + 'Btn';
				button.textContent = tab.label;
				button.addEventListener('click', function () {
					openTab(tab.name);
				});
				var content = createTabContent(tab);

				tabsContainer.appendChild(button);
				tabContentContainer.appendChild(content);
			});

			getDefaultTab();

			const api = typeof browser !== 'undefined' ? browser : chrome;
			api.storage.sync.get(['uitweaks'], function (items) {
				if (items.uitweaks) {
					console.log('uitweaks:', items.uitweaks);
				}
			});
		})
		.catch(function (error) {
			console.error('Error loading JSON data:', error);
		});
});
