$(document).ready(function() {
    /*This script runs once the design manager page loads.*/
    var tabUrl = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
    /*getSelected might be deprecated need to review*/

    //console.log("Current URL: ",tabUrl);
    if (~tabUrl.indexOf("app.hubspot.com")) {
        //console.log("This is the hubspot backend.");


        if (~tabUrl.indexOf("/design-manager/")) {
            //console.log("Old Design Manager is active");

        }
        if (~tabUrl.indexOf("/beta-design-manager/")) {
            /*note this string detection will likely break once rolled out to everyone as they likely wont leave beta in the name*/
            //console.log("Design Manager V2 is active");
            chrome.storage.sync.get([
                'darktheme'
            ], function(items) {
                if (items.darktheme) {
                    $("body").addClass("ext-dark-theme");
                }
            });

        }

    } else if (~tabUrl.indexOf("designers.hubspot.com/docs/")) {
        //console.log("Viewing HubSpot Documentation");


    } else {
        //console.log("This is not in the HubSpot Backend");


    }
    /*detect HS nav bar version*/
    var navVersion;
    if($("#hs-nav-v3").length){
    	console.log("Nav V3 detected.");
    	navVersion=3;
    }
    else if($("#hs-nav-v4").length){
    	console.log("Nav V4 detected.");
    	navVersion=4;
    }

	/*get current HubSpot ID*/
	var hubId;
    if(navVersion == 3){
    	var hubId = $(".nav-hubid").text().replace("Hub ID: ","");

    }else if(navVersion == 4){
    	var hubId = $(".navAccount-portalId").text();
    }

    console.log("Hub ID:",hubId);

    if(navVersion == 3){
        console.log("should be inserted");
        
        var html = '';
        html += '<li id="ext-dev-menu" class="nav-main-item nav-dropdown-container" style="background-color: #555;"><a href="">Developer</a>';
        html +=     '<ul class="nav-dropdown-menu" style="min-width: 102px;">';

        html +=         '<li id="nav-dropdown-item-leads" data-mainitemid="contacts" class="nav-dropdown-item">';
        html +=             '<a data-appkey="contacts" href="https://app.hubspot.com/design-manager/'+hubId+'">';
        html +=                 '<span class="child-link-text link-text-after-parent-item-contacts">';
        html +=                     'Design Manager';
        html +=                 '</span>';
        html +=             '</a>';
        html +=         '</li>';

        html +=         '<li id="nav-dropdown-item-leads" data-mainitemid="contacts" class="nav-dropdown-item">';
        html +=             '<a data-appkey="contacts" href="https://app.hubspot.com/hubdb/'+hubId+'">';
        html +=                 '<span class="child-link-text link-text-after-parent-item-contacts">';
        html +=                     'HubDB';
        html +=                 '</span>';
        html +=             '</a>';
        html +=         '</li>';

        html +=         '<li id="nav-dropdown-item-leads" data-mainitemid="contacts" class="nav-dropdown-item">';
        html +=             '<a data-appkey="contacts" href="https://app.hubspot.com/content/'+hubId+'/staging/">';
        html +=                 '<span class="child-link-text link-text-after-parent-item-contacts">';
        html +=                     'Content Staging';
        html +=                 '</span>';
        html +=             '</a>';
        html +=         '</li>';

        html +=         '<li id="nav-dropdown-item-leads" data-mainitemid="contacts" class="nav-dropdown-item">';
        html +=             '<a data-appkey="contacts" href="https://app.hubspot.com/settings/'+hubId+'/website/pages/all-domains/navigation">';
        html +=                 '<span class="child-link-text link-text-after-parent-item-contacts">';
        html +=                     'Advanced Menus';
        html +=                 '</span>';
        html +=             '</a>';
        html +=         '</li>';


        html +=         '<li id="nav-dropdown-item-leads" data-mainitemid="contacts" class="nav-dropdown-item">';
        html +=             '<a data-appkey="contacts" href="https://app.hubspot.com/settings/'+hubId+'/website/pages/all-domains/page-templates">';
        html +=                 '<span class="child-link-text link-text-after-parent-item-contacts">';
        html +=                     'Content Settings';
        html +=                 '</span>';
        html +=             '</a>';
        html +=         '</li>';


        html +=     '</ul>';
        html += '</li>';
      
        
        $("#nav-main-item-product-selector").after(html);

        $("#ext-dev-menu > a").click(function(e){
             e.preventDefault();
            console.log("dev menu clicked!");
            $("#ext-dev-menu").toggleClass("current-dropdown");
            
            $(".nav-dropdown-menu","#ext-dev-menu").toggle();
            $(this).toggleClass("current-dropdown-item");
        });




    }





});