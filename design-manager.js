$(document).ready(function(){
	/*This script runs once the design manager page loads.*/
	console.log("Yay script is working");
	chrome.storage.sync.get({
	    darktheme: true
	  }, function(items) {
	    if(items.darktheme){
	    	$("body").addClass("ext-dark-theme");
	    }
	});

})