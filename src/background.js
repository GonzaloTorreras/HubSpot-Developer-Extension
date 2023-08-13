console.log('HubSpot DevTools Extension - background.js loaded');

let devInfoLink;
let devInfo;
let hubID;

// Function to check the dev info link and send a message to the active tab
const checkDevInfoLink = () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { action: 'checkDevInfoLink' });
	});
};

// Listen for tab activation changes and call checkDevInfoLink
chrome.tabs.onActivated.addListener(checkDevInfoLink);

// Listen for tab updates and call checkDevInfoLink after the tab is completely loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if (changeInfo.status === 'complete') {
		checkDevInfoLink();
	}
});

// Function to open a new tab with the provided URL
function openLink(url) {
	(typeof browser !== 'undefined' ? browser.tabs.create : chrome.tabs.create)({ url: url });
}

// Function to update the URL of a tab with the specified parameters
function updateTabUrl(url, params, tabId) {
	let updatedUrl = url;

	for (const [key, value] of params.entries()) {
		// Generate a random number for the hsCacheBuster parameter
		const updatedParam = key === 'hsCacheBuster' ? getRandomNumber() : value;
		updatedUrl.searchParams.set(key, updatedParam);
	}

	chrome.tabs.update(tabId, { url: updatedUrl.toString() });
}

// Function to generate a random number as a string
function getRandomNumber() {
	return String(Math.floor(Math.random() * 9999) + 1);
}

// Recursive function to find a record with the desired ID in an object
function findRecord(object, desiredId) {
	if (object.id === desiredId || object.name === desiredId) {
		// Check if current record has the desired ID
		return object;
	}

	// Iterate through each property of the object
	for (const key in object) {
		if (typeof object[key] === 'object' && object[key] !== null) {
			// Recursively search nested objects
			const foundRecord = findRecord(object[key], desiredId);
			if (foundRecord) {
				return foundRecord;
			}
		}
	}

	// If no record found, return null
	return null;
}

// Event listener for messages from content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'checkedLoggedIn') {
		// Respond with whether devInfoLink is null or not
		sendResponse({ loggedIn: devInfoLink != null });
	} else if (message.action === 'devInfoLink') {
		// Update devInfoLink and clear devInfo
		devInfoLink = message.data;
		console.log('devInfoLink: ', devInfoLink);
		devInfo = null;
	} else if (message.action === 'hsOpenDesignManager') {
		fetch(devInfoLink)
			.then((response) => response.json())
			.then((data) => {
				devInfo = data;
				// Open the design manager page with the portal ID from devInfo
				openLink(`https://app.hubspot.com/design-manager/${data.site_settings.portal_id}`);
			})
			.catch((error) => {
				console.error('Error: ', error);
			});
	} else if (message.action === 'hsOpenModule') {
		fetch(devInfoLink)
			.then((response) => response.json())
			.then((data) => {
				devInfo = data;
				const desiredId = message.module_id;

				// Call the findRecord function to find the desired module
				const foundRecord = findRecord(devInfo, desiredId);

				if (foundRecord) {
					// Open the module's page with the module ID from the foundRecord
					openLink(`https://app.hubspot.com/design-manager/${data.site_settings.portal_id}/modules/${foundRecord.params.module_id}`);
				} else {
					console.log('No matching record found in portal: ', data.site_settings.portal_id);
				}
			})
			.catch((error) => {
				console.error('Error: ', error);
			});
	} else if (message.action === 'openOptionsPage') {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			browser.runtime.openOptionsPage();
		}
	}
});

// Event listener for keyboard commands
chrome.commands.onCommand.addListener(function (command) {
	if (command === 'bust-cache' || command === 'hs-debug') {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tabUrl = new URL(tabs[0].url);
			const params = tabUrl.searchParams;

			if (command === 'bust-cache') {
				params.set('hsCacheBuster', getRandomNumber());
			} else if (command === 'hs-debug') {
				if (params.has('hsDebug')) {
					params.delete('hsDebug');
				} else {
					params.set('hsDebug', 'True');
				}
			}

			updateTabUrl(tabUrl, params, tabs[0].id);
		});
	}
});
