var tabUrl =
	window.location.protocol + '//' + window.location.host + '/' + window.location.pathname;
var currentScreen = '';

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

		Object.entries(hubspotPages).forEach(([page, isMatched]) => {
			if (isMatched) {
				console.log(`${page.charAt(0).toUpperCase() + page.slice(1)} is active`);
				currentScreen = page;
			}
		});

		waitForEl('.account-name', () => {
			setTitle(document.querySelector('.account-name').textContent);
		});

		if (tabUrl.includes('/design-manager/')) {
			console.log('Design Manager is active');
			currentScreen = 'design-manager';
			const api = typeof browser !== 'undefined' ? browser : chrome;
			api.storage.local.get(['darktheme'], function (result) {
				const darkthemeVaule = result.darktheme;
				console.log('darktheme:', darkthemeVaule);
				if (darkthemeVaule) {
					document.querySelector('body').classList.add('ext-dark-theme');
				}
			});
		}
	} else if (/designers\.hubspot\.com\/docs/i.test(tabUrl)) {
		currentScreen = 'docs';
	} else {
		console.log('This is not in the HubSpot Backend');
	}

	function generateDevMenuItem(buttonLabel, hubId, url) {
		const link = url.replace('_HUB_ID_', hubId);
		return `<li role="none">
            <a role="menuitem" data-tracking="click hover" id="nav-secondary-design-tools-beta" class="navSecondaryLink" href="${link}">
              ${buttonLabel}
            </a>
          </li>`;
	}

	function generateAllMenuItems(hubId) {
		const prefix = '/';
		return `${generateDevMenuItem('Design Manager', hubId, prefix + 'design-manager/_HUB_ID_')}
          ${generateDevMenuItem('Content Staging', hubId, prefix + 'content/_HUB_ID_/staging/')}
          ${generateDevMenuItem(
				'Website Pages',
				hubId,
				prefix + 'pages/_HUB_ID_/manage/site/domain/all/listing/all'
			)}
          ${generateDevMenuItem('HubDB', hubId, prefix + 'hubdb/_HUB_ID_')}
          ${generateDevMenuItem('File Manager', hubId, prefix + 'file-manager-beta/_HUB_ID_')}
          ${generateDevMenuItem(
				'Advanced Menus',
				hubId,
				prefix + 'settings/_HUB_ID_/website/navigation'
			)}
          ${generateDevMenuItem(
				'Content Settings',
				hubId,
				prefix + 'settings/_HUB_ID_/website/pages/all-domains/page-templates'
			)}
          ${generateDevMenuItem('URL Redirects', hubId, prefix + 'domains/_HUB_ID_/url-redirects')}
          ${generateDevMenuItem('Marketplace', hubId, prefix + 'marketplace/_HUB_ID_/products')}`;
	}

	function generateDevMenu(hubId) {
		const html = `<li id="ext-dev-menu-wrapper" role="none" class="expandable">
                  <a href="#" id="nav-primary-dev-branch" aria-haspopup="true" aria-expanded="false" class="primary-link" data-tracking="click hover" role-menu="menuitem">
                    Developer Extension <svg style="max-height:4px;max-width:10px;" class="nav-icon arrow-down-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 13"><g><g><path d="M21.47,0.41L12,9.43l-9.47-9A1.5,1.5,0,1,0,.47,2.59l10.5,10,0,0a1.51,1.51,0,0,0,.44.28h0a1.43,1.43,0,0,0,1,0h0A1.52,1.52,0,0,0,13,12.61l0,0,10.5-10A1.5,1.5,0,1,0,21.47.41" transform="translate(0 0)"></path></g></g></svg>
                  </a>
                  <div id="ext-dev-menu" aria-label="Developer" role="menu" class="secondary-nav expansion" style="min-height: 0px">
                    <ul role="none">
                      ${generateAllMenuItems(hubId)}
                    </ul>
                  </div>
              </li>`;

		const navLinks = document.querySelector('.nav-links ul.primary-links');
		const firstChild = navLinks.firstElementChild;

		firstChild.insertAdjacentHTML('afterend', html);

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

		const devMenuLinks = document.querySelectorAll(
			'#ext-dev-menu .navSecondaryLink, #ext-dev-menu .devMenuLink'
		);

		devMenuLinks.forEach(function (link) {
			link.addEventListener('click', function () {
				const linkName = 'devMenu:' + link.textContent.trim();
			});
		});
	}

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
	api.storage.local.get(function (result) {
		console.log('Stored value:', result);
	});

	api.storage.local.get(['uitweaks'], function (result) {
		const uitweaksValue = result.uitweaks;
		console.log('uitweaks:', uitweaksValue);
		if (uitweaksValue) {
			let hubId;
			waitForEl('.navAccount-portalId', function () {
				hubId = document.querySelector('.navAccount-portalId').textContent;
				generateDevMenu(hubId);
			});
		}
	});
}
