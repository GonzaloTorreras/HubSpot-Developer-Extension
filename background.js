chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if (command == "bust-cache") {
        console.log("Cache bustato");




        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var tabUrl = new URL(tabs[0].url);
            var params = new URLSearchParams(tabUrl.search);
            var randomNum = Math.floor(Math.random() * 9999) + 1;
            params.set("cacheBuster", randomNum);


            chrome.tabs.update(tabs[0].id, { url: tabUrl.origin + tabUrl.pathname + '?' + params.toString() });
            //window.close();

        });
    } else if (command == "hs-debug") {
        console.log("debug activated");
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var tabUrl = new URL(tabs[0].url);
            var params = new URLSearchParams(tabUrl.search);


            if (params.has("hsDebug")) {
                params.delete("hsDebug");
            } else {
                params.append("hsDebug", "True");
            }
            chrome.tabs.update(tabs[0].id, { url: tabUrl.origin + tabUrl.pathname + '?' + params.toString() });


        });

    }
});
/*This file runs in the background managing the connection between the content scripts the popup and options pages.*/

console.log("background found")

//check for tabs permission and if tabs permission is granted check if there is another tab with this HubID and prompt

var hasOverwriteSetting = false;
chrome.storage.sync.get(["overwrite"], function(items) {
    if (items.overwrite) {
        console.log("user has overwrite setting on");
        hasOverwritePermission = true;

    } else {
        console.log("user does not have tabs setting on.");
        reply = "setting is disabled.";
        hasOverwritePermission = false;
    };
    reply = "this shouldn't be possible";
    hasOverwritePermission = false;
});




/*listen for messages from tabs and other parts of the extension*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        /*response received*/
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.message.includes("DMLoaded-")) {
            console.log("message recieved:", request.message);
            var currentHubID = request.message.replace("DMLoaded-", "");
            console.log("currentHubID", currentHubID);
            var reply;

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
                                var DMTabs = []; /*list of design manager tabs*/
                                windows.forEach(function(window) {
                                    window.tabs.forEach(function(tab) {
                                        //collect all of the urls here, I will just log them instead
                                        //console.log(tab.url);
                                        //test if url is design manager 1
                                        if (tab.url.includes("app.hubspot.com/beta-design-manager/") || tab.url.includes("app.hubspot.com/design-manager/")) {
                                            //console.log("design manager tab found adding to DMTabs");
                                            DMTabs.push(tab.url);
                                        }
                                    });
                                });
                                console.log("DM Tabs:");
                                var duplicateTabs = false;
                                if (DMTabs.length > 1) {
                                    DMTabs.forEach(function(tabUrl) {
                                        console.log(tabUrl);
                                        if (tabUrl.includes(currentHubID)) {
                                            duplicateTabs = true;
                                        }
                                    });
                                    console.log("duplicateTabs:", duplicateTabs);
                                    if (duplicateTabs) {
                                        console.log("should return true");

                                        console.log("duplicatetabs true value sent to dm.js")
                                        chrome.runtime.sendMessage({ duplicateTabs: true }, function(response) {
                                            console.log("response from dm.js", response.farewell);
                                        });

                                    } else {
                                        console.log("should return false");
                                        reply = false;

                                    }
                                } else {
                                    console.log("should return false");
                                    reply = false;

                                }
                            });
                        } else {
                            // The extension doesn't have the permissions.
                            console.log("no permission to check tabs");

                        }
                    });

                } else {
                    console.log("user does not have tabs setting on.");
                    reply = "setting is disabled.";


                };
                reply = "this shouldn't be possible";

            });



            sendResponse({ returnMessage: "processing" });
        } else {
            sendResponse({ returnMessage: "no hub ID sent" });
        }
    });