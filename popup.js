
var developerTools = {

	debugReload: function(debugParam) {

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var tabUrl = new URL(tabs[0].url);
			var params = new URLSearchParams(tabUrl.search);

			if (debugParam == "cacheBuster") {
				var randomNum = Math.floor(Math.random() * 9999) + 1;
				params.set("cacheBuster",randomNum);
			} else if (params.has(debugParam)) {
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
					$("#desktop_psi_placeholder").html('Desktop PSI Score<span class="c-btn__score">' + data.ruleGroups.SPEED.score + '</span>');
				} else {
					console.log('hmmmmm, Googles APIs are really painful, they did not grade for some reason');
				}
			});
			$.getJSON('https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=' + gradeUrl + '&fields=id%2CruleGroups&strategy=mobile', function(data){
				if (data.id) {
					$("#mobile_psi_placeholder").html('Mobile PSI Score<span class="c-btn__score">' + data.ruleGroups.SPEED.score + '</span>');
				} else {
					console.log('hmmmmm, Googles APIs are really painful, they did not grade for some reason');
				}
			});
		});
	},
	setMenuContext:function(){
		console.log("Set Menu Context run");
		
		chrome.tabs.getSelected(null, function(tab) {
			/*getSelected might be deprecated need to review*/
			var tabUrl = tab.url;
			console.log("Current URL: ",tabUrl);
			if(~tabUrl.indexOf("app.hubspot.com")){
				console.log("This is the hubspot backend.");
				$('body').addClass("is-backend"); //indicates user is seeing HS backend
				if(~tabUrl.indexOf("/design-manager/")){
					console.log("Old Design Manager is active");
					$('body').addClass("is-dm1");//indicates user is seeing design manager v1
				}
				if(~tabUrl.indexOf("/beta-design-manager/")){
					/*note this string detection will likely break once rolled out to everyone as they likely wont leave beta in the name*/
					console.log("Design Manager V2 is active");
					$('body').addClass("is-dm2");//indicates user is seeing design manager v2
				}
				
			}
			else if(~tabUrl.indexOf("designers.hubspot.com/docs/")){
				console.log("Viewing HubSpot Documentation");
				$('body').addClass("is-hs-docs");
			}
			else{
				console.log("This is not in the HubSpot Backend");

			}
			

		});
		
		
	},
	onLoad: function() {
		developerTools.setMenuContext();

		$('.js-click--debug,.js-click--move-jquery-to-footer,.js-click--bust-cache').click(function () {
			developerTools.debugReload($(this).attr('id'));
		});
		

		$('.js-click--psi-score-request').click(function () {
			$(".c-btn__psiScore").css("display", "block");/*move to css?*/
			developerTools.getPsiData();
			$(".js-click--psi-score-request").addClass("c-btn--graded"); 
		});
		

	}

};


window.onload = developerTools.onLoad();
