/*This file runs in the background managing the connection between the content scripts the popup and options pages.*/

console.log("background found")
//check for tabs permission and if tabs permission is granted check if there is another tab with this HubID and prompt

function checkForDuplicateTabs(currentHubID) {
    //checks that user has overwrite setting on, then checks if they have the permission(to prevent hard failing if they are not in sync)
    //checks the currently open tabs to see if they are in the design manager and if they have the same HubID.
    chrome.storage.sync.get(["overwrite"], function(items) {
        if (items.overwrite) {
        	console.log("user has overwrite setting on");
            chrome.permissions.contains({
                permissions: ['tabs']
            }, function(hasPermission) {
                if (hasPermission) {
                    // The extension has the permissions.
                    console.log("Extension has the tabs permission");
                    chrome.windows.getAll({ populate: true }, function(windows) {
                    	var DMTabs=[];/*list of design manager tabs*/
                        windows.forEach(function(window) {
                            window.tabs.forEach(function(tab) {
                                //collect all of the urls here, I will just log them instead
                                console.log(tab.url);
                                //test if url is design manager 1
                                if(tab.url.includes("app.hubspot.com/beta-design-manager") || tab.url.includes("app.hubspot.com/design-manager/")){
                                	console.log("design manager tab found adding to DMTabs");
                                	DMTabs.push(tab.url);
                                }
                            });
                        });
                        console.log("DM Tabs:");
                        var duplicateTabs = false;
                        DMTabs.forEach(function(tabUrl){
                        	console.log(tabUrl);
                        	if (tabUrl.includes(currentHubID)){
                        		duplicateTabs = true;
                        	}
                        });
                        console.log("duplicateTabs:",duplicateTabs);

                        //alert("test");
                    });
                } else {
                    // The extension doesn't have the permissions.
                    console.log("no permission to check tabs");
                }
            });

        } else {
        	console.log("user does not have tabs setting on.");

        }
    });

};
/*listen for messages from tabs and other parts of the extension*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        /*response received*/
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.message.includes("DMLoaded-"))
        	var currentHubID = request.message.replace("DMLoaded-",""); 
            checkForDuplicateTabs(currentHubID);
        sendResponse({ returnMessage: "goodbye" });
    });