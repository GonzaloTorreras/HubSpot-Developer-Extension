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
var developerTools = {


debugReload: function(debugParam) {

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tabUrl = new URL(tabs[0].url);
    var params = new URLSearchParams(tabUrl.search);

    _gaq.push(['_trackEvent', debugParam, 'clicked']);

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

},
getPsiData: function() {
chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
    var pageUrl = new URL(tabs[0].url);
    var gradeUrl = pageUrl.origin.replace("://", "%3A%2F%2F") + pageUrl.pathname;
    _gaq.push(['_trackEvent', 'googlePageSpeed', 'clicked']);
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
    if (~tabUrl.indexOf("app.hubspot.com")) {
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
saveSettings: function() {
// Saves settings to chrome.storage

console.log("settings saved");
var darkthemeVal = $("#darktheme").prop("checked");
var uiTweaksVal = $("#uiTweaks").prop("checked");
var overwriteVal = $("#overwrite").prop("checked");

console.log("dark theme is ", darkthemeVal);
console.log("UI Tweaks is ", uiTweaksVal);
console.log("overwriteVal is ", overwriteVal);
console.log("all settings:")
chrome.storage.sync.get(null, function(items) {
    console.log(items);
});
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
chrome.storage.sync.set({
    overwrite: overwriteVal,
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
        console.log("toggling darktheme switched on")
        $(".dark-theme-toggle .uiToggleSwitch").addClass("uiToggleSwitchOn private-form__toggle-switch--on");
    }
    else{
        console.log("toggling darktheme switched off")
        $(".dark-theme-toggle .uiToggleSwitch").removeClass("uiToggleSwitchOn private-form__toggle-switch--on");
    }
});
chrome.storage.sync.get(["uitweaks"], function(items) {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    document.getElementById("uiTweaks").checked = items.uitweaks;
    console.log("UI Tweaks:", items.uitweaks);
    if (items.uitweaks) {
        console.log("toggling uitweaks switced on")
        $(".ui-tweaks-toggle .uiToggleSwitch").addClass("uiToggleSwitchOn private-form__toggle-switch--on");
    }
    else{
        console.log("toggling uitweaks switched off")
        $(".ui-tweaks-toggle .uiToggleSwitch").removeClass("uiToggleSwitchOn private-form__toggle-switch--on");
    }
});
chrome.storage.sync.get(["overwrite"], function(items) {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    document.getElementById("overwrite").checked = items.overwrite;
    console.log("overwrite:", items.overwrite);
    if (items.overwrite) {
        console.log("toggling overwrite switched on")
        $(".overwrite-toggle .uiToggleSwitch").addClass("uiToggleSwitchOn private-form__toggle-switch--on");
    }
    else{
        console.log("toggling overwrite switched off")
        $(".overwrite-toggle .uiToggleSwitch").removeClass("uiToggleSwitchOn private-form__toggle-switch--on");
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
    developerTools.getSettings();
});
$(".ui-tweaks-toggle input").change(function() {

    developerTools.saveSettings();
    developerTools.getSettings();
    
});
$(".overwrite-toggle input").change(function() {

    
        

        //if permission has already been granted
            //if user is turning off the setting.
            //if user is turning on the setting.
        //if permission is not granted
            //if user is turning on the setting request the permission


    //check for permission
     chrome.permissions.contains({
        permissions: ['tabs']
      }, function(hasPermission) {
        if (hasPermission) {
            // The extension has the permissions. Regardless of stored setting save the new setting and get settings.
            developerTools.saveSettings();
            developerTools.getSettings();

        } else {
          // The extension doesn't have the permissions.
            chrome.permissions.request({
                permissions: ['tabs']
                //origins: ['https://app.hubspot.com/*']
            }, function(granted) {
                // The callback argument will be true if the user granted the permissions.
                if (granted) {
                   developerTools.saveSettings();
                   developerTools.getSettings();
                   
                   console.log("Permission granted.")
                } else {
                    console.log("Permission not Granted.")
                    developerTools.getSettings();
                }
            }); 
        }
      });



/*
    if ($("#overwrite").val()){//if already enabled
        
        developerTools.saveSettings();
        developerTools.getSettings();
        console.log("overwrite turned off permission not removed.");
    }
    else{
        chrome.permissions.request({
            permissions: ['tabs']
            //origins: ['https://app.hubspot.com/*']
        }, function(granted) {
            // The callback argument will be true if the user granted the permissions.
            if (granted) {
               developerTools.saveSettings();
               developerTools.getSettings();
               
               console.log("Permission granted.")
            } else {
                console.log("Permission not Granted.")
                $("#overwrite").val(false)
            }
        });
    }
    */
    
    
});


}

};


window.onload = developerTools.onLoad();