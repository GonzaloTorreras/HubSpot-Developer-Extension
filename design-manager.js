$(document).ready(function(){
	/*This script runs once the design manager page loads.*/
	
	chrome.storage.sync.get([
	    'darktheme'
	  ], function(items) {
	    if(items.darktheme){
	    	$("body").addClass("ext-dark-theme");
	    }
	});

})