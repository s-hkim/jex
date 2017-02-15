(function() {
  var overlay = document.createElement("div");
  overlay.setAttribute("class", "jex-overlay");
  document.body.appendChild(overlay);

  closeOverlay = function (e) {
    var trash = document.getElementById("jex-temp-div");
    if (trash !== null) {
      trash.remove();
    }
    overlay.style.display = 'none';
  };

  document.addEventListener('mouseup', function (e) {
    var selection = window.getSelection().toString().replace(/^\s+|\s+$/g,""),
        words = encodeURI(selection);
    if (selection.length > 0) {

      chrome.runtime.sendMessage({message: words}, function(response) {
        var data = response.data;
        closeOverlay();
        var temp_div = document.createElement("div");
        temp_div.setAttribute("id","jex-temp-div");
        if (data !== null) {
          var reading = data.japanese[0].reading || "",
              word = data.japanese[0].word || "",
              senses = data.senses;
          var temp_div = document.createElement("div");
          temp_div.setAttribute("id","jex-temp-div");

          var temp_reading = document.createElement("div");
          temp_reading.setAttribute("id","jex-reading");
          temp_reading.innerText = reading;
          temp_div.appendChild(temp_reading);

          var temp_word = document.createElement("div");
          temp_word.setAttribute("id","jex-word");
          temp_word.innerText = word;
          temp_div.appendChild(temp_word);

          for (var i = 0; i < senses.length; i++) {
            var meanings = data.senses[i].english_definitions,
                parts_of_speech = data.senses[i].parts_of_speech,
                tags = data.senses[i].tags;
            if (parts_of_speech && parts_of_speech.length > 0) {
              if (parts_of_speech.indexOf("Wikipedia definition") != -1) {
                // skip wikipedia
                continue;
              }
              var temp_p = document.createElement("div");
              temp_p.setAttribute("class","jex-parts-of-speech");
              temp_p.innerText = parts_of_speech.join(", ");
              temp_div.appendChild(temp_p);
            }
            var temp_m = document.createElement("div");
            temp_m.setAttribute("class","jex-meanings");
            var temp_number = document.createElement("span");
            temp_number.setAttribute("class","jex-numbering");
            temp_number.innerText = i+1+".";
            var temp_inline = document.createElement("span");
            temp_inline.setAttribute("class","jex-inline");
            temp_inline.innerText = meanings ? meanings.join(", ") : "";;
            temp_m.appendChild(temp_number);
            temp_m.appendChild(temp_inline);
            var temp_t = document.createElement("span");
            temp_t.setAttribute("class","jex-tags");
            temp_t.innerText = tags ? tags.join(", ") : "";
            temp_m.appendChild(temp_t);

            temp_div.appendChild(temp_m);
          }
        } else {
          var temp_stat = document.createElement("div");
          temp_stat.setAttribute("id", "jex-status");
          temp_stat.innerText = "No results found.";
          temp_div.appendChild(temp_stat);
        }
        overlay.appendChild(temp_div);
        overlay.style.top = e.clientY + 25 + "px";
        overlay.style.left = e.clientX - 25 + "px";
        overlay.style.display = "block";
      })
    }
  });
  document.addEventListener('mousedown', closeOverlay);
  document.addEventListener('scroll', closeOverlay);
  document.addEventListener('keydown', closeOverlay);

})();
