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

    // A fun April fools joke, shows 'Sprocky'
    function sprocky() {
        chrome.storage.sync.get(['sprocky'], function(result) {

            //Check if undefined(users hasn't loaded it yet), then turn it on by default
            if (result.sprocky == undefined) {
                chrome.storage.sync.set({
                    sprocky: true,
                });
            }
            //Check if sprocky is enabled
            if (result.sprocky || result.sprocky == undefined) {
                //Add in quotes for sprocky here
                var quotes  = 
                ["Hi, it looks like you're looking to build a custom module. Do you need assistance?",
                "Sufficiently advanced technology is equivalent to magic. Therefore you, must be a wizard.",
                "/*no comment on your code*/",
                "It�s dangerous to go alone take $(this)",
                "Grammarly says Sprocky isn't a word. I say Grammarly isn't a word.",
                "BOO! did I scare you? I'm Sprocky. Here to help.",
                "We interrupt your regularly scheduled programming to let you know, there�s a typo in this code. Sprocky signing off.",
                "If debugging is the process of removing bugs, is programming the process of creating them? Sprocky here, debating the meaning of it all",
                "Hi I�m Sprocky, you�re missing a semi-colon somewhere.",
                "Always code as if Hannibal Lector will be inheriting it from you, and will know where you live.",
                "Inbound 2019 - first we brought you chat bots, now we bring you Sprocky",
                "Your Clippy is in another Castle.",
                "If at first you don�t succeed; call it version 1.0",
                "Hi the names' Sprocky, I'll be here all week.",
                "The names' Sprocky, just wanted to tell you in the chrome extension popup there's a toggle for dark theme and a handy developer menu.",
                "The HubSpot Developer slack is where the culprits that created me lie. Find them in #developer-extension",
                "I don't always peak at your code, but when I do...",
                "Refactoring - ain't nobody got time for that.",
                "One does not simply grow hair like Will Spiro's.",
                "It looks like you're frustrated with that bug, how about I turn CAPS lock for you?",
                "Remember, if your project doesn't blow people's minds, atleast it's better than Microsoft Bob.",
                "Hi there, just me Sprocky, your choice in music has me concerned, would you like help?",
                "Hi, there I see you're trying to be productive, let me introduce myself, I'm Sprocky.",
                "Welcome to the design manager, this is where you build modules, templates, CSS and JS files.",
                "There's a bug somewhere in your code. Made you look.",
                "It looks like you're trying to work. Would you like a distraction instead?",
                "If i annoy you, there's a toggle in the hs dev chrome extension.",
                "Email templates are a pain. Let me help.", 
                "Sick of me? theres toggle to turn me off in the dev chrome extension.", 
                "Hi, my name is Sprocky, how can I help?"];

                //Pick one at random
                var rand = quotes [Math.floor(Math.random()*quotes .length)];

                //Create sprocky div
                var $sprocky = $( '<div id="sprocky" class="slide"><span class="hide" onclick="hideSprocky()"><a href="#">x</a></span><div class="speech-bubble-ds"></span><p>' + rand + '</p> <div class="speech-bubble-ds-arrow"></div></div><div class="sprockyimg" title="disable sprocky permanently by clicking the HS dev Chrome Extension"><img src="https://cdn2.hubspot.net/hubfs/4910474/sprocky.png" alt="Sprocky"></div></div> <script>function hideSprocky() { var x = document.getElementById("sprocky"); x.style.display = "none"; }</script>' );
    
                //Append to body
                $( "body" ).append($sprocky);
            }
        });
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

            // Show Sprocky
            sprocky();
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