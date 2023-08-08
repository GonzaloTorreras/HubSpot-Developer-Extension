// background.js (or your main script where the code runs continuously)
function injectScript(tab) {
	if (typeof browser !== 'undefined' && browser.tabs.executeScript) {
		browser.tabs.executeScript(tab.id, { file: 'design-manager.js' });
	} else if (typeof chrome !== 'undefined' && chrome.tabs.executeScript) {
		chrome.tabs.executeScript(tab.id, { file: 'design-manager.js' });
	}
}

function handleTabUpdate(tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete') {
		injectScript(tab);
	}
}

if (typeof browser !== 'undefined' && browser.tabs.onUpdated) {
	browser.tabs.onUpdated.addListener(handleTabUpdate);
	browser.runtime.onInstalled.addListener(function () {
		browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
			const activeTab = tabs[0];
			injectScript(activeTab);
		});
	});
} else if (typeof chrome !== 'undefined' && chrome.tabs.onUpdated) {
	chrome.tabs.onUpdated.addListener(handleTabUpdate);
	chrome.runtime.onInstalled.addListener(function () {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const activeTab = tabs[0];
			injectScript(activeTab);
		});
	});
}

function updateTabUrl(url, params, tabId) {
	let updatedUrl = url;

	for (const [key, value] of params.entries()) {
		const updatedParam = key === 'hsCacheBuster' ? getRandomNumber() : value;
		updatedUrl.searchParams.set(key, updatedParam);
	}

	chrome.tabs.update(tabId, { url: updatedUrl.toString() });
}

chrome.commands.onCommand.addListener(function (command) {
	console.log('Command:', command);

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

function getRandomNumber() {
	return String(Math.floor(Math.random() * 9999) + 1);
}
