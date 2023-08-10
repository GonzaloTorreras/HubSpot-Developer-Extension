document.addEventListener('DOMContentLoaded', function() {

// Get all tab buttons
const tabButtons = document.querySelectorAll('.tab-button');

// Get all tab contents
const tabContents = document.querySelectorAll('.tab-content');

// Add event listeners to each tab button
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Get the value of the data-tab attribute
    const tabId = button.getAttribute('data-tab');

    // Remove 'active' class from all tab contents
    tabContents.forEach((content) => {
      content.classList.remove('active');
    });

    // Add 'active' class to the selected tab content
    document.getElementById(tabId).classList.add('active');
  });
});



//Dev menu
  var linkList = document.getElementById('link-list');
  var addButton = document.getElementById('add-link');
  var resetButton = document.getElementById('reset-default');
  var labelInput = document.getElementById('link-label');
  var urlInput = document.getElementById('link-url');
  var isEditing = false;
  var editIndex = -1;

  // Load saved links from storage
  chrome.storage.sync.get('links', function(result) {
    if (result.links) {
      result.links.forEach(function(link, index) {
        addLinkToList(link.label, link.url, index);
      });
    } else {
      // Load links from devMenu if storage is empty
      fetch('../content.json')
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data && data.devMenu) {
            var links = [];
            data.devMenu.forEach(function(menuItem) {
              if (menuItem.url && menuItem.label) {
                links.push({ label: menuItem.label, url: menuItem.url });
              }
            });
            chrome.storage.sync.set({ links: links });
            links.forEach(function(link, index) {
              addLinkToList(link.label, link.url, index);
            });
          }
        });
    }
    makeListItemsDraggable();
  });

  // Handle add button click event
  addButton.addEventListener('click', function() {
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
  resetButton.addEventListener('click', function() {
    fetch('../content.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data && data.devMenu) {
          var links = [];
          data.devMenu.forEach(function(menuItem) {
            if (menuItem.url && menuItem.label) {
              links.push({ label: menuItem.label, url: menuItem.url });
            }
          });
          chrome.storage.sync.set({ links: links }, function() {
            linkList.innerHTML = '';
            links.forEach(function(link) {
              addLinkToList(link.label, link.url);
            });
            makeListItemsDraggable();
          });
        } else {
          chrome.storage.sync.remove('links', function() {
            linkList.innerHTML = '';
            makeListItemsDraggable();
          });
        }
      });
  });

  // Add link to the list
  function addLinkToList(label, url, index) {
    var listItem = document.createElement('li');
    listItem.dataset.index = index;

    var linkDiv = document.createElement('div');
    linkDiv.classList.add('link-container');

    var linkText = document.createElement('span');
    linkText.textContent = label;
    linkDiv.appendChild(linkText);

    var urlText = document.createElement('span');
    urlText.textContent = url;
    linkDiv.appendChild(urlText);

    listItem.appendChild(linkDiv);

    var buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-container');

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      labelInput.value = label;
      urlInput.value = url;
      isEditing = true;
      editIndex = index;
      addButton.textContent = 'Update';
    });
    buttonDiv.appendChild(editButton);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      linkList.removeChild(listItem);
      saveLinksToStorage();
    });
    buttonDiv.appendChild(deleteButton);

    listItem.appendChild(buttonDiv);

    linkList.appendChild(listItem);
  }

  // Update link in the list
  function updateLinkInList(label, url, index) {
    var listItem = Array.from(linkList.getElementsByTagName('li')).find(function(li) {
      return li.dataset.index == index;
    });

    if (listItem) {
      var linkText = listItem.getElementsByTagName('span')[0];
      var urlText = listItem.getElementsByTagName('span')[1];
      linkText.textContent = label;
      urlText.textContent = url;
    }
  }

  // Make list items draggable
  function makeListItemsDraggable() {
    var listItems = linkList.getElementsByTagName('li');
    Array.from(listItems).forEach(function(item) {
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
    Array.from(listItems).forEach(function(item, index) {
      item.dataset.index = index;
      var linkDiv = item.querySelector('.link-container');
      var linkText = linkDiv.getElementsByTagName('span')[0];
      var urlText = linkDiv.getElementsByTagName('span')[1];
      var link = {
        label: linkText.textContent,
        url: urlText.textContent
      };
      links.push(link);
    });
    chrome.storage.sync.set({ links: links });
  }

  // Save the links to storage
  function saveLinksToStorage() {
    var links = Array.from(linkList.getElementsByTagName('li')).map(function(listItem) {
      var linkDiv = listItem.querySelector('.link-container');
      var linkText = linkDiv.getElementsByTagName('span')[0];
      var urlText = linkDiv.getElementsByTagName('span')[1];

      return {
        label: linkText.textContent,
        url: urlText.textContent
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
});
