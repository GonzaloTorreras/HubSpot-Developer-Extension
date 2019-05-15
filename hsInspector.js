console.log("hsinspector js loaded!");

var devInfoLinks = document.querySelectorAll(".hs-tools-menu a");

devInfoLinks.forEach(function(el, i) {
    var linkURL = el.getAttribute("href");
    var linkText = el.textContent;
    if (linkText.includes("Developer Info")) {
        console.log(linkText, linkURL);
        chrome.runtime.sendMessage({ devInfoURL: linkURL }, function(response) {
            console.log(response.farewell);
        });
    }




});

/*
function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }*/