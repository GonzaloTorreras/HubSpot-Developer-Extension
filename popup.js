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
	getPsiData: function() {
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		    var pageUrl = new URL(tabs[0].url);
		    var gradeUrl = pageUrl.origin.replace("://", "%3A%2F%2F") + pageUrl.pathname;
			$.getJSON('https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=' + gradeUrl + '&fields=id%2CruleGroups', function(data){
				if (data.id) {
					$("#desktop_psi_placeholder").html('Desktop PSI Score<span class="score">' + data.ruleGroups.SPEED.score + '</span>');
				} else {
					console.log('hmmmmm, Googles APIs are really painful, they did not grade for some reason');
				}
			});
			$.getJSON('https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=' + gradeUrl + '&fields=id%2CruleGroups&strategy=mobile', function(data){
				if (data.id) {
					$("#mobile_psi_placeholder").html('Mobile PSI Score<span class="score">' + data.ruleGroups.SPEED.score + '</span>');
				} else {
					console.log('hmmmmm, Googles APIs are really painful, they did not grade for some reason');
				}
			});
		});
	},
	onLoad: function() {

		$('a.debugButton').click(function () {
			developerTools.debugReload($(this).attr('id'));
		});

		$('#psiScoreRequest').click(function () {
			$(".psiScore").css("display", "block");
			developerTools.getPsiData();
			$("#psiScoreRequest").addClass("graded"); 
		});

	}

};


window.onload = developerTools.onLoad();
