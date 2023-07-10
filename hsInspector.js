console.log("hsinspector js loaded!");

var devInfoLink = document.querySelector(".hs-tools-menu a[href*='/___context___/']")
if (devInfoLink) {
    chrome.runtime.sendMessage({ devInfoURL: devInfoLink.href }, function (response) {
        console.table(response)
        console.log(response.farewell);
    });
} else {
    //console.log("no devInfoLink found");
    chrome.runtime.sendMessage({ devInfoURL: false }, function (response) { 
        //console.log(response.farewell);
    });
}
