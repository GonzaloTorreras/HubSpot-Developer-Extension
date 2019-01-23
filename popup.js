
/*Google Analytics*/
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-122315369-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
/*end google analytics*/
function trackClick(eventName){
    chrome.runtime.sendMessage({trackClick: eventName}, function(response) {
      console.log(response.farewell);
    });
}

var developerTools = {


    debugReload: function(debugParam) {

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var tabUrl = new URL(tabs[0].url);
            var params = new URLSearchParams(tabUrl.search);

            trackClick(debugParam);

            if (debugParam === "hsCacheBuster") {
                var randomNum = Math.floor(Math.random() * 9999) + 1;
                params.set("hsCacheBuster", randomNum);
            } else if (params.has(debugParam)) {
                params.delete(debugParam);
            } else {
                params.append(debugParam, "True");
            }

            chrome.tabs.update(tabs[0].id, { url: tabUrl.origin + tabUrl.pathname + '?' + params.toString() });
            window.close();

        });

    },
    getPsiData: function() {
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
            var pageUrl = new URL(tabs[0].url);
            var gradeUrl = pageUrl.origin.replace("://", "%3A%2F%2F") + pageUrl.pathname;
            trackClick("googlePageSpeed");
            
            $.getJSON('https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=' + gradeUrl + '&fields=id%2CruleGroups', function(data) {
                if (data.id) {
                    $("#desktop_psi_placeholder").html("Desktop PSI Score<span class='c-btn__score'>" + data.ruleGroups.SPEED.score + "</span>");
                } else {
                    console.log('hmmmmm, Googles APIs are really painful, they did not grade for some reason');
                }
            });
            $.getJSON("https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=" + gradeUrl + "&fields=id%2CruleGroups&strategy=mobile", function(data) {
                if (data.id) {
                    $("#mobile_psi_placeholder").html("Mobile PSI Score<span class='c-btn__score'>" + data.ruleGroups.SPEED.score + "</span>");
                } else {
                    console.log("hmmmmm, Googles APIs are really painful, they did not grade for some reason");
                }
            });
        });
    },
    setMenuContext: function() {
        console.log("Set Menu Context run");

        chrome.tabs.getSelected(null, function(tab) {
            /*getSelected might be deprecated need to review*/
            var tabUrl = tab.url;
            console.log("Current URL: ", tabUrl);
            const appUrl = ~tabUrl.indexOf("app.hubspotqa.com") ? "app.hubspotqa.com" : "app.hubspot.com";
            if (~tabUrl.indexOf(appUrl)) {
                console.log("This is the hubspot backend.");
                $("body").addClass("is-backend"); //indicates user is seeing HS backend
                $(".c-tab-slider").addClass('c-tab-slider--state-design-manager');
                if (~tabUrl.indexOf("/design-manager/")) {
                    console.log("Old Design Manager is active");
                    $("body").addClass("is-dm1"); //indicates user is seeing design manager v1
                }
                if (~tabUrl.indexOf("/beta-design-manager/")) {
                    /*note this string detection will likely break once rolled out to everyone as they likely wont leave beta in the name*/
                    console.log("Design Manager V2 is active");
                    $("body").addClass("is-dm2"); //indicates user is seeing design manager v2
                }

            } else if (~tabUrl.indexOf("designers.hubspot.com/docs/")) {
                console.log("Viewing HubSpot Documentation");
                $("body").addClass("is-hs-docs");
                $(".c-tab-slider").addClass("c-tab-slider--state-debug");
            } else {
                console.log("This is not in the HubSpot Backend");
                $(".c-tab-slider").addClass("c-tab-slider--state-debug");

            }


        });


    },
    loadTip:function(){
        var tips = [
            {
                title:"Use VSCode?",
                content:"Did you know about the HubL Language Extension?",
                url:"https://marketplace.visualstudio.com/items?itemName=WilliamSpiro.hubl#overview",
            },
            {
                title:"#developer-extension",
                content:"We have a channel in the official HS Dev Slack, share feedback there or on github Issues",
                url:"https://hubspotdev.slack.com/messages/CBBAW6Z3R",
            },
            {
                title:"hubXml",
                content:"You can turn any blog into a HubSpot importable XML file with this open source tool",
                url:"https://github.com/williamspiro/hubXml",
            },
            {
                title:'{{ resize_image_url() }}',
                content:"You can use HubL to resize images dynamically. Saving marketers from themselves. Do it.",
                url:"https://designers.hubspot.com/en/docs/hubl/hubl-supported-functions#resize-image-url",
            },
            {
                title:'HS Discovery Kit',
                content:"New to devloping on HubSpot? get all the best tools, docs and resources in the kit!",
                url:"https://designers.hubspot.com/discoverykit",
            },
            {
                title:'Hub-Batch',
                content:"A library that utilizes HubSpot APIs for bulk updating COS content (Blog Posts and Site Pages)",
                url:"https://github.com/williamspiro/hub-batch",
            },
            {
                title:'CrankShaft',
                content:"Help create a framework like Timber or Bootstrap, specifically tailored to HubSpot",
                url:"https://github.com/TheWebTech/CrankShaft",
            },
        ];
        var randomTip = [Math.floor(Math.random()*tips.length)];

        $(".c-banner").attr("href",tips[randomTip].url);
        $(".c-banner .tip__title").text(tips[randomTip].title);
        $(".c-banner .tip__content").text(tips[randomTip].content);
    },
    saveSettings: function() {
        // Saves settings to chrome.storage

        console.log("settings saved");
        var darkthemeVal = $("#darktheme").prop("checked");
        var uiTweaksVal = $("#uiTweaks").prop("checked");

        console.log("dark theme is ", darkthemeVal);
        console.log("UI Tweaks is ", uiTweaksVal);
        chrome.storage.sync.set({
            darktheme: darkthemeVal,
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById("status");
            status.textContent = "Options saved. If you have the Design manager open, you will need to refresh to see the theme.";
            setTimeout(function() {
                status.textContent = "";
            }, 4000);
        });

        chrome.storage.sync.set({
            uitweaks: uiTweaksVal,
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById("status");
            status.textContent = "Options saved. If you have the Design manager open, you will need to refresh to see the theme.";
            setTimeout(function() {
                status.textContent = "";
            }, 4000);
        });







    },
    getSettings: function() {
        chrome.storage.sync.get(["darktheme"], function(items) {
            // Restores select box and checkbox state using the preferences
            // stored in chrome.storage.
            document.getElementById("darktheme").checked = items.darktheme;
            console.log("dark theme:", items.darktheme);
            if (items.darktheme) {
                $(".dark-theme-toggle .uiToggleSwitch").addClass("uiToggleSwitchOn private-form__toggle-switch--on");
            }
        });
        chrome.storage.sync.get(["uitweaks"], function(items) {
            // Restores select box and checkbox state using the preferences
            // stored in chrome.storage.
            document.getElementById("uiTweaks").checked = items.uitweaks;
            console.log("dark theme:", items.uitweaks);
            if (items.uitweaks) {
                $(".ui-tweaks-toggle .uiToggleSwitch").addClass("uiToggleSwitchOn private-form__toggle-switch--on");
            }
        });

    },
    onLoad: function() {
        /* Temporary fix to the height bug in the popup. This should get removed soon. */
        window.setTimeout(() => {
            $("html, body").css({
                height: $(".c-tab-slider").outerHeight()
            });
        }, 100);
        /* end temporary bug fix */

        developerTools.setMenuContext();
        developerTools.getSettings();
        developerTools.loadTip();
        /*document.addEventListener('DOMContentLoaded', developerTools.getSettings());
		document.getElementById('save').addEventListener('click',
    developerTools.saveSettings());*/

        $(".js-click--debug,.js-click--move-jquery-to-footer,.js-click--bust-cache,.js-click--amp").click(function() {
            developerTools.debugReload($(this).attr("id"));
        });


        $(".js-click--psi-score-request").click(function() {
            $(".c-btn__psiScore").css("display", "block"); /*move to css?*/
            developerTools.getPsiData();
            $(".js-click--psi-score-request").addClass("c-btn--graded");
        });

        $(".js-click--tab-debug").click(function() {
            console.log("debug");
            $(".c-tab-slider").removeClass("c-tab-slider--state-design-manager");
            $(".c-tab-slider").addClass("c-tab-slider--state-debug");
        });
        $(".js-click--tab-develop").click(function() {
            console.log("develop");
            $(".c-tab-slider").removeClass("c-tab-slider--state-debug");
            $(".c-tab-slider").addClass("c-tab-slider--state-design-manager");
        });
        /*these settings could be combined into one function.*/
        $(".dark-theme-toggle input").change(function() {

            developerTools.saveSettings();
            $(".dark-theme-toggle .uiToggleSwitch").toggleClass("uiToggleSwitchOn private-form__toggle-switch--on");
        });
        $(".ui-tweaks-toggle input").change(function() {

            developerTools.saveSettings();
            $(".ui-tweaks-toggle .uiToggleSwitch").toggleClass("uiToggleSwitchOn private-form__toggle-switch--on");
        });


    }

};


window.onload = developerTools.onLoad();
