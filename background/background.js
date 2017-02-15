// search on Jisho
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var message = request.message;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://jisho.org/api/v1/search/words?keyword=" + message);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var respObj = JSON.parse(xhr.responseText);
      var resp = null;
      if (respObj.data.length > 0) {
        resp = respObj.data[0];
      }
      sendResponse({data: resp});
    }
  }
  xhr.send();
  // responds asynchronously
  return true;
});
