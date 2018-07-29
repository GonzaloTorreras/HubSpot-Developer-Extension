/*This file runs in the background managing the connection between the content scripts the popup and options pages.*/

console.log("background found")
//check for tabs permission and if tabs permission is granted check if there is another tab with this HubID and prompt

function checkForDuplicateTabs() {
    //checks the currently open tabs to see if they are in the design manager and if they have the same HubID.
    chrome.permissions.contains({
        permissions: ['tabs']
    }, function(hasPermission) {
        if (hasPermission) {
            // The extension has the permissions.
            console.log("Extension has the tabs permission");
            chrome.windows.getAll({ populate: true }, function(windows) {
                windows.forEach(function(window) {
                    window.tabs.forEach(function(tab) {
                        //collect all of the urls here, I will just log them instead
                        console.log(tab.url);

                    });
                });
                //alert("test");
            });
        } else {
            // The extension doesn't have the permissions.
            console.log("no permission to check tabs");
        }
    });
};
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });