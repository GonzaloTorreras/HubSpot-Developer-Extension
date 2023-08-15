var tabUrl = window.location.protocol + '//' + window.location.host + '/' + window.location.pathname;
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

			//Show Sprocky
			sprocky();
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
			const contentJsonUrl = browser.runtime.getURL('devMenuLinks.json');
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

// A fun April fools joke, shows 'Sprocky'
// A fun April fools joke, shows 'Sprocky'
function sprocky() {
	console.log('Sprocky is enabled');
	const api = typeof browser !== 'undefined' ? browser : chrome;
	api.storage.local.get(['sprocky'], function (result) {
		console.log('sprocky:', result.sprocky);
		// Check if sprocky is enabled
		if (result.sprocky) {
			var quotes = [
				'Hi, it looks like you&apos;re looking to build a custom module. Do you need assistance?',
				'Sufficiently advanced technology is equivalent to magic. Therefore you, must be a wizard.',
				'/*no comment on your code*/',
				'If I were one of the Avengers I think I&apos;d be Spiderman, the original web developer.',
				'Did you know HubL can be used in the head of drag n drop templates?',
				'It&apos;s dangerous to go alone take $(this)',
				'YouDidIt = [&apos;hip&apos;,&apos;hip&apos;]',
				'When trying to explain to a client that something is complicated, use the term &apos;algorithm&apos; and avoid specifics. It works for everyone else, why not you?',
				'I think your coding experience would be improved with more Daft Punk music playing in the background.',
				'Need an HTML 5 validator? Try opening your page in Internet Explorer, did it bomb? Must be HTML 5 then.',
				'I have come to the conclusion that a web developer is just a machine that turns coffee into code, prove me wrong.',
				'Grammarly says Sprocky isn&apos;t a word. I say Grammarly isn&apos;t a word.',
				'BOO! did I scare you? I&apos;m Sprocky. Here to help.',
				'Did you know you can print a unique identifier for a custom module by using {{name}} inside the module?',
				'Remember, Internet Explorer isn&apos;t a web browser, it&apos;s a compatibility tool. - Chris Jackson, Microsoft&apos;s lead for cyber security',
				'You appear to be having trouble, have you tried turning it off and on again?',
				'Pro tip: in the copyright text of your site you can use {{year}} to always have it say the current year.',
				'If you enjoy my &apos;help&apos; and the HS dev chrome extension please consider leaving a rating and review in the chrome store. The more ratings, the more visibility it gets, the more visibility, the more people contribute to it, the faster features roll out.',
				'The HTML module still exists, the HubSpot team just hid it in the marketplace. It is free so you can still use it.',
				'The text field in custom modules now supports emojis, the marketing department said millenials would love it. *sigh*',
				'The Developer Chrome Extension is an open source project run by community developers, if there&apos;s a feature you wish it had, post an issue, submit a pull request.',
				'Happy April first from the HubSpot Developer Chrome extension team. We hope you enjoy Sprocky, if you don&apos;t he can be disabled by clicking on the extension and toggling him off.',
				'There is now a CMS for Developers certification. In the practicum cat gifs are obligatory.',
				'You can customize the HubSpot IDE by clicking settings right below me. You are most welcome.',
				'Happy April 1st from the HS Developer Chrome Extension team. I can be disabled by clicking the chrome Extension and toggling Sprocky off.',
				'Hi my name is Sprocky,  I&apos;m your design manager assistant courtesy of the Dev chrome extension. Happy April Fools.',
				'Did you know HubL supports ternary operators? *Cue &apos;Your welcome&apos; from Moana*',
				'This just in, HubSpot&apos;s branding team says please refrain from putting googly eyes on the sprocket logo.',
				'I think what this is missing is more parallax, and maybe a lens flare or two.',
				'Expected Clippy? He was taken by the Snap. I&apos;m Sprocky. #ThanosWinsInEndGame',
				'Did you know there is a HubL Menu function now that you can use to generate custom menu HTML?',
				'We interrupt your regularly scheduled programming to let you know, there&apos;s a typo in this code. Sprocky signing off.',
				'If debugging is the process of removing bugs, is programming the process of creating them? Sprocky here, debating the meaning of it all',
				'Hi I&apos;m Sprocky, you&apos;re missing a semi-colon... somewhere.',
				'Your Clippy is in another Castle.',
				'If at first you don&apos;t succeed; call it version 1.0',
				'If anyone asks - it&apos;s not a bug, it&apos; a feature!',
				'The names&apos; Sprocky, just wanted to tell you in the chrome extension popup there&apos;s a toggle for dark theme and a handy developer menu.',
				'The HubSpot Developer slack is where the culprits that created me lie. Find them in #developer-extension',
				'I don&apos;t always peak at your code, but when I do...',
				'Refactoring - ain&apos;t nobody got time for that.',
				'One does not simply grow hair like Will Spiro&apos;s.',
				'It looks like you&apos;re frustrated with that bug, how about I turn on CAPS lock for you? just kidding.',
				'Remember, if your project doesn&apos;t blow people&apos;s minds, atleast it&apos;s better than Microsoft Bob.',
				'Hi there, I&apos;m Sprocky! No, I&apos;m not Clippy, he only wishes he could rock orange like I do.',
				'Hi, there I see you&apos;re trying to be productive, let me introduce myself, I&apos;m Sprocky.',
				'Welcome to the design manager, this is where you build modules, templates, CSS and JS files. I&apos;m sprocky, here courtesy of the dev chrome extension',
				'There&apos;s a bug somewhere in your code. Made you look.',
				'It looks like you&apos;re trying to work. Would you like a distraction instead?',
				'In coded files you can click a line number or shift click line numbers to send a link to someone else and it will highlight those lines for them. Pretty spiffy.',
				'If i annoy you, there&apos;s a toggle in the hs dev chrome extension.',
				'Email templates are a pain. Let me help. Looks like you need more tables.',
				'Sick of me? theres&apos; toggle to turn me off in the dev chrome extension.',
				'Hi, my name is Sprocky, how can I help?',
			];

			const rand = quotes[Math.floor(Math.random() * quotes.length)];

			const sprockyDiv = document.createElement('div');
			sprockyDiv.id = 'sprocky';
			sprockyDiv.className = 'slide';
			sprockyDiv.innerHTML = `
			<button class="hide" title="Dismiss Sprocky">
				<span>x</span>
			</button>
			<div class="speech-bubble-ds">
				<p>${rand}</p>
				<div class="speech-bubble-ds-arrow"></div>
			</div>`;

			const sprockyImg = document.createElement('div');
			sprockyImg.className = 'sprockyimg';
			sprockyImg.title = 'Disable Sprocky permanently by clicking the HS dev Chrome Extension';
			sprockyDiv.appendChild(sprockyImg);

			const sprockySVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			sprockySVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			sprockySVG.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			sprockySVG.setAttribute('id', 'sprocky-svg');
			sprockySVG.setAttribute('width', '200');
			sprockySVG.className = 'blink';
			sprockySVG.setAttribute('viewBox', '0 0 146.5 147');
			sprockySVG.innerHTML = `
			<defs>
				<radialGradient id="radial-gradient" cx="122.7" cy="74" r="18" gradientUnits="userSpaceOnUse">
				<stop offset=".5" stop-color="#fff" />
				<stop offset=".8" stop-color="#fdfdfd" />
				<stop offset=".8" stop-color="#f6f6f6" />
				<stop offset=".9" stop-color="#ebebeb" />
				<stop offset="1" stop-color="#dadada" />
				<stop offset="1" stop-color="#c4c4c4" />
				</radialGradient>
				<radialGradient id="radial-gradient-2" cx="69.8" cy="74" r="18" xlink:href="#radial-gradient" />
			</defs>
			<g id="sprocket_layer" data-name="sprocket layer">
				<path id="sprocket" fill="#f47622" d="M127.5 69.8a37.5 37.5 0 0 0-13.6-13.4 36.5 36.5 0 0 0-13.7-4.8V33.8a13.1 13.1 0 0 0 8.1-12.3 13.5 13.5 0 1 0-27 0 13 13 0 0 0 8 12.3v17.8a39.4 39.4 0 0 0-12 3.7L29.3 19A14.8 14.8 0 0 0 30 15a15.1 15.1 0 1 0-7.3 12.8l3.2 2.4 43 31a36.3 36.3 0 0 0-6.1 7.1 33.3 33.3 0 0 0-5.6 18v1.3a37.6 37.6 0 0 0 2.4 13 34.3 34.3 0 0 0 5.6 9.7l-14.3 14.3a11.3 11.3 0 0 0-4-.8 11.6 11.6 0 1 0 11 8.2l14.8-14.8a37.7 37.7 0 0 0 6.6 3.6 38.3 38.3 0 0 0 15.3 3.2h1a36.8 36.8 0 0 0 31.3-17.4 33.9 33.9 0 0 0 5.3-18.2V88a35.8 35.8 0 0 0-4.7-18.2zm-18 31c-4 4.5-8.6 7.2-13.8 7.2h-.9a18.6 18.6 0 0 1-8.7-2.3 20.1 20.1 0 0 1-7.7-7 16.2 16.2 0 0 1-3.1-9.5v-1a19.5 19.5 0 0 1 2.2-9.4 20.5 20.5 0 0 1 7-7.8 17.5 17.5 0 0 1 10-3h.3a20 20 0 0 1 9.3 2.1 19.6 19.6 0 0 1 7.2 6.7 21 21 0 0 1 3.3 9.3v2a18.4 18.4 0 0 1-5.1 12.7z" />
			</g>
			<g id="right_eye" data-name="right eye">
				<ellipse id="right_eye_white" cx="122.7" cy="74" fill="url(#radial-gradient)" data-name="right eye white" rx="21.3" ry="14" />
				<ellipse id="right_pupil" cx="122.8" cy="74.4" class="cls-3" data-name="right pupil" rx="13.5" ry="8.8" />
				<path id="right_eyebrow" d="M146.4 63c.7-.6-2.3-10-10.5-14.8a16.8 16.8 0 0 0-9.4-2.6c-2 0-4.9.2-6.2 2.3a5.4 5.4 0 0 0 1.1 6.5c1.7 1.4 3.4.2 8.3.4a25 25 0 0 1 8.6 1.7c5.6 2.3 7.6 6.8 8 6.4z" class="cls-3" data-name="right eyebrow" />
			</g>
			<g id="left_eye" data-name="left eye">
				<ellipse id="left_eye_white" cx="69.8" cy="74" fill="url(#radial-gradient-2)" data-name="left eye white" rx="21.3" ry="14" />
				<ellipse id="left_pupil" cx="69.7" cy="74.4" class="cls-3" data-name="left pupil" rx="13.5" ry="8.8" />
				<path id="left_eyebrow" d="M43 63c-.8-.6 2.2-10 10.4-14.8a16.8 16.8 0 0 1 9.4-2.6c2 0 4.9.2 6.2 2.3a5.4 5.4 0 0 1-1.1 6.5c-1.7 1.4-3.4.2-8.3.4a25 25 0 0 0-8.6 1.7c-5.6 2.3-7.6 6.8-8 6.4z" class="cls-3" data-name="left eyebrow" />
			</g>`;

			document.body.insertAdjacentElement('beforeend', sprockyDiv);
			sprockyDiv.querySelector('.sprockyimg').appendChild(sprockySVG);

			const hideButton = sprockyDiv.querySelector('.hide');
			hideButton.addEventListener('click', hideSprocky);
		}
	});
}

// Hides the sprocky div
function hideSprocky() {
	var sprockyDiv = document.getElementById('sprocky');
	if (sprockyDiv) {
		sprockyDiv.style.display = 'none';
	}
}
