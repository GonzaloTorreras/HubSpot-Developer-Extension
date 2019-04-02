
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
                tipId:"VSCode Extension",
                title:"Use VSCode?",
                content:"Did you know about the HubL Language Extension?",
                url:"https://marketplace.visualstudio.com/items?itemName=WilliamSpiro.hubl#overview",
            },
            {
                tipId:"ext Slack Channel",
                title:"#developer-extension",
                content:"We have a channel in the official HS Dev Slack, share feedback there or on github Issues",
                url:"https://hubspotdev.slack.com/messages/CBBAW6Z3R",
            },
            {
                tipId:"hubXml",
                title:"hubXml",
                content:"You can turn any blog into a HubSpot importable XML file with this open source tool",
                url:"https://github.com/williamspiro/hubXml",
            },
            {
                tipId:"resize_image_url",
                title:'{{ resize_image_url() }}',
                content:"You can use HubL to resize images dynamically. Saving marketers from themselves. Do it.",
                url:"https://designers.hubspot.com/en/docs/hubl/hubl-supported-functions#resize-image-url",
            },
            {
                tipId:"Discovery Kit",
                title:'HS Discovery Kit',
                content:"New to devloping on HubSpot? get all the best tools, docs and resources in the kit!",
                url:"https://designers.hubspot.com/discoverykit",
            },
            {
                tipId:"Hub-Batch",
                title:'Hub-Batch',
                content:"A library that utilizes HubSpot APIs for bulk updating COS content (Blog Posts and Site Pages)",
                url:"https://github.com/williamspiro/hub-batch",
            },
            {
                tipId:"CrankShaft",
                title:'CrankShaft',
                content:"Help create a framework like Timber or Bootstrap, specifically tailored to HubSpot",
                url:"https://github.com/TheWebTech/CrankShaft",
            },
            {
                tipId:"feature breakdown",
                title:'Feature Breakdown',
                content:"This extension has a lot of features that might be obscure, let us break it down for you, it'll only take 2 minutes.",
                url:"https://github.com/williamspiro/HubSpot-Developer-Extension/wiki/Feature-Breakdown",
            },
            {
                tipId:"DYK FTP",
                title:'Did you know HubSpot supports FTP?',
                content:"Access/edit templates, modules, and file manager assets with your favorite FTP client",
                url:"https://designers.hubspot.com/docs/tools/hubspot-ftp",
            },
            {
                tipId:"local dev",
                title:'Used to Local Development?',
                content:"Now with HubSpot's local server + FTP, it's possible, provide your feedback on it in the Developer Slack.",
                url:"https://designers.hubspot.com/docs/tools/using-local-hubl-server-with-ftp",
            },
            {
                tipId:"HS Dev Slack",
                title:'HubSpot Developer Slack',
                content:"The HubSpot Developer Slack is an invaluable resource, keep up with the top HS devs, they hang out there.",
                url:"https://designers.hubspot.com/slack",
            },
            {
                tipId:"ext Privacy Policy",
                title:'Privacy Policy',
                content:"Simply put - we don't collect personally identifiable or confidential info, just basic anonymized usage stats, learn more",
                url:"https://github.com/williamspiro/HubSpot-Developer-Extension/wiki/Privacy-Policy",
            },
            {
                tipId:"ext Updates",
                title:'Updates',
                content:"We post our updates to both the beta and stable build of the extension as a release on our GitHub, check it out to learn about new features.",
                url:"https://github.com/williamspiro/HubSpot-Developer-Extension/releases",
            },
            {
                tipId:"design cert expire",
                title:'The Design Cert. has been sunsetted',
                content:"The design cert. is no longer useful. Instead a new developer certification will be coming soon. ",
                url:"https://designers.hubspot.com/blog/were-sunsetting-the-hubspot-design-certification-heres-why",
            },
            {
                tipId:"ext rate and review",
                title:'Like the extension? consider rating/reviewing',
                content:"Ratings and reviews increase visibility of the extension, more visibility means more contributors, which means faster rollout of new features.",
                url:"https://chrome.google.com/webstore/detail/hubspot-developer-extensi/gebemkdecnlgbcanplbgdpcffpdnfdfo",
            },
            {
                tipId:"ext Kbd shortcuts",
                title:'Keyboard Shortcuts',
                content:"There are Keyboard Shortcuts for the cache buster and Debug functions",
                url:"https://github.com/williamspiro/HubSpot-Developer-Extension/wiki/How-to-Use-and-set-up-Keyboard-Shortcuts",
            },
            {
                tipId:"devtoolschtsheet post",
                title:'Dev Tools Cheat Sheet',
                content:"In the HS developer forum developers like you have been compiling a cheatsheet of all their best tools that they use for HubSpot development.",
                url:"https://community.hubspot.com/t5/Share-Your-Work/Developers-Tools-Cheat-Sheet/m-p/207945/highlight/true#M258",
            },
            {
                tipId:"cmsdevcert",
                title:'HubSpot CMS for Developers Certification',
                content:"Free HubSpot CMS course for developers. Become a certified HubSpot CMS developer to prove your expertise.",
                url:"https://app.hubspot.com/signup/standalone-cms-developer?hubs_signup-url=academy.hubspot.com/courses/cms-for-developers&amp;intent=learningCenter&amp;track=34",
            },
        ];
        var randomTip = [Math.floor(Math.random()*tips.length)];

        $(".c-banner").attr("data-tipId",tips[randomTip].tipId);
        $(".c-banner").attr("href",tips[randomTip].url);
        $(".c-banner .tip__title").text(tips[randomTip].title);
        $(".c-banner .tip__content").text(tips[randomTip].content);
    },
    saveSettings: function() {
        // Saves settings to chrome.storage

        console.log("settings saved");
        var darkthemeVal = $("#darktheme").prop("checked");
        var uiTweaksVal = $("#uiTweaks").prop("checked");
        var sprockyVal = $("#sprocky").prop("checked");

        console.log("dark theme is ", darkthemeVal);
        console.log("UI Tweaks is ", uiTweaksVal);
        console.log("Sprocky is ", sprockyVal);

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
            status.textContent = "Options saved. If you have the Design manager open, you will need to refresh to see the tweaks.";
            setTimeout(function() {
                status.textContent = "";
            }, 4000);
        });

        chrome.storage.sync.set({
            sprocky2: sprockyVal,
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById("status");
            status.textContent = "Option saved. If you have the Design manager open, you will need to refresh to see Sprocky.";
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
        chrome.storage.sync.get(["sprocky"], function(items) {
            // Restores select box and checkbox state using the preferences
            // stored in chrome.storage.
            document.getElementById("sprocky").checked = items.sprocky;
            console.log("sprocky:", items.sprocky);
            if (items.sprocky) {
                $(".sprocky-toggle .uiToggleSwitch").addClass("uiToggleSwitchOn private-form__toggle-switch--on");
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

        $(".sprocky-toggle input").change(function() {
            developerTools.saveSettings();
            $(".sprocky-toggle .uiToggleSwitch").toggleClass("uiToggleSwitchOn private-form__toggle-switch--on");
        });

        $("a.c-banner").click(function(e){
            var tipId = "tip:" + $(this).data("tipid");
            trackClick(tipId);
        })

    }

};


window.onload = developerTools.onLoad();
