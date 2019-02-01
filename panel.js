console.log("paneljs loaded");
document.querySelector('#load').addEventListener('click', function(event) {
    // Permissions must be requested from inside a user gesture, like a button's
    // click handler.
    chrome.permissions.request({
      permissions: ['tabs'],
      origins:['<all_urls>']
    }, function(granted) {
      // The callback argument will be true if the user granted the permissions.
      if (granted) {
       console.log("Perm granted");

       // Relay the tab ID to the background page
        chrome.runtime.sendMessage({
            tabId: chrome.devtools.inspectedWindow.tabId,
            scriptToInject: "hsInspector.js"
        });
      } else {
        console.log("Perm denied");
      }
    });
  });
