var developerTools = {

	debugReload: function(debugParam) {

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var tabUrl = new URL(tabs[0].url);
			var params = new URLSearchParams(tabUrl.search);
			if (params.has(debugParam)) {
				params.delete(debugParam);
			} else {
				params.append(debugParam, "True");
			}
			chrome.tabs.update(tabs[0].id, {url: tabUrl.origin + tabUrl.pathname + '?' + params.toString()});
		});

	},

	onLoad: function() {

		$('button.debugButton').click(function () {
			developerTools.debugReload($(this).attr('id'));
		});

		// document.styleSheets;

	}

};


window.onload = developerTools.onLoad();
