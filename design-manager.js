$(document).ready(function() {
    /*This script runs once the HubSpot Back-end loads.*/

    /*trackClick sends the click event to the background js which has google analytics set up, this prevents google analytics running on the page and means the extension can only track it's own events.*/
    function trackClick(eventName) { /*Analytics*/
        chrome.runtime.sendMessage({ trackClick: eventName }, function(response) {
            //console.log(response.farewell);
        });
    }
    var tabUrl = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
    /*getSelected might be deprecated need to review*/
    var currentScreen = "";
    var devMenu = false;

    var waitForEl = function(selector, callback) {
        /*Will poll for element only 10 times before stopping*/
        var timesPolled = 0;
        (function waiting() {
            if (timesPolled < 10) {
                if ($(selector).text().length) {
                    callback();
                } else {
                    setTimeout(function() {
                        timesPolled++;
                        waiting(selector, callback);
                    }, 100);
                }
            }
            /*Next steps - add error handling here when polling fails*/
        })();
    };

    function setTitle(siteName) {
        var portal = siteName.replace("www.", "");
        if (currentScreen === "design-manager") {
            //document.title = "🎨DM|"+portal+"|HS";
            document.title = "DM|" + portal + "|HS";
        } else if (currentScreen === "content-staging") {
            //document.title = "🎭CS|"+portal+"|HS";
            document.title = "CS|" + portal + "|HS";
        } else if (currentScreen === "dashboard") {
            //document.title = "📊Da|"+portal+"|HS";
            document.title = "Da|" + portal + "|HS";
        } else if (currentScreen === "website-pages") {
            //document.title = "📑WP|"+portal+"|HS";
            document.title = "WP|" + portal + "|HS";
        } else if (currentScreen === "landing-pages") {
            //document.title = "📄LP|"+portal+"|HS";
            document.title = "LP|" + portal + "|HS";
        } else if (currentScreen === "file-manager") {
            //document.title = "📝FM|"+portal+"|HS";
            document.title = "FM|" + portal + "|HS";
        } else if (currentScreen === "hubdb") {
            //document.title = "📦DB|"+portal+"|HS";
            document.title = "DB|" + portal + "|HS";
        } else if (currentScreen === "settings") {
            //document.title = "⚙︝Se|"+portal+"|HS";
            document.title = "Se|" + portal + "|HS";
        } else if (currentScreen === "navigation-settings") {
            //document.title = "🗺︝Na|"+portal+"|HS";
            document.title = "Na|" + portal + "|HS";
        } else if (currentScreen === "blog") {
            //document.title = "📰Bl|"+portal+"|HS";
            document.title = "Bl|" + portal + "|HS";
        } else if (currentScreen === "url-mappings") {
            //document.title = "🔀UM|"+portal+"|HS";
            document.title = "UM|" + portal + "|HS";
        }
    }
    //console.log("Current URL: ",tabUrl);
    const appUrl = ~tabUrl.indexOf("app.hubspotqa.com") ? "app.hubspotqa.com" : "app.hubspot.com";
    if (~tabUrl.indexOf(appUrl)) {
        //console.log("This is the hubspot backend.");
        chrome.storage.sync.get([
            'uitweaks'
        ], function(items) {
            if (items.uitweaks) {
                $("html").addClass("ext-ui-tweaks");
            }
        });
        //console.log("DevMenu:", devMenu);
        if (~tabUrl.indexOf("/design-manager/")) {
            console.log("Design Manager is active");
            currentScreen = "design-manager";
            chrome.storage.sync.get([
                "darktheme"
            ], function(items) {
                if (items.darktheme) {
                    $("body").addClass("ext-dark-theme");
                }
            });
        }
        if (~tabUrl.indexOf("/staging/")) {
            currentScreen = "content-staging";
        }
        if (~tabUrl.indexOf("/reports-dashboard/")) {
            currentScreen = "dashboard";
        }
        if (~tabUrl.indexOf("/pages/")) {
            if (~tabUrl.indexOf("/site/")) {
                currentScreen = "website-pages";
            } else if (~tabUrl.indexOf("/landing/")) {
                currentScreen = "landing-pages";
            }
        }
        if (~tabUrl.indexOf("/file-manager-beta/")) {
            currentScreen = "file-manager";
        }
        if (~tabUrl.indexOf("/hubdb/")) {
            currentScreen = "hubdb";
        }
        if (~tabUrl.indexOf("/settings/")) {
            currentScreen = "settings";
            if (~tabUrl.indexOf("/navigation")) {
                currentScreen = "navigation-settings";
            }
        }
        if (~tabUrl.indexOf("/blog/")) {
            currentScreen = "blog";
        }
        if (~tabUrl.indexOf("/url-mappings")) {
            currentScreen = "url-mappings";
        }
        chrome.storage.sync.get([
            'uitweaks'
        ], function(items) {
            if (items.uitweaks) {
                if (currentScreen == "design-manager") {

                    waitForEl(".account-name", function() {
                        setTitle($(".account-name").text());
                    });
                }

                function generateDevMenuItem(buttonLabel, hubId, url) {
                    /*expects button label string, hubId string, url string.*/
                    var link = url.replace("_HUB_ID_", hubId);
                    var html = "<li role='none'>";
                    html += "<a role='menuitem' data-tracking='click hover' id='nav-secondary-design-tools-beta' class='navSecondaryLink' href='" + link + "' >";
                    html += buttonLabel;
                    html += "</a>";
                    html += "</li>";
                    return html;
                    //console.log("Nav Item Generated: ", buttonLabel);
                }

                function generateAllMenuItems(hubId) {
                    var html = generateDevMenuItem("Design Manager", hubId, "https://app.hubspot.com/design-manager/_HUB_ID_");
                    html += generateDevMenuItem("HubDB", hubId, "https://app.hubspot.com/hubdb/_HUB_ID_");
                    html += generateDevMenuItem("File Manager", hubId, "https://app.hubspot.com/file-manager-beta/_HUB_ID_");
                    html += generateDevMenuItem("Content Staging", hubId, "https://app.hubspot.com/content/_HUB_ID_/staging/");
                    html += generateDevMenuItem("Advanced Menus", hubId, "https://app.hubspot.com/settings/_HUB_ID_/website/pages/all-domains/navigation");
                    html += generateDevMenuItem("Content Settings", hubId, "https://app.hubspot.com/settings/_HUB_ID_/website/pages/all-domains/page-templates");
                    html += generateDevMenuItem("URL Mappings", hubId, "https://app.hubspot.com/content/_HUB_ID_/settings/url-mappings");
                    html += generateDevMenuItem("Marketplace", hubId, "https://app.hubspot.com/marketplace/_HUB_ID_/products");
                    return html;
                }

                function generateAppUrl(path) {
                    return "https://" + appUrl + path;
                }

                function generateDevMenu(hubId) {
                    var html = '<li id="ext-dev-menu-wrapper" role="none" class="expandable ">';
                    html += '<a href="#" id="nav-primary-dev-branch" aria-haspopup="true" aria-expanded="false" class="primary-link" data-tracking="click hover" role-menu="menuitem">';
                    html += 'Developer ';
                    html += '<svg style="max-height:4px;max-width:10px;" class="nav-icon arrow-down-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 13"><g><g><path d="M21.47,0.41L12,9.43l-9.47-9A1.5,1.5,0,1,0,.47,2.59l10.5,10,0,0a1.51,1.51,0,0,0,.44.28h0a1.43,1.43,0,0,0,1,0h0A1.52,1.52,0,0,0,13,12.61l0,0,10.5-10A1.5,1.5,0,1,0,21.47.41" transform="translate(0 0)"></path></g></g></svg>';
                    html += '</a>';
                    html += '<div id="ext-dev-menu" aria-label="Developer" role="menu" class="secondary-nav expansion" style="min-height: 0px">';
                    html += '<ul role="none">';
                    html += generateAllMenuItems(hubId);
                    html += '</ul>';
                    html += '</div>';
                    html += '</li>';

                    $("#ext-dev-menu-wrapper > a").click(function(e) {
                        e.preventDefault();
                        //console.log("dev menu clicked!");
                        /*$("#ext-dev-menu").toggleClass("expansion");*/

                        //$("#ext-dev-menu").toggle();

                        var isExpanded = $(this).attr("aria-expanded");

                        if (isExpanded === "true") {
                            $(this).attr("aria-expanded", "false");
                            trackClick("devMenu-Closed");
                        } else {
                            $(this).attr("aria-expanded", "true");
                            trackClick("devMenu-Opened");
                        }
                        $(this).parent("li").toggleClass("active");
                    });

                    $("#ext-dev-menu .navSecondaryLink, #ext-dev-menu .devMenuLink").click(function() {
                        console.log("track click");
                        var linkName = "devMenu:" + $(this).data("ext-track");
                        console.log(linkName);
                        trackClick(linkName);
                    });

                    $(".nav-links ul.primary-links>li:first-child").after(html);

                    $("#ext-dev-menu-wrapper > a").click(function(e) {
                        e.preventDefault();
                        //console.log("dev menu clicked!");
                        /*$("#ext-dev-menu").toggleClass("expansion");*/

                        //$("#ext-dev-menu").toggle();

                        var isExpanded = $(this).attr('aria-expanded');

                        if (isExpanded === "true") {
                            $(this).attr("aria-expanded", "false");
                        } else {
                            $(this).attr("aria-expanded", "true");
                        }
                        $(this).parent("li").toggleClass("active");
                    });
                }

                /*get current HubSpot ID*/
                var hubId;
                waitForEl("#nav-primary-home", function() {
                    hubId = $("#nav-primary-home").attr("href").replace(generateAppUrl("/reports-dashboard/"), "").replace("/home", "");
                    /*inject dev menu*/
                    generateDevMenu(hubId);
                });
            }

        });
    } else if (~tabUrl.indexOf("designers.hubspot.com/docs/")) {
        //console.log("Viewing HubSpot Documentation");
        currentScreen = "docs";
    } else {
        //console.log("This is not in the HubSpot Backend");
    }
});