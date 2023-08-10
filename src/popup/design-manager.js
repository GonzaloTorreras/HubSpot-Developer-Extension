var tabUrl =
	window.location.protocol + '//' + window.location.host + '/' + window.location.pathname;
var currentScreen = '';

// Function to set the title based on the current screen
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

// Function to wait for the element to be available in the DOM
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

let appUrl = '';
if (/local\.hubspot/i.test(tabUrl)) {
	appUrl = /local\.hubspotqa/i.test(tabUrl) ? 'local.hubspotqa.com' : 'local.hubspot.com';
} else {
	appUrl = /app\.hubspotqa\.com/i.test(tabUrl) ? 'app.hubspotqa.com' : 'app.hubspot.com';
}

// Check if the URL is from HubSpot Backend
if (~tabUrl.indexOf(appUrl)) {
	if (/hubspot\.com/i.test(tabUrl)) {
		console.log('This is the HubSpot backend.');

		const hubspotPages = {
			'design-manager': /design-manager/i.test(tabUrl),
			'content-staging': /staging/i.test(tabUrl),
			dashboard: /reports-dashboard/i.test(tabUrl),
			'website-pages': /pages.*site/i.test(tabUrl),
			'landing-pages': /pages.*landing/i.test(tabUrl),
			'file-manager': /file-manager-beta/i.test(tabUrl),
			hubdb: /hubdb/i.test(tabUrl),
			settings: /settings(?!.*navigation)/i.test(tabUrl),
			'navigation-settings': /settings.*navigation/i.test(tabUrl),
			blog: /blog/i.test(tabUrl),
			'url-redirects': /url-redirects/i.test(tabUrl),
		};

		// Find the current active screen
		Object.entries(hubspotPages).forEach(([page, isMatched]) => {
			if (isMatched) {
				console.log(`${page.charAt(0).toUpperCase() + page.slice(1)} is active`);
				currentScreen = page;
			}
		});

		// Wait for the account name element to be available
		waitForEl('.account-name', () => {
			setTitle(document.querySelector('.account-name').textContent);
		});

		// Add dark theme CSS if in Design Manager
		if (tabUrl.includes('/design-manager/')) {
			const api = typeof browser !== 'undefined' ? browser : chrome;
			api.storage.local.get(['darktheme'], function (result) {
				const darkthemeVaule = result.darktheme;
				console.log('darktheme:', darkthemeVaule);
				if (darkthemeVaule) {
					const cssFilePath = browser.runtime.getURL('hsDarkIde.css');
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.type = 'text/css';
					link.href = cssFilePath;
					document.head.appendChild(link);
					document.querySelector('body').classList.add('ext-dark-theme');
				}
			});
		}
	} else if (/designers\.hubspot\.com\/docs/i.test(tabUrl)) {
		currentScreen = 'docs';
	} else {
		console.log('This is not in the HubSpot Backend');
	}

	// Function to generate a menu item HTML
	function generateDevMenuItem(buttonLabel, hubId, url) {
		const link = url.replace('_HUB_ID_', hubId);
		return `
      <li role="none">
        <a role="menuitem" data-tracking="click hover" id="nav-secondary-design-tools-beta" class="navSecondaryLink" href="${link}">
          ${buttonLabel}
        </a>
      </li>`;
	}

	// Function to generate all menu items
	async function generateAllMenuItems(hubId) {
		const prefix = '/';
		let links = [];

		const getLinksFromStorage = new Promise((resolve) => {
			chrome.storage.sync.get('links', function (result) {
				if (result.links) {
					links = result.links;
				}
				resolve();
			});
		});

		await getLinksFromStorage;

		if (links.length === 0) {
			const contentJsonUrl = browser.runtime.getURL('content.json');
			const response = await fetch(contentJsonUrl);
			const data = await response.json();

			if (data.devMenu) {
				links = data.devMenu.map((item) => ({
					label: item.label,
					url: prefix + item.url,
				}));
				chrome.storage.sync.set({ links: links });
			}
		}

		let menuItems = '';
		links.forEach((link) => {
			menuItems += generateDevMenuItem(link.label, hubId, prefix + link.url);
		});

		return menuItems;
	}

	// Generate the developer's menu
	async function generateDevMenu(hubId) {
		function sanitizeHTML(html) {
			const template = document.createElement('template');
			template.innerHTML = html;
			return template.content;
		}

		const html = `<li id="ext-dev-menu-wrapper" role="none" class="expandable">
						<a href="#" id="nav-primary-dev-branch" aria-haspopup="true" aria-expanded="false" class="primary-link" data-tracking="click hover" role-menu="menuitem">
						  Developer Extension <svg style="max-height:4px;max-width:10px;" class="nav-icon arrow-down-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 13"><g><g><path d="M21.47,0.41L12,9.43l-9.47-9A1.5,1.5,0,1,0,.47,2.59l10.5,10,0,0a1.51,1.51,0,0,0,.44.28h0a1.43,1.43,0,0,0,1,0h0A1.52,1.52,0,0,0,13,12.61l0,0,10.5-10A1.5,1.5,0,1,0,21.47.41" transform="translate(0 0)"></path></g></g></svg>
						</a>
						<div id="ext-dev-menu" aria-label="Developer" role="menu" class="secondary-nav expansion" style="min-height: 0px">
						  <ul role="none">

						  </ul>
						</div>
					</li>`;

		const sanitizedContent = sanitizeHTML(html);

		const navLinks = document.querySelector('.nav-links ul.primary-links');
		const firstChild = navLinks.firstElementChild;

		while (sanitizedContent.firstChild) {
			firstChild.insertAdjacentElement('afterend', sanitizedContent.firstChild);
		}

		// Add event listener for toggling the menu
		const devMenuWrapper = document.querySelector('#ext-dev-menu-wrapper');
		const devMenuLink = document.querySelector('#nav-primary-dev-branch');

		devMenuLink.addEventListener('click', function (e) {
			e.preventDefault();
			const isExpanded = devMenuLink.getAttribute('aria-expanded');

			if (isExpanded === 'true') {
				devMenuLink.setAttribute('aria-expanded', 'false');
			} else {
				devMenuLink.setAttribute('aria-expanded', 'true');
			}

			devMenuWrapper.classList.toggle('active');
		});

		// Generate and insert menu items
		const menuItems = await generateAllMenuItems(hubId);

		const devMenuUL = document.querySelector('#ext-dev-menu ul');

		// Create a temporary element to safely parse the HTML
		const tempContainer = document.createElement('div');
		tempContainer.innerHTML = menuItems;

		// Append each child element individually to the devMenuUL
		while (tempContainer.firstChild) {
			devMenuUL.appendChild(tempContainer.firstChild);
		}
	}

	// Wait for the navigation elements
	function waitForEl(selector, callback) {
		if (document.querySelector(selector)) {
			callback();
		} else {
			setTimeout(function () {
				waitForEl(selector, callback);
			}, 100);
		}
	}

	const api = typeof browser !== 'undefined' ? browser : chrome;
	api.storage.local.get(['devMenu'], function (result) {
		const devMenuValue = result.devMenu;
		console.log('devMenu:', devMenuValue);
		if (devMenuValue) {
			console.log('Generating the developer menu');
			let hubId;
			waitForEl('.navAccount-portalId', function () {
				hubId = document.querySelector('.navAccount-portalId').textContent;
				generateDevMenu(hubId);
			});
		}
	});
}
