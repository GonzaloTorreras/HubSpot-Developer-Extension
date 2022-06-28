console.log("hsinspector js loaded!");

var devInfoLink = document.querySelector(".hs-tools-menu a[href*='/___context___/']")
if (devInfoLink) {
  chrome.runtime.sendMessage({ devInfoURL: devInfoLink.href }, function (response) {
      console.table(response)
        console.log(response.farewell);
    });
}

/*
function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }*/