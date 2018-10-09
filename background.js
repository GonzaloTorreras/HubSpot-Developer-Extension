var developerTools = {
	debugReload: function(debugParam) {

	    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		    var tabUrl = new URL(tabs[0].url);
		    var params = new URLSearchParams(tabUrl.search);

		   

		    if (debugParam === "cacheBuster") {
		        var randomNum = Math.floor(Math.random() * 9999) + 1;
		        params.set("cacheBuster", randomNum);
		    } else if (params.has(debugParam)) {
		        params.delete(debugParam);
		    } else {
		        params.append(debugParam, "True");
		    }

		    chrome.tabs.update(tabs[0].id, { url: tabUrl.origin + tabUrl.pathname + '?' + params.toString() });
		    window.close();

	    });
	}
}
chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if(command == "bust-cache"){
    	console.log("Cache bustato");


    	
    	developerTools.debugReload("cacheBuster");
    };
});