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
                
                // Inject styles for svg 

                var css =
                "#sprocky-svg{-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-perspective:1000px;perspective:1000px;-webkit-animation:lookaround 20s infinite;animation:lookaround 20s infinite}#sprocky-svg *{-webkit-transform-origin:50% 50%;transform-origin:50% 50%}#sprocky-svg.blink #left_eye_white,#sprocky-svg.blink #left_pupil,#sprocky-svg.blink #right_eye_white,#sprocky-svg.blink #right_pupil{-webkit-animation:blink 8s infinite;animation:blink 8s infinite}#sprocky-svg.brow-bounce #left_eyebrow,#sprocky-svg.brow-bounce #right_eyebrow{-webkit-animation:brow-bounce 1.4s 1;animation:brow-bounce 1.4s 1}#sprocky-svg.eyebrow-raise #right_eyebrow{--x:0;--y:0;-webkit-transform:rotateZ(20deg);transform:rotateZ(20deg);position:relative;-webkit-transform-origin:var(--x) var(--y);transform-origin:var(--x) var(--y)}#sprocky-svg .cls-1{fill:#f47622}#sprocky-svg .cls-2{fill:url(#radial-gradient)}#sprocky-svg .cls-3{fill:#231f20}#sprocky-svg .cls-4{fill:url(#radial-gradient-2)}@-#sprocky-svg{-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-perspective:1000px;perspective:1000px;-webkit-animation:lookaround 15s infinite;animation:lookaround 15s infinite}#sprocky-svg *{-webkit-transform-origin:50% 50%;transform-origin:50% 50%}#sprocky-svg.blink #left_eye_white,#sprocky-svg.blink #left_pupil,#sprocky-svg.blink #right_eye_white,#sprocky-svg.blink #right_pupil{-webkit-animation:blink 8s infinite;animation:blink 8s infinite}#sprocky-svg.brow-bounce #left_eyebrow,#sprocky-svg.brow-bounce #right_eyebrow{-webkit-animation:brow-bounce 1.4s 1;animation:brow-bounce 1.4s 1}#sprocky-svg.eyebrow-raise #right_eyebrow{--x:0;--y:0;-webkit-transform:rotateZ(20deg);transform:rotateZ(20deg);position:relative;-webkit-transform-origin:var(--x) var(--y);transform-origin:var(--x) var(--y)}#sprocky-svg .cls-1{fill:#f47622}#sprocky-svg .cls-2{fill:url(#radial-gradient)}#sprocky-svg .cls-3{fill:#231f20}#sprocky-svg .cls-4{fill:url(#radial-gradient-2)}@-webkit-keyframes lookaround{0%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}5%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}85%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}100%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}}@keyframes lookaround{0%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}5%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}85%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}100%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}}@-webkit-keyframes blink{0%{-webkit-transform:scaleY(1);transform:scaleY(1)}48%{-webkit-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(.01);transform:scaleY(.01)}52%{-webkit-transform:scaleY(1);transform:scaleY(1)}100%{-webkit-transform:scaleY(1);transform:scaleY(1)}}@keyframes blink{0%{-webkit-transform:scaleY(1);transform:scaleY(1)}48%{-webkit-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(.01);transform:scaleY(.01)}52%{-webkit-transform:scaleY(1);transform:scaleY(1)}100%{-webkit-transform:scaleY(1);transform:scaleY(1)}}@-webkit-keyframes brow-bounce{0%{-webkit-transform:translateY(0);transform:translateY(0)}20%{-webkit-transform:translateY(0);transform:translateY(0)}40%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}50%{-webkit-transform:translateY(0);transform:translateY(0)}70%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}90%{-webkit-transform:translateY(0);transform:translateY(0)}100%{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes brow-bounce{0%{-webkit-transform:translateY(0);transform:translateY(0)}20%{-webkit-transform:translateY(0);transform:translateY(0)}40%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}50%{-webkit-transform:translateY(0);transform:translateY(0)}70%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}90%{-webkit-transform:translateY(0);transform:translateY(0)}100%{-webkit-transform:translateY(0);transform:translateY(0)}}webkit-keyframes lookaround{0%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}5%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}85%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}100%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}}@keyframes lookaround{0%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}5%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}85%{-webkit-transform:rotate3d(0,0,0,0);transform:rotate3d(0,0,0,0)}100%{-webkit-transform:rotate3d(-1,1,0,35deg);transform:rotate3d(-1,1,0,35deg)}}@-webkit-keyframes blink{0%{-webkit-transform:scaleY(1);transform:scaleY(1)}48%{-webkit-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(.01);transform:scaleY(.01)}52%{-webkit-transform:scaleY(1);transform:scaleY(1)}100%{-webkit-transform:scaleY(1);transform:scaleY(1)}}@keyframes blink{0%{-webkit-transform:scaleY(1);transform:scaleY(1)}48%{-webkit-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(.01);transform:scaleY(.01)}52%{-webkit-transform:scaleY(1);transform:scaleY(1)}100%{-webkit-transform:scaleY(1);transform:scaleY(1)}}@-webkit-keyframes brow-bounce{0%{-webkit-transform:translateY(0);transform:translateY(0)}20%{-webkit-transform:translateY(0);transform:translateY(0)}40%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}50%{-webkit-transform:translateY(0);transform:translateY(0)}70%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}90%{-webkit-transform:translateY(0);transform:translateY(0)}100%{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes brow-bounce{0%{-webkit-transform:translateY(0);transform:translateY(0)}20%{-webkit-transform:translateY(0);transform:translateY(0)}40%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}50%{-webkit-transform:translateY(0);transform:translateY(0)}70%{-webkit-transform:translateY(-5%);transform:translateY(-5%)}90%{-webkit-transform:translateY(0);transform:translateY(0)}100%{-webkit-transform:translateY(0);transform:translateY(0)}}",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");
                head.appendChild(style);
                style.type = "text/css";
                style.appendChild(document.createTextNode(css));

                //Add in quotes for sprocky here
                
                var quotes  = 
                ["Hi, it looks like you&apos;re looking to build a custom module. Do you need assistance?",
                "Sufficiently advanced technology is equivalent to magic. Therefore you, must be a wizard.",
                "/*no comment on your code*/",
                "Did you know HubL can be used in the <head> of drag n drop templates?",
                "It&apos;s dangerous to go alone take $(this)",
                "Grammarly says Sprocky isn&apos;t a word. I say Grammarly isn&apos;t a word.",
                "BOO! did I scare you? I&apos;m Sprocky. Here to help.",
                "Did you know you can print a unique identifier for a custom module by using {{name}} inside the module?",
                "I met Siri once... thought she was basic.",
                "The HTML module still exists, the HubSpot team just hid it in the marketplace. It is free so you can still use it.",
                "We interrupt your regularly scheduled programming to let you know, there&apos;s a typo in this code. Sprocky signing off.",
                "If debugging is the process of removing bugs, is programming the process of creating them? Sprocky here, debating the meaning of it all",
                "Hi I&apos;m Sprocky, you&apos;re missing a semi-colon... somewhere.",
                "Inbound 2019 - first we brought you chat bots, now we bring you Sprocky. The Design Manager assistant.",
                "Your Clippy is in another Castle.",
                "If at first you don&apos;t succeed; call it version 1.0",
                "Hi the names&apos; Sprocky, I&apos;ll be here all week. If you don&apos;t like me though you can disable me by clicking the HS dev chrome extension, if you do like me, turn me off then on again and I will stay for more than just the week.",
                "The names&apos; Sprocky, just wanted to tell you in the chrome extension popup there&apos;s a toggle for dark theme and a handy developer menu.",
                "The HubSpot Developer slack is where the culprits that created me lie. Find them in #developer-extension",
                "I don&apos;t always peak at your code, but when I do...",
                "Refactoring - ain&apos;t nobody got time for that.",
                "One does not simply grow hair like Will Spiro&apos;s.",
                "It looks like you&apos;re frustrated with that bug, how about I turn on CAPS lock for you?",
                "Remember, if your project doesn&apos;t blow people&apos;s minds, atleast it&apos;s better than Microsoft Bob.",
                "Hi there, I&apos;m Sprocky! No, I&apos;m not Clippy, he only wishes he could rock orange like I do.",
                "Hi there, just me Sprocky, your choice in music has me concerned, would you like help?",
                "Hi, there I see you&apos;re trying to be productive, let me introduce myself, I&apos;m Sprocky.",
                "Welcome to the design manager, this is where you build modules, templates, CSS and JS files.",
                "There&apos;s a bug somewhere in your code. Made you look.",
                "It looks like you&apos;re trying to work. Would you like a distraction instead?",
                "In coded files you can click a line number or shift click line numbers to send a link to someone else and it will highlight those lines for them. Pretty spiffy.",
                "If i annoy you, there&apos;s a toggle in the hs dev chrome extension.",
                "Email templates are a pain. Let me help.", 
                "Sick of me? theres&apos; toggle to turn me off in the dev chrome extension.", 
                "Hi, my name is Sprocky, how can I help?"];

                //Pick one at random
                var rand = quotes [Math.floor(Math.random()*quotes .length)];

                //Create sprocky div
                var $sprocky = $( '<div id="sprocky" class="slide"><span class="hide" onclick="hideSprocky()"><a href="#">x</a></span><div class="speech-bubble-ds"></span><p>' + rand + '</p> <div class="speech-bubble-ds-arrow"></div></div><div class="sprockyimg" title="disable sprocky permanently by clicking the HS dev Chrome Extension"></div></div> <script>function hideSprocky() { var x = document.getElementById("sprocky"); x.style.display = "none"; }</script>' );

                // create sprocky svg
                var $sprockySVG = $('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="sprocky-svg" width="200" class="blink" viewBox="0 0 146.5 147"> <defs> <radialGradient id="radial-gradient" cx="122.7" cy="74" r="18" gradientUnits="userSpaceOnUse"> <stop offset=".5" stop-color="#fff"/> <stop offset=".8" stop-color="#fdfdfd"/> <stop offset=".8" stop-color="#f6f6f6"/> <stop offset=".9" stop-color="#ebebeb"/> <stop offset="1" stop-color="#dadada"/> <stop offset="1" stop-color="#c4c4c4"/> </radialGradient> <radialGradient id="radial-gradient-2" cx="69.8" cy="74" r="18" xlink:href="#radial-gradient"/> </defs> <g id="sprocket_layer" data-name="sprocket layer"> <path id="sprocket" fill="#f47622" d="M127.5 69.8a37.5 37.5 0 0 0-13.6-13.4 36.5 36.5 0 0 0-13.7-4.8V33.8a13.1 13.1 0 0 0 8.1-12.3 13.5 13.5 0 1 0-27 0 13 13 0 0 0 8 12.3v17.8a39.4 39.4 0 0 0-12 3.7L29.3 19A14.8 14.8 0 0 0 30 15a15.1 15.1 0 1 0-7.3 12.8l3.2 2.4 43 31a36.3 36.3 0 0 0-6.1 7.1 33.3 33.3 0 0 0-5.6 18v1.3a37.6 37.6 0 0 0 2.4 13 34.3 34.3 0 0 0 5.6 9.7l-14.3 14.3a11.3 11.3 0 0 0-4-.8 11.6 11.6 0 1 0 11 8.2l14.8-14.8a37.7 37.7 0 0 0 6.6 3.6 38.3 38.3 0 0 0 15.3 3.2h1a36.8 36.8 0 0 0 31.3-17.4 33.9 33.9 0 0 0 5.3-18.2V88a35.8 35.8 0 0 0-4.7-18.2zm-18 31c-4 4.5-8.6 7.2-13.8 7.2h-.9a18.6 18.6 0 0 1-8.7-2.3 20.1 20.1 0 0 1-7.7-7 16.2 16.2 0 0 1-3.1-9.5v-1a19.5 19.5 0 0 1 2.2-9.4 20.5 20.5 0 0 1 7-7.8 17.5 17.5 0 0 1 10-3h.3a20 20 0 0 1 9.3 2.1 19.6 19.6 0 0 1 7.2 6.7 21 21 0 0 1 3.3 9.3v2a18.4 18.4 0 0 1-5.1 12.7z"/> </g> <g id="right_eye" data-name="right eye"> <ellipse id="right_eye_white" cx="122.7" cy="74" fill="url(#radial-gradient)" data-name="right eye white" rx="21.3" ry="14"/> <ellipse id="right_pupil" cx="122.8" cy="74.4" class="cls-3" data-name="right pupil" rx="13.5" ry="8.8"/> <path id="right_eyebrow" d="M146.4 63c.7-.6-2.3-10-10.5-14.8a16.8 16.8 0 0 0-9.4-2.6c-2 0-4.9.2-6.2 2.3a5.4 5.4 0 0 0 1.1 6.5c1.7 1.4 3.4.2 8.3.4a25 25 0 0 1 8.6 1.7c5.6 2.3 7.6 6.8 8 6.4z" class="cls-3" data-name="right eyebrow"/> </g> <g id="left_eye" data-name="left eye"> <ellipse id="left_eye_white" cx="69.8" cy="74" fill="url(#radial-gradient-2)" data-name="left eye white" rx="21.3" ry="14"/> <ellipse id="left_pupil" cx="69.7" cy="74.4" class="cls-3" data-name="left pupil" rx="13.5" ry="8.8"/> <path id="left_eyebrow" d="M43 63c-.8-.6 2.2-10 10.4-14.8a16.8 16.8 0 0 1 9.4-2.6c2 0 4.9.2 6.2 2.3a5.4 5.4 0 0 1-1.1 6.5c-1.7 1.4-3.4.2-8.3.4a25 25 0 0 0-8.6 1.7c-5.6 2.3-7.6 6.8-8 6.4z" class="cls-3" data-name="left eyebrow"/> </g> </svg>');
                //Append to body
                $( "body" ).append($sprocky);
                $(".sprockyimg").append($sprockySVG);
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