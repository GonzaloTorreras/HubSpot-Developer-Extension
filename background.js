

chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if(command == "bust-cache"){
    	console.log("Cache bustato");


    	
    	
    	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		    var tabUrl = new URL(tabs[0].url);
		    var params = new URLSearchParams(tabUrl.search);
			var randomNum = Math.floor(Math.random() * 9999) + 1;
		    params.set("cacheBuster", randomNum);
		   

		    chrome.tabs.update(tabs[0].id, { url: tabUrl.origin + tabUrl.pathname + '?' + params.toString() });
		    //window.close();

    	});
    }else if(command == "hs-debug"){
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