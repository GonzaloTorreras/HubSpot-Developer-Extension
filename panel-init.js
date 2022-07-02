console.log("paneljs loaded");

chrome.permissions.contains({
    permissions: ['tabs'],
    origins: ['<all_urls>']
}, function(result) {
    if (result) {
        console.log("Perm granted");
        granted();
        

    } else {
        // The extension doesn't have the permissions.
        document.querySelector('#ask-permissions').addEventListener('click', function (event) {
            
            // Permissions must be requested from inside a user gesture, like a button's
            // click handler - clicking the button and accepting grants permission.
            chrome.permissions.request({
                permissions: ['tabs'],
                origins: ['<all_urls>']
            }, function(granted) {
                // The callback argument will be true if the user granted the permissions.
                if (granted) {
                    console.log("Perm granted");
                    
                    document.querySelector(".ask-permissions-wrapper").style = "display:none;"

                    granted();


                } else {
                    console.log("Perm denied");
                    //should display a message - cannot show dev info without permission 
                    denied();
                }
            });
        });

    }
});





function granted() {
        
    // inject hsinspector
    chrome.scripting.executeScript({
        target: {tabId: chrome.devtools.inspectedWindow.tabId},
        files: ['hsInspector.js']
    });
    document.querySelector(".explanation").style="display:none";

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.devInfoURL !== undefined) {
                if (!request.devInfoURL) { 
                    sendResponse({
                        farewell: "no devInfoURL found, gotcha"
                    });
                    document.querySelector("h1").innerText = "No HubSpot dev Info link found";
                    document.querySelector("body").append("<p>Reasons this may be happening:<ul><li>This is not a HubSpot page</li><li>You are not logged in</li></ul>If both are true, please report back :)</p>");
                    return false;
                }
                sendResponse({
                    farewell: "devInfoURL recieved."
                });
                //display dev info link from menu
                document.querySelector("h1").innerText = "Loading dev Info...";

                const devInfo = fetch(request.devInfoURL)
                    .then(function (response) {
                        const r = response.text()
                        //console.log(r);
                        return r;
                    })
                    .then(function (text) {
                        //console.log(text);
                        document.querySelector("h1").innerText = "Formatting dev Info...";
                        //append HTML string to page
                        document.querySelector("#result").innerText = text;
                        
                        //formatJSON();
                        formatJSON();
                        document.querySelector("h1").innerText = "DONE!";
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
}

function denied() { 
    document.querySelector("h1").innerText = "X_X <br> Wops! We need the permissions to read your dev info";
    document.querySelector('.ask-permissions-wrapper').style = "display:block";
}