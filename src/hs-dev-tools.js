console.log('hsDevTools.js loaded');
// Create a mutation observer to watch for changes in the DOM
const observer = new MutationObserver(function (mutationsList, observer) {
	// Iterate over the mutations
	for (let mutation of mutationsList) {
		// Check if the mutation type is either 'childList' or 'subtree'
		if (mutation.type === 'childList' || mutation.type === 'subtree') {
			// Find the targetElement using a query selector
			const targetElement = document.querySelector('.hs-tools-menu a[href*="/___context___/"]');
			if (targetElement) {
				console.log('Dev Info link found:', targetElement.href);
				// Send a message to the runtime with the devInfoLink action and the target element's href as data
				chrome.runtime.sendMessage({ action: 'devInfoLink', data: targetElement.href });
				// Stop observing once the target element is found
				observer.disconnect();
				// Exit the loop to prevent further processing of mutations
				break;
			}
		}
	}
});

// Start observing the document body for changes to child nodes and subtree
observer.observe(document.body, { childList: true, subtree: true });

let eventListenersEnabled = false; // Flag to track the state of event listeners
let floatingButton = null; // Reference to the floating button element

// Function to handle the click event
function handleClickEvent(event) {
	const moduleElement = event.target.closest('[data-hs-cos-type="module"]');

	if (moduleElement) {
		// Toggle the event listeners
		toggleEventListeners();
		// Send a message to the runtime with the hsOpenModule action and the module ID extracted from the element's id
		chrome.runtime.sendMessage({ action: 'hsOpenModule', module_id: moduleElement.id.replace('hs_cos_wrapper_', '') });
	}
}

// Function to handle the mouseover event
function handleMouseOverEvent(event) {
	const moduleElement = event.target.closest('[data-hs-cos-type="module"]');

	if (moduleElement) {
		// Add the class to the currently hovered module
		moduleElement.classList.add('hsModuleHover');
	}
}

// Function to handle the mouseout event
function handleMouseOutEvent(event) {
	const moduleElement = event.target.closest('[data-hs-cos-type="module"]');

	if (moduleElement) {
		// Remove the class from the module
		moduleElement.classList.remove('hsModuleHover');
	}
}

// Function to enable or disable the event listeners
function toggleEventListeners() {
	if (eventListenersEnabled) {
		// Disable the event listeners
		document.removeEventListener('click', handleClickEvent);
		document.removeEventListener('mouseover', handleMouseOverEvent);
		document.removeEventListener('mouseout', handleMouseOutEvent);
		eventListenersEnabled = false;
		hideFloatingButton();
	} else {
		// Enable the event listeners
		document.addEventListener('click', handleClickEvent);
		document.addEventListener('mouseover', handleMouseOverEvent);
		document.addEventListener('mouseout', handleMouseOutEvent);
		eventListenersEnabled = true;
		showFloatingButton();
	}
}

// Function to show the floating button
function showFloatingButton() {
	if (!floatingButton) {
		// Create a button element and add it to the document body
		floatingButton = document.createElement('button');
		floatingButton.id = 'floating-btn';
		floatingButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="height: 50px;width: 30px;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
		floatingButton.addEventListener('click', toggleEventListeners);

		const styleTag = document.createElement('style');
		styleTag.textContent = `
      #floating-btn {
        position: fixed;
        bottom: 20px;
        right: 50%;
        z-index: 999999;
        background-color: #ff8f73;
        color: #2d3e50;
        border: none;
        border-radius: 100%;
        height: 50px;
        width: 50px;
        display: flex;
        align-content: center;
        justify-content: center;
        transform: translate(50%);
        cursor: pointer;
      }
      .hsModuleHover {
        position: relative;
        isolation: isolate;
        z-index: 10;
        cursor: pointer;
      }
      .hsModuleHover::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
        z-index: 9;
      }`;
		floatingButton.appendChild(styleTag);
		document.body.appendChild(floatingButton);
	}
}

// Function to hide the floating button
function hideFloatingButton() {
	if (floatingButton) {
		// Remove the floating button from the document body
		floatingButton.remove();
		floatingButton = null;
	}
}

chrome.runtime.sendMessage({ action: 'contentScriptReady' });
// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'toggleEventListeners') {
		toggleEventListeners();
	} else if (message.action === 'checkDevInfoLink') {

		const targetElement = document.querySelector('.hs-tools-menu a[href*="/___context___/"]');
		if (targetElement) {
			// Send a message to the runtime with the devInfoLink action and the target element's href as data
			console.log('Dev Info link found:', targetElement.href);
			chrome.runtime.sendMessage({ action: 'devInfoLink', data: targetElement.href });
		} else {
			chrome.runtime.sendMessage({ action: 'devInfoLink', data: null });
		}
	}
});
