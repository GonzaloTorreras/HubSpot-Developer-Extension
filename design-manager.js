$(document).ready(function() {
    /*This script runs once the design manager page loads.*/
    var tabUrl = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
    /*getSelected might be deprecated need to review*/
    var currentScreen='';
    //console.log("Current URL: ",tabUrl);
    if (~tabUrl.indexOf("app.hubspot.com")) {
        //console.log("This is the hubspot backend.");


        if (~tabUrl.indexOf("/design-manager/")) {
            //console.log("Old Design Manager is active");
            currentScreen='design-manager';

        }
        if (~tabUrl.indexOf("/beta-design-manager/")) {
            /*note this string detection will likely break once rolled out to everyone as they likely wont leave beta in the name*/
            //console.log("Design Manager V2 is active");
            currentScreen='design-manager';
            chrome.storage.sync.get([
                'darktheme'
            ], function(items) {
                if (items.darktheme) {
                    $("body").addClass("ext-dark-theme");
                }
            });

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
			
			
			if($("#nav-main-item-product-selector").length){
				generateDevMenu(3, hubId);


			} else{
				var doesntExist = true;
				var attempts = 10;
				while(doesntExist && attempts>0){
					setTimeout(function(){
						if(document.getElementById("#nav-main-item-product-selector")!= null){
							doesntExist =false;
						}
						console.log("delay");
					}, 10);
					attempts-=1;

				}
				console.log("selector found!");
				
				generateDevMenu(3, hubId);
				
				console.log("should be inserted now");
			};
			

		} else if(navVersion == 4){

				var checkExist = setInterval(function() {
				   if ($("#hs-nav-v4 .logo > a").attr("href").length) {
						console.log("Exists!");
						  
						hubId = $("#hs-nav-v4 .logo > a").attr("href").replace("https://app.hubspot.com/reports-dashboard/","").replace("/home","");
						if( hubId){
							clearInterval(checkExist);
							generateDevMenu(4, hubId);
						} else {
							console.log("Hub ID not defined yet");
						}
						console.log("Hub ID:",hubId);
				   }
				   else{
						console.log("#nav-primary-home does not exist");

				   }
				}, 300); // check every 100ms

		}

    




    } else if (~tabUrl.indexOf("designers.hubspot.com/docs/")) {
        //console.log("Viewing HubSpot Documentation");


    } else {
        //console.log("This is not in the HubSpot Backend");


    }
 




});


function generateDevMenu(version, hubId){

			
			
	if (version == 3){
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
		
		
	} else if(version == 4){
		var html =  '';
			html +=	'<li id="ext-dev-menu-wrapper" role="none" class="expandable ">';
			html +=  	'<a href="#" id="nav-primary-dev-branch" aria-haspopup="true" aria-expanded="false" class="primary-link" data-tracking="click hover" role-menu="menuitem">';
			html += 		'Developer ';
			html += 		'<svg style="max-height:4px;max-width:10px;" class="nav-icon arrow-down-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 13"><g><g><path d="M21.47,0.41L12,9.43l-9.47-9A1.5,1.5,0,1,0,.47,2.59l10.5,10,0,0a1.51,1.51,0,0,0,.44.28h0a1.43,1.43,0,0,0,1,0h0A1.52,1.52,0,0,0,13,12.61l0,0,10.5-10A1.5,1.5,0,1,0,21.47.41" transform="translate(0 0)"></path></g></g></svg>';
			html += 	'</a>';
			html +=		'<div id="ext-dev-menu" aria-label="Developer" role="menu" class="secondary-nav expansion">';
			html +=			'<ul role="none">';
			html +=				'<li role="none">';
            html +=					'<a role="menuitem" data-tracking="click hover" id="nav-secondary-design-tools-beta" class="navSecondaryLink" href="https://app.hubspot.com/design-manager/' + hubId + '" >';
            html +=						'Design Tools<span class="beta-badge">Beta</span>';
            html +=					'</a>';
            html +=				'</li>';
			html +=     	'</ul>';
			html +=		'</div>';
			html += '</li>';
			
		$("#hs-nav-v4 .logo").after(html);
		
		$("#ext-dev-menu-wrapper > a").click(function(e){
             e.preventDefault();
            console.log("dev menu clicked!");
            $("#ext-dev-menu").toggleClass("expansion");
            
            //$("#ext-dev-menu").toggle();
            $(this).parent("li").toggleClass("active");
        });
	}
	
}


