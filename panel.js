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

function getLink(){
    console.log("woo I made it!");
}
chrome.tabs.executeScript(chrome.devtools.inspectedWindow.tabId,
    { file: "hsInspector.js" });

console.log("running query");
    jQuery.ajax({
        type: 'POST',
        url: 'https://login.hubspot.com/login/api-verify',
        data: {'portalId':"86417"},
        xhrFields: {
            withCredentials: true
       }
    }).done(function(loginData) {
        console.log("result:",loginData);
    })

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.devInfoURL){
            sendResponse({farewell: "devInfoURL recieved."});
            $("h1").text(request.devInfoURL);

            $("#dummy").attr('src',request.devInfoURL);
            

/*
            function getUrlVars(){
                var vars = [], hash;
                var hashes = request.devInfoURL.slice(request.devInfoURL.indexOf('?') + 1).split('&');
                for(var i = 0; i < hashes.length; i++)
                {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }
            console.log(getUrlVars());
            var devInfoData = getUrlVars();
            console.log("PORTAL ID:",devInfoData.portalId)

            
           
                function getParameterByName(name) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(location.search);
                    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                }
    
                var envSuffix = (window.location.hostname.indexOf('qa') !== -1) ? 'qa' : '';
    
                var url = devInfoData.url,
                    portalId = devInfoData.portalId,
                    loginApiHost = 'login.hubspot' + envSuffix + '.com',
                    apiHost = 'api.hubapi' + envSuffix + '.com',
                    parser = document.createElement('a');
                parser.href = url;
                $.ajax({
                    type: 'POST',
                    url: 'https://' + loginApiHost + '/login/api-verify',
                    data: {'portalId':portalId},
                    xhrFields: {
                        withCredentials: true
                   }
                }).done(function(loginData) {
                    var accessToken = loginData.auth.access_token.token;
                    $.ajax({
                        url: 'https://' + apiHost + '/content/api/v4/domains/by-domain?portalId=' + portalId + '&domain=' + parser.hostname + '&access_token=' + accessToken,
                        xhrFields: {
                            withCredentials: true
                        }
                    }).done(function(domainData) {
                        if (domainData.isResolving) {
                            var redir = parser.protocol + '//' + parser.hostname + '/__context__' + parser.pathname + parser.search;
                            redir += (redir.indexOf('?') !== -1) ? '&' : '?';
                            redir += 'portalId=' + portalId + '&access_token=' + accessToken;
                            window.location.href = redir;
                        }
                    });
                }).fail(function() {
                    window.location.href = 'https://' + loginApiHost + '/login';
                });
            


*/


            }
        }

);

/*
document.querySelector('#load').addEventListener('click', function(event) {
    // Permissions must be requested from inside a user gesture, like a button's
    // click handler.
    chrome.permissions.request({
      permissions: ['tabs'],
      origins:['<all_urls>']
    }, function(granted) {
      // The callback argument will be true if the user granted the permissions.
      if (granted) {
       console.log("Perm granted");

       
      } else {
        console.log("Perm denied");
      }
    });
  });
*/