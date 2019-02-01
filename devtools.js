var Panel = chrome.devtools.panels.create(
    "HubSpot",
    "icon-16.png",
    "/panel.html"
);

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

console.log("devtools.js ran");




/*
// Relay the tab ID to the background page
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "hsInspector.js"
});*/