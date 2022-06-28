console.log("paneljs loaded");

// inject hsinspector
chrome.scripting.executeScript({
    target: {tabId: chrome.devtools.inspectedWindow.tabId},
    files: ['hsInspector.js']
});
    
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.devInfoURL !== undefined) {
            if (!request.devInfoURL) { 
                sendResponse({
                    farewell: "no devInfoURL found, gotcha"
                });
                document.querySelector("h1").innerText = "No HubSpot dev Info found";
                document.querySelector("body").append("<p>Reasons this may be happening:<ul><li>This is not a HubSpot page</li><li>You are not logged in</li></ul>If both are true, please report back :)</p>");
                return false;
            }
            sendResponse({
                farewell: "devInfoURL recieved."
            });
            //display dev info link from menu
            document.querySelector("h1").innerText = "Reading dev info...";

            const devInfo = fetch(request.devInfoURL)
                .then(function (response) {
                    const r = response.text()
                    //console.log(r);
                    return r;
                })
                .then(function (text) {
                    //console.log(text);
                    document.querySelector("h1").innerText = "Dev Info:";
                    //append HTML string to page
                    document.querySelector("#result").innerText = text;
                    
                    formatJSON();
                    document.querySelector("h1").style = "display:none";

                    return true;
                })
                .catch(function (err) {
                    console.log(err);
                    document.querySelector("h1").innerText = "X_X <br> Wops! Something happened";
                    return false;
                });
            
            console.log(devInfo);
        }
    }
);
