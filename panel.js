console.log("paneljs loaded");
document.querySelector('#load').addEventListener('click', function(event) {
    // Permissions must be requested from inside a user gesture, like a button's
    // click handler.
    chrome.permissions.request({
      permissions: ['tabs'],
      origin:['<all_urls>']
    }, function(granted) {
      // The callback argument will be true if the user granted the permissions.
      if (granted) {
       console.log("Perm granted");
      } else {
        console.log("Perm denied");
      }
    });
  });
