document.addEventListener('DOMContentLoaded', function() {
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
  });

  // Handle add button click event
  addButton.addEventListener('click', function() {
    var label = labelInput.value;
    var url = urlInput.value;

    if (label && url) {
      if (isEditing) {
        updateLinkInList(label, url, editIndex);
      } else {
        addLinkToList(label, url);
      }
      resetFields();
      saveLinksToStorage();
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
          });
        } else {
          chrome.storage.sync.remove('links', function() {
            linkList.innerHTML = '';
          });
        }
      });
  });

  // Add link to the list
  function addLinkToList(label, url, index) {
    var listItem = document.createElement('li');
    listItem.dataset.index = index;

    var linkText = document.createElement('span');
    linkText.textContent = label;
    listItem.appendChild(linkText);

    listItem.appendChild(document.createTextNode(' - '));

    var urlText = document.createElement('span');
    urlText.textContent = url;
    listItem.appendChild(urlText);

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      labelInput.value = label;
      urlInput.value = url;
      isEditing = true;
      editIndex = index;
    });
    listItem.appendChild(editButton);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      linkList.removeChild(listItem);
      saveLinksToStorage();
    });
    listItem.appendChild(deleteButton);

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

  // Save the links to storage
  function saveLinksToStorage() {
    var links = Array.from(linkList.getElementsByTagName('li')).map(function(listItem) {
      var linkText = listItem.getElementsByTagName('span')[0];
      var urlText = listItem.getElementsByTagName('span')[1];

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
  }
});
