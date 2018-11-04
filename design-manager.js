$(document).ready(function() {
    /*This script runs once the design manager page loads.*/

    function trackClick(eventName){/*Analytics*/
        chrome.runtime.sendMessage({trackClick: eventName}, function(response) {
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
        
        (function waiting(){
          if (timesPolled < 10){
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

    function setTitle(siteName){
        var portal = siteName.replace("www.","");
        if(currentScreen === "design-manager"){
            document.title = "🎨DM|"+portal+"|HS";
        }
        else if(currentScreen === "content-staging"){
            document.title = "🎭CS|"+portal+"|HS";
        }
        else if(currentScreen === "dashboard"){
            document.title = "📊Da|"+portal+"|HS";
        }
        else if(currentScreen === "website-pages"){
            document.title = "📑WP|"+portal+"|HS";
        }
        else if(currentScreen === "landing-pages"){
            document.title = "📄LP|"+portal+"|HS";
        }
        else if(currentScreen === "file-manager"){
            document.title = "📁FM|"+portal+"|HS";
        }
        else if(currentScreen === "hubdb"){
            document.title = "📦DB|"+portal+"|HS";
        }
        else if(currentScreen === "settings"){
            document.title = "⚙️Se|"+portal+"|HS";
        }
        else if(currentScreen === "navigation-settings"){
            document.title = "🗺️Na|"+portal+"|HS";
        }
        else if(currentScreen === "blog"){
            document.title = "📰Bl|"+portal+"|HS";
        }
        else if(currentScreen === "url-mappings"){
            document.title = "🔀UM|"+portal+"|HS";   
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
        console.log("DevMenu:", devMenu);
        if (~tabUrl.indexOf("/design-manager/")) {
            //console.log("Old Design Manager is active");
            currentScreen = 'design-manager';

        }
        if (~tabUrl.indexOf("/beta-design-manager/")) {
            /*note this string detection will likely break once rolled out to everyone as they likely wont leave beta in the name*/
            //console.log("Design Manager V2 is active");
            currentScreen = 'design-manager';
            chrome.storage.sync.get([
                "darktheme"
            ], function(items) {
                if (items.darktheme) {
                    $("body").addClass("ext-dark-theme");
                }
            });
        }
        if (~tabUrl.indexOf("/staging/")) {
            currentScreen = 'content-staging';
        }
        if (~tabUrl.indexOf("/reports-dashboard/")) {
            currentScreen = 'dashboard';
        }
        if(~tabUrl.indexOf("/pages/")){
            if(~tabUrl.indexOf("/site/")){
                currentScreen = "website-pages";
            }
            else if(~tabUrl.indexOf("/landing/")){
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
            currentScreen = 'settings';
            if (~tabUrl.indexOf("/navigation")) {
                currentScreen = "navigation-settings";
            }
        }
        if(~tabUrl.indexOf("/blog/")){
           currentScreen = "blog"; 
        }
        if(~tabUrl.indexOf("/url-mappings")){
           currentScreen = "url-mappings"; 
        }
        



        chrome.storage.sync.get([
            'uitweaks'
        ], function(items) {
            if (items.uitweaks) {
                /*detect HS nav bar version*/
                var navVersion;
                if ($("#hs-nav-v3").length) {
                    console.log("Nav V3 detected.");
                    navVersion = 3;
                } else if ($("#hs-nav-v4").length) {
                    console.log("Nav V4 detected.");
                  
                    navVersion = 4;
                }
                if(navVersion === 3){
                    waitForEl(".nav-domain", function() {
                        setTitle($(".nav-domain").text());
                    });

                }else if(navVersion === 4){
                    waitForEl(".account-name", function() {
                        setTitle($(".account-name").text());
                    });
                }

                function generateDevMenuItem(version, buttonLabel, hubId, url) {
                    /*expects version to be integer, button label string, hubId string, url string.*/
                    var link = url.replace("_HUB_ID_", hubId);
                    if (version === 3) {
                        var html = "";
                        html += "<li id='nav-dropdown-item-leads' data-mainitemid='" + buttonLabel + "' class='nav-dropdown-item'>";
                        html += "<a data-appkey='" + buttonLabel + "' href='" + link + "' data-ext-track='"+buttonLabel.trim()+"' class='devMenuLink'>";
                        html += "<span class='child-link-text link-text-after-parent-item-contacts'>";
                        html += buttonLabel;
                        html += "</span>";
                        html += "</a>";
                        html += "</li>";
                        return html;

                    } else if (version === 4) {
                        var html = "";
                        html += "<li role='none'>";
                        html += "<a role='menuitem' data-tracking='click hover' id='nav-secondary-design-tools-beta' data-ext-track='"+buttonLabel.trim()+"' class='navSecondaryLink' href='" + link + "' >";
                        html += buttonLabel;
                        html += "</a>";
                        html += "</li>";
                        return html;


                    }
                    //console.log("Nav Item Generated: ", buttonLabel);

                }
                function generateAllMenuItems(version, hubId){
                    var html = '';
                    html += generateDevMenuItem(version, 'Design Manager', hubId, 'https://app.hubspot.com/design-manager/_HUB_ID_');
                    html += generateDevMenuItem(version, 'HubDB', hubId, 'https://app.hubspot.com/hubdb/_HUB_ID_');
                    html += generateDevMenuItem(version, 'File Manager', hubId, 'https://app.hubspot.com/file-manager-beta/_HUB_ID_');
                    html += generateDevMenuItem(version, 'Content Staging', hubId, 'https://app.hubspot.com/content/_HUB_ID_/staging/');
                    html += generateDevMenuItem(version, 'Advanced Menus', hubId, 'https://app.hubspot.com/settings/_HUB_ID_/website/pages/all-domains/navigation');
                    html += generateDevMenuItem(version, 'Content Settings', hubId, 'https://app.hubspot.com/settings/_HUB_ID_/website/pages/all-domains/page-templates');
                    html += generateDevMenuItem(version, 'URL Mappings', hubId, 'https://app.hubspot.com/content/_HUB_ID_/settings/url-mappings');
                    html += generateDevMenuItem(version, 'Marketplace', hubId, 'https://app.hubspot.com/marketplace/_HUB_ID_/products');
                    
                    return html;

                }

                function generateAppUrl(path) {
                    return 'https://' + appUrl + path;
                }


                function generateDevMenu(version, hubId) {


                    var html = '';
                    if (version === 3) {

                        html += '<li id="ext-dev-menu" class="nav-main-item nav-dropdown-container" style="background-color: #555;"><a href="">Developer</a>';
                        html += '<ul class="nav-dropdown-menu" style="min-width: 102px;">';
                    }
                    else if(version === 4){
                        html += '<li id="ext-dev-menu-wrapper" role="none" class="expandable ">';
                        html += '<a href="#" id="nav-primary-dev-branch" aria-haspopup="true" aria-expanded="false" class="primary-link" data-tracking="click hover" role-menu="menuitem">';
                        html += 'Developer ';
                        html += '<svg style="max-height:4px;max-width:10px;" class="nav-icon arrow-down-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 13"><g><g><path d="M21.47,0.41L12,9.43l-9.47-9A1.5,1.5,0,1,0,.47,2.59l10.5,10,0,0a1.51,1.51,0,0,0,.44.28h0a1.43,1.43,0,0,0,1,0h0A1.52,1.52,0,0,0,13,12.61l0,0,10.5-10A1.5,1.5,0,1,0,21.47.41" transform="translate(0 0)"></path></g></g></svg>';
                        html += '</a>';
                        html += '<div id="ext-dev-menu" aria-label="Developer" role="menu" class="secondary-nav expansion" style="min-height: 0px">';
                        html += '<ul role="none">';
                    }

                    html += generateAllMenuItems(version, hubId);

                    if (version === 3) {    
                        html += '</ul>';
                        html += '</li>';
                        $("#nav-main-item-product-selector").after(html);
                        $("#ext-dev-menu > a").click(function(e) {
                            e.preventDefault();
                            //console.log("dev menu clicked!");
                            $("#ext-dev-menu").toggleClass("current-dropdown");

                            $(".nav-dropdown-menu", "#ext-dev-menu").toggle();
                            $(this).toggleClass("current-dropdown-item");
                        });
                    }
                    else if (version === 4) {
                        
                        html += '</ul>';
                        html += '</div>';
                        html += '</li>';

                        $("#hs-nav-v4 .logo").after(html);

                        $("#ext-dev-menu-wrapper > a").click(function(e) {
                            e.preventDefault();
                            //console.log("dev menu clicked!");
                            /*$("#ext-dev-menu").toggleClass("expansion");*/

                            //$("#ext-dev-menu").toggle();

                            var isExpanded = $(this).attr('aria-expanded');

                            if (isExpanded === 'true') {
                                $(this).attr('aria-expanded', 'false');
                                trackClick("devMenu-Closed");
                            } else {
                                $(this).attr('aria-expanded', 'true');
                                trackClick("devMenu-Opened");
                            }
                            $(this).parent("li").toggleClass("active");
                        });

                        $("#ext-dev-menu .navSecondaryLink, #ext-dev-menu .devMenuLink").click(function(){
                            console.log("track click");
                            var linkName = "devMenu:"+$(this).data("ext-track");
                            console.log(linkName);
                            trackClick(linkName);
                        });
                    }
                };

                /*get current HubSpot ID*/

                var hubId;
                if (navVersion === 3) {
                    hubId = $(".nav-hubid").text().replace("Hub ID: ", "");


                    if ($("#nav-main-item-product-selector").length) {
                        generateDevMenu(3, hubId);


                    } else {
                        var doesntExist = true;
                        var attempts = 10;
                        while (doesntExist && attempts > 0) {
                            setTimeout(function() {
                                if (document.getElementById("#nav-main-item-product-selector") != null) {
                                    doesntExist = false;
                                }
                                //console.log("delay");
                            }, 10);
                            attempts -= 1;

                        }
                        //console.log("selector found!");

                        generateDevMenu(3, hubId);

                        //console.log("should be inserted now");
                    };


                } else if (navVersion === 4) {

                    var checkExist = setInterval(function() {
                        if ($("#hs-nav-v4 .logo > a").attr("href").length) {
                            //console.log("Exists!");

                            hubId = $("#hs-nav-v4 .logo > a").attr("href").replace(generateAppUrl("/reports-dashboard/"), "").replace("/home", "");
                            if (hubId) {
                                clearInterval(checkExist);
                                generateDevMenu(4, hubId);
                            } else {
                                //console.log("Hub ID not defined yet");
                            }
                            //console.log("Hub ID:", hubId);
                        } else {
                            //console.log("#nav-primary-home does not exist");

                        }
                    }, 300); // check every 100ms

                }

            }

        });



    } else if (~tabUrl.indexOf("designers.hubspot.com/docs/")) {
        //console.log("Viewing HubSpot Documentation");
        currentScreen="docs";


    } else {
        //console.log("This is not in the HubSpot Backend");


    }





});

