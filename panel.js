console.log("paneljs loaded");
/*
var test = chrome.devtools.inspectedWindow.eval(
    "jQuery.fn.jquery",
     function(result, isException) {
       if (isException){
         console.log("the page is not using jQuery");
        return false;
       }
       else{
         console.log("The page is using jQuery v" + result);
        
         return true;
         
       }
     }
);
console.log("test:",test);
*/

function safe_tags(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


function getUrlVars(url) {
    console.log("getting vars");
    var vars = [],
        hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

chrome.permissions.contains({
    permissions: ['tabs'],
    origins: ['<all_urls>']
}, function(result) {
    if (result) {
        $("#load").remove();
        console.log("Perm granted");
        /*inject hsinspector*/
        chrome.tabs.executeScript(chrome.devtools.inspectedWindow.tabId, {
            file: "hsInspector.js"
        });
        $(".explanation").remove();

    } else {
        // The extension doesn't have the permissions.
    }
});



document.querySelector('#load').addEventListener('click', function(event) {
    // Permissions must be requested from inside a user gesture, like a button's
    // click handler - clicking the button and accepting grants permission.
    chrome.permissions.request({
        permissions: ['tabs'],
        origins: ['<all_urls>']
    }, function(granted) {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
            console.log("Perm granted");
            /*inject hsinspector*/
            chrome.tabs.executeScript(chrome.devtools.inspectedWindow.tabId, {
                file: "hsInspector.js"
            });
            $(".explanation").remove();


        } else {
            console.log("Perm denied");
            /*should display a message - cannot show dev info without permission */
        }
    });
});




chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.devInfoURL) {
            sendResponse({
                farewell: "devInfoURL recieved."
            });
            //display dev info link from menu
            $("h1").text(request.devInfoURL);

            //$("#dummy").attr('src', request.devInfoURL);

            console.log(getUrlVars(request.devInfoURL));
            var devInfoData = getUrlVars(request.devInfoURL);
            console.log("PORTAL ID:", devInfoData.portalId);
            var portalId = devInfoData.portalId;

            console.log(sender.tab.url);
            const inspectedURL = new URL(sender.tab.url);
            console.log(inspectedURL.hostname);
            console.log(inspectedURL.pathname);

            console.log("getting Token");
            jQuery.ajax({
                type: 'GET',
                url: 'https://login.hubspot.com/login/api-verify',
                data: {
                    'portalId': portalId
                }, // change to grab token
                xhrFields: {
                    withCredentials: true
                }
            }).done(function(loginData) {
                console.log("result:", loginData);
                var currentToken = loginData.auth.access_token.token;
                console.log("token", currentToken);
                var accessToken = currentToken; //doing this to pass var to HS code without touching their code to reduce screwing it up

                //now prep the data to make the ajax call to get the true dev info URL

                var envSuffix = (window.location.hostname.indexOf('qa') !== -1) ? 'qa' : ''; // checks if HS QA site
                console.log("envSuffix", envSuffix);
                //code below was pulled right off of HS's dev info redirection page
                var url = devInfoData.url,
                    portalId = devInfoData.portalId,
                    loginApiHost = 'login.hubspot' + envSuffix + '.com',
                    apiHost = 'api.hubapi' + envSuffix + '.com',
                    parser = document.createElement('a'); //not sure what in the world this is for, maybe incase auto redirect fails?
                parser.href = url;
                var accessToken = currentToken;
                var currentDomain = inspectedURL.hostname;
                $.ajax({
                    //url: 'https://' + apiHost + '/content/api/v4/domains/by-domain?portalId=' + portalId + '&domain=' + parser.hostname + '&access_token=' + accessToken,
                    url: 'https://' + currentDomain + '/__context__/' + inspectedURL.pathname + '?portalId=' + portalId + '&access_token=' + accessToken,
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function(result) {
                    console.log(result);
                    $("body").prepend($("<div id='dev-info'>" + safe_tags(JSON.stringify(result, undefined, 2)) + "</div>"))
                    formatJSON();

                    // TODO we should be able to load the css a different way in panels, we'll need to look into that
                    $.get(chrome.extension.getURL('/json-formatter.css'), function(data) {
                        $("body").prepend("<style id='json-formatter-css'>" + data + "</style>");
                    });

                });



            })
        }
    }

);