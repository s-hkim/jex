(function() {
  var status = document.getElementById("status"),
      query_field = document.getElementById("query-field"),
      define_button = document.getElementById("define-button"),
      definition_box = document.getElementById("definition"),
      r = document.getElementById("reading"),
      w = document.getElementById("word");
  var define = function(){
    var trash = document.getElementById("temp-div");
    if (trash !== null) {
      trash.remove();
    }
    // strip query
    var stripped = query_field.value.replace(/^\s+|\s+$/g,""),
        words = encodeURI(stripped);

    status.innerText = "searching...";
    status.style.display = "block";
    // send to background script
    chrome.runtime.sendMessage({message: words}, function(response) {
      var bp = chrome.extension.getBackgroundPage();
      // bp.console.log(response);
      var data = response.data;
      if (data !== null) {
        var reading = data.japanese[0].reading,
            word = data.japanese[0].word,
            senses = data.senses;
        r.innerText = reading || "";
        w.innerText = word || "";
        var temp_div = document.createElement("div");
        temp_div.setAttribute("id","temp-div");
        for (var i = 0; i < senses.length; i++) {
          var meanings = data.senses[i].english_definitions,
              parts_of_speech = data.senses[i].parts_of_speech,
              tags = data.senses[i].tags;
          if (parts_of_speech && parts_of_speech.length > 0) {
            if (parts_of_speech.indexOf("Wikipedia definition") != -1) {
              // skip wikipedia
              continue;
            }
            var separator = document.createElement("hr");
            temp_div.appendChild(separator);
            var temp_p = document.createElement("div");
            temp_p.setAttribute("class","parts-of-speech");
            temp_p.innerText = parts_of_speech.join(", ");
            temp_div.appendChild(temp_p);
          }
          var temp_m = document.createElement("div");
          temp_m.setAttribute("class","meanings");
          temp_m.innerText = meanings ? meanings.join(", ") : "";
          temp_div.appendChild(temp_m);
          var temp_t = document.createElement("div");
          temp_t.setAttribute("class","tags");
          temp_t.innerText = tags ? tags.join(", ") : "";
          temp_div.appendChild(temp_t);
        }
        more = document.createElement("div");
        more.setAttribute("id", "more");
        morelink = document.createElement("a");
        morelink.setAttribute("href", "http://jisho.org/search/"+words);
        morelink.setAttribute("target", "_blank");
        morelink.innerText = "more";
        more.appendChild(morelink);
        temp_div.appendChild(more);
        definition_box.appendChild(temp_div);
        definition_box.style.display = "block";
        status.style.display = "none";
        status.innerText = "";
      } else {
        status.innerText = "No results found."
      }
    });
  }
  define_button.addEventListener('click', define);
  query_field.addEventListener('keydown', function(e){
    if(e.keyCode == 13) {
      define();
    }
  });
  query_field.focus();

})();
