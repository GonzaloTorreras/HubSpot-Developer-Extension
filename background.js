/*Google Analytics*/
/* temporary kill GA
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
*/
/*end google analytics*/
/*
function trackClick(eventName) {
    console.log("track:" + eventName);
    _gaq.push(["_trackEvent", eventName, "clicked"]);
};

function trackPageView() {
    _gaq.push(["_trackPageview"]);
};
*/
console.log("background.js loaded");
/*listen for clicks*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        /*console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");*/

        if (request.trackClick) {
            trackClick(request.trackClick);
            sendResponse({ farewell: "Tracked!" });
        } else if (request.devInfoURL) { 
            if (request.devInfoURL) {
                sendResponse({ farewell: "devInfoURL recieved." });
            } else { 
                sendResponse({ farewell: "no devInfoURL found, gotcha" });
            }
        } else { 
            sendResponse({ farewell: "undefined" });
        }
        //console.table(request)
    }
);



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

chrome.runtime.onSuspend.addListener(() => {
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({text: ""});
});