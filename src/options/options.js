document.addEventListener('DOMContentLoaded', function () {
	//Dev menu
	var linkList = document.getElementById('link-list');
	var addButton = document.getElementById('add-link');
	var resetButton = document.getElementById('reset-default');
	var labelInput = document.getElementById('link-label');
	var urlInput = document.getElementById('link-url');
	var isEditing = false;
	var editIndex = -1;

	// Load saved links from storage
	chrome.storage.sync.get('links', function (result) {
		if (result.links) {
			result.links.forEach(function (link, index) {
				addLinkToList(link.label, link.url.trim(), index);
			});
		} else {
			// Load links from devMenu if storage is empty
			fetch('../content.json')
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					if (data && data.devMenu) {
						var links = [];
						data.devMenu.forEach(function (menuItem) {
							if (menuItem.url && menuItem.label) {
								links.push({ label: menuItem.label, url: menuItem.url });
							}
						});
						chrome.storage.sync.set({ links: links });
						links.forEach(function (link, index) {
							addLinkToList(link.label, link.url, index);
						});
					}
				});
		}
		makeListItemsDraggable();
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
				button.classList.add('bg-slate-800');
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
			button.classList.toggle('bg-slate-800');
			toggleIcon.classList.toggle('translate-x-0');
			toggleIcon.classList.toggle('translate-x-5');
		});
	});

	// Handle add button click event
	addButton.addEventListener('click', function () {
		var label = labelInput.value;
		var url = urlInput.value;

		if (label && url) {
			if (isEditing) {
				updateLinkInList(label, url, editIndex);
				addButton.textContent = 'Add';
			} else {
				addLinkToList(label, url);
			}
			resetFields();
			saveLinksToStorage();
			makeListItemsDraggable();
		}
	});

	// Handle reset button click event
	resetButton.addEventListener('click', function () {
		fetch('../content.json')
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				if (data && data.devMenu) {
					var links = [];
					data.devMenu.forEach(function (menuItem) {
						if (menuItem.url && menuItem.label) {
							links.push({ label: menuItem.label, url: menuItem.url });
						}
					});
					chrome.storage.sync.set({ links: links }, function () {
						linkList.innerHTML = '';
						links.forEach(function (link) {
							addLinkToList(link.label, link.url);
						});
						makeListItemsDraggable();
					});
				} else {
					chrome.storage.sync.remove('links', function () {
						linkList.innerHTML = '';
						makeListItemsDraggable();
					});
				}
			});
	});

	// Add link to the list
	function addLinkToList(label, url, index) {
		const listItem = document.createElement('li');
		listItem.className = 'hover:cursor-move flex items-center justify-between gap-x-6 py-2';
		listItem.dataset.index = index;

		listItem.innerHTML = `
		  <div class="min-w-0">
			<div class="link-container">
			  <p class="text-xs font-semibold leading-6 text-gray-900">${label}</p>
			  <p class="rounded-md whitespace-nowrap leading-6 mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-gray-600 bg-gray-50 ring-gray-500/10">${url}</p>
			</div>
		  </div>
		  <div class="isolate inline-flex rounded-md shadow-sm">
			<button data-action="edit" type="button" class="relative inline-flex items-center rounded-l-md bg-white px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
			  Edit
			</button>
			<button data-action="delete" type="button" class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
			  Delete
			</button>
		  </div>`;

		const editButton = listItem.querySelector('button[data-action="edit"]');
		editButton.addEventListener('click', function () {
			labelInput.value = label;
			urlInput.value = url;
			isEditing = true;
			editIndex = index;
			addButton.textContent = 'Update';
		});

		const deleteButton = listItem.querySelector('button[data-action="delete"]');
		deleteButton.addEventListener('click', function () {
			linkList.removeChild(listItem);
			saveLinksToStorage();
		});

		linkList.appendChild(listItem);
	}

	// Update link in the list
	function updateLinkInList(label, url, index) {
		var listItem = Array.from(linkList.getElementsByTagName('li')).find(function (li) {
			return li.dataset.index == index;
		});

		if (listItem) {
			var linkText = listItem.getElementsByTagName('p')[0];
			var urlText = listItem.getElementsByTagName('p')[1];
			linkText.textContent = label;
			urlText.textContent = url;
		}
	}

	// Make list items draggable
	function makeListItemsDraggable() {
		var listItems = linkList.getElementsByTagName('li');
		Array.from(listItems).forEach(function (item) {
			item.draggable = true;
			item.addEventListener('dragstart', dragStart);
			item.addEventListener('dragover', dragOver);
			item.addEventListener('dragend', dragEnd);
		});
	}

	// Drag start event handler
	function dragStart(event) {
		event.dataTransfer.setData('text/plain', event.target.dataset.index);
		event.target.classList.add('dragging');
	}

	// Drag over event handler
	function dragOver(event) {
		event.preventDefault();
		var draggingItem = document.querySelector('.dragging');
		var currIndex = parseInt(draggingItem.dataset.index);
		var overIndex = parseInt(event.target.dataset.index);
		var direction = currIndex > overIndex ? 'up' : 'down';
		if (draggingItem !== event.target && event.target.nodeName === 'LI') {
			if (direction === 'up') {
				event.target.parentNode.insertBefore(draggingItem, event.target);
			} else {
				event.target.parentNode.insertBefore(draggingItem, event.target.nextSibling);
			}
			updateLinkOrder();
		}
	}

	// Drag end event handler
	function dragEnd(event) {
		event.target.classList.remove('dragging');
	}

	// Update link order in storage
	function updateLinkOrder() {
		var links = [];
		var listItems = linkList.getElementsByTagName('li');
		Array.from(listItems).forEach(function (item, index) {
			item.dataset.index = index;
			var linkDiv = item.querySelector('.link-container');
			var linkText = linkDiv.getElementsByTagName('p')[0];
			var urlText = linkDiv.getElementsByTagName('p')[1];
			var link = {
				label: linkText.textContent,
				url: urlText.textContent,
			};
			links.push(link);
		});
		chrome.storage.sync.set({ links: links });
	}

	// Save the links to storage
	function saveLinksToStorage() {
		var links = Array.from(linkList.getElementsByTagName('li')).map(function (listItem) {
			var linkDiv = listItem.querySelector('.link-container');
			var linkText = linkDiv.getElementsByTagName('p')[0];
			var urlText = linkDiv.getElementsByTagName('p')[1];

			return {
				label: linkText.textContent,
				url: urlText.textContent,
			};
		});

		chrome.storage.sync.set({ links: links });
	}

	// Reset input fields and editing state
	function resetFields() {
		labelInput.value = '';
		urlInput.value = '';
		isEditing = false;
		editIndex = -1;
		addButton.textContent = 'Add';
	}

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

	fetch('https://api.github.com/repositories/127780604/releases')
		.then((response) => response.json())
		.then((data) => {
			var items = [];
			Object.entries(data).forEach(([key, val]) => {
				items.push(`
				  <li class='py-4 border-b-2' id='${key}'>
					<a target="_blank" class="block" href='${val.html_url}'>
					  <span class="font-bold text-2xl">${val.name}</span>
					  <span class="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-gray-200 bg-stone-600 ring-gray-500/10"">
					  	${val.tag_name}
					  </span>
					  <span class="prose block max-w-none">${val.body}</span>
					</a>
				  </li>
				`);
			});

			var ul = document.createElement('ul');
			ul.innerHTML = items.join('');
			document.querySelector('.releases').appendChild(ul);
		});
});
