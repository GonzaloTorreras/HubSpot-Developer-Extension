// Saves options to chrome.storage
function save_options() {

  var darkthemeVal = document.getElementById("darktheme").checked;
  chrome.storage.sync.set({
    darktheme: darkthemeVal,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = 'Options saved. If you have the Design manager open, you will need to refresh to see the theme.';
    setTimeout(function() {
      status.textContent = "";
    }, 4000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(
    ["darktheme"], function(items) {
    document.getElementById("darktheme").checked = items.darktheme;
  });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
    save_options);