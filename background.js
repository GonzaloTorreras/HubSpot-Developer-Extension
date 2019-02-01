/*Google Analytics*/
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-122315369-1"]);

(function() {
    var ga = document.createElement("script");
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = "https://ssl.google-analytics.com/ga.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(ga, s);
})();
/*end google analytics*/
function trackClick(eventName) {
    console.log("track:" + eventName);
    _gaq.push(["_trackEvent", eventName, "clicked"]);
};

function trackPageView() {
    _gaq.push(["_trackPageview"]);
};

/*listen for clicks*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        /*console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");*/

        if (request.trackClick) {
            trackClick(request.trackClick);
            sendResponse({ farewell: "Tracked!" });
        }
    }
);

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
        console.log("script:",message.scriptToInject);
        chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject });
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function() {
         devToolsConnection.onMessage.removeListener(devToolsListener);
    });
});



chrome.commands.onCommand.addListener(function(command) {
    console.log("Command:", command);
    if (command === "bust-cache") {
        console.log("Cache bustato");
        _gaq.push(["_trackEvent", "hsCacheBuster", "kbShortcutUsed"]);





        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var tabUrl = new URL(tabs[0].url);
            var params = new URLSearchParams(tabUrl.search);
            var randomNum = Math.floor(Math.random() * 9999) + 1;
            params.set("hsCacheBuster", randomNum);


            chrome.tabs.update(tabs[0].id, { url: tabUrl.origin + tabUrl.pathname + '?' + params.toString() });
            //window.close();

        });
    } else if (command === "hs-debug") {
        console.log("debug activated");
        _gaq.push(["_trackEvent", "hsDebug", "kbShortcutUsed"]);

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
