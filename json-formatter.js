
chrome.storage.sync.get([
    "json"
], function(items) {
    if (items.json) {
        formatJSON();
    }
});

function formatJSON() {
    const pre = document.querySelector("body > pre");
    if (pre) {
        
        // test if content looks like json
        var content = pre.innerText;
        if (content[0] == "{") {
            //now double check
            if (jsonChecker(content)) {
                console.log("okay formatting now");
                // hide original
                pre.style.display = "none";
                const r = init("body > pre");
                if (!r) {
                    //display back the original
                    pre.style.display = "block";
                }
            }
        }
        
    }

    //check if string is valid json
    function jsonChecker(string) {
        if (/^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            console.log("valid json");
            return true;
        } else {
            console.log("json not detected");
            return false;
        }
    }

    function init(ele) {

        //get the original and re-parse as JSON
        //var json = $.parseJSON($(ele).text());
        try {
            var json = JSON.parse(document.querySelector(ele).innerText);
            // save it on window to make it available
            window.json = json;
            console.log("You can access the json object from window.json");
        }
        catch (e) {
            console.log("error parsing json, false positive?"); /* it may happen when you are in the dev info page, but checking the HubSpot devTool page tab */
            console.log(e);
            return false;
        }
        //re enconded as string with 4 spaces TAB.
        json = JSON.stringify(json, undefined, 4);

        document.querySelector("html").classList.add("hs-json-formatted");

        // create highlight and append to body
        let highlight = document.createElement("div");
        highlight.classList.add("json-formatted");
        try {
            highlight.innerHTML = syntaxHighlight(json);    
        }
        catch (e) {
            console.log("error creating highlight");
            console.log(e);
            return false;
        }
        document.querySelector("body").appendChild(highlight);

        //hide original ele
        document.querySelector(ele).style.display = "none";
        
        
        //attach events .json-formmated wrapper for each .minimize-me vanilla JS
        const minimizeMe = document.querySelectorAll(".minimize-me");
        for (let i = 0; i < minimizeMe.length; i++) {
            minimizeMe[i].addEventListener("click", function () {
                this.closest("ul").classList.toggle("minimized");
            });
        }
        /*
            $(".json-formatted").find(".minimize-me").click(function() {
                $(this).parent("ul").toggleClass("minimized");
            });
        */
        copySnippetInit(".json-formatted");
        return true;
    }

    function copySnippetInit(ele) {
        //attach event to all .key, then reset .active nodes and add .active to all the parent li nodes.
        const keys = document.querySelectorAll(ele + " .key");
        for (let i = 0; i < keys.length; i++) {
            keys[i].addEventListener("click", function () {
                const actives = document.querySelectorAll(ele + " .active");
                for (let j = 0; j < actives.length; j++) {
                    actives[j].classList.remove("active");
                }
                
                //find all parents "li" elements and add .active
                var parents = [];
                var parent = this.closest("li")
                while (parent) {
                    parents.push(parent);
                    parent.classList.add("active");
                    parent = parent.parentElement.closest("li");
                }

                var snippet = this.getAttribute("data-clipboard-text");
                if (!snippet) {
                    //snippet = generateSnippet(keys[i]);
                    snippet = generateSnippet2(parents.reverse());
                    if (snippet)
                        this.setAttribute("data-clipboard-text", snippet);
                }
                if (snippet)
                    copy(snippet);
            });
        }
/*
        $(ele + " .key").click(function() {
            //reset active nodes
            $(ele + " .active").removeClass("active");

            //activate nodes
            $(this).parents("li").addClass("active");

            var snippet = generateSnippet(ele);

            $(this).attr("data-clipboard-text", snippet);
            copy(snippet);

        });
*/
        //copy value
        $(ele + " .number," + ele + " .string").click(function() {
            //console.log($(this).text() );
            copy(String($(this).text()));

            $(this).attr("data-clipboard-text", $(this).text());
        });
    }

    function copy(string) {
        var clipboard = new ClipboardJS(".key, .number, .string", {
            text: function() {
                return string;
            }
        });
    }

    function generateSnippet2(eles) { 
        var snippet = [];
        var separator = "";

        for (let i = 0; i < eles.length; i++) {
            console.log("eles[" + i + "]:\n"+ eles[i] );
        
            const ele = eles[i].closest("ul").querySelector(".active > .key");
            console.log("ele:\n"+ ele );
            if (ele) {
                const key = ele.innerText.replaceAll(":","").replaceAll('"','');
                snippet.push(separator + key);
            } else { 
                console.log("error, no key found");
                console.log(eles[i]);
                console.log(ele);
            }

            separator = "."; //after first iteration, separator is "."
        }

        return "{{ " + snippet.join("") + " }}";
    }

    // TODO, remove this, but finish first the generateSnippet2, add array fors etc.
    function generateSnippet(ele) {
        var snippet = "{{ ";
        var separator = "";
        var option = "for";

        ele.querySelectorAll(".active").forEach(function(index, value) {
            //index == number of iterations

            //ul parent
            $parent = $(this).closest("ul");

            if ($parent.hasClass("array")) {
                if (index > 0) {
                    separator = ".";
                }

                snippet += separator + $(this).find("> .key").text();
            } else if ($parent.hasClass("list")) {
                snippet += "[" + $parent.find("> .active").index() + "]";
            }

        });

        snippet += " }}";

        snippet = snippet.replace(/"/g, "").replace(/:/g, "");

        //console.log(snippet);
        if (snippet != "{{ }}") 
            return snippet;
        else
            return false
    }

    function syntaxHighlight(json) {
        //if I get the val from the DOM need to replace spaces and line breaks too

        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '" data-clipboard-text="">' + match + '</span>';
        });

        //add separator between each 8 spaces
        json = json.replace(/        +/g, '    <span class="separator"></span>    ');

        //match new lines
        json = json.replace(/(?<!}|\])\n+/g, '\n<li>');

        //match end lines
        json = json.replace(/(?<!}|\])\r+/g, '</li>\r');

        //open & close container for each array
        /*look for { not followed by } same for [ ] but scapped with \ because its a special char. */
        json = json
            //.replace( /{(?!})/g, '<ul class="array"><li class="minimize-me"><li class="open-bracket">{</li>')
            //.replace( /\[(?!])/g, '<ul class="list"><li class="minimize-me"></li><li class="open-bracket">[</li>');

        //test with select open bracket only followed with new line \n
            .replace(/{\n/g, '<ul class="array"><li class="minimize-me"><li class="open-bracket">{</li>')
            .replace(/\[\n/g, '<ul class="list"><li class="minimize-me"></li><li class="open-bracket">[</li>')



        //look for close elements if they are not prev. by its opener, so they ignore {}
        //.replace( /(?<!{)}(?!,)/g, '<li class="close-bracket">}</li></ul>')
        //.replace( /(?<!\[)\](?!,)/g, '<li class="close-bracket">]</li></ul>')

        //look for }, or ], and close the ul after the comma.
        //.replace( /(?<!{)},/g, '<li class="close-bracket">},</li></ul>')
        //.replace( /(?<!\[)\],/g, '<li class="close-bracket">],</li></ul>')



        //for special cases where there are two commas (end of array at the end of a list etc.)
        .replace(/(?<!{)},,/g, '<li class="close-bracket">},</li><br>,</ul>')
            .replace(/(?<!\[)\],,/g, '<li class="close-bracket">],</li><br>,</ul>')

        //TEST selecting closing tags with and without comma followed by new line
        .replace(/(?<!{)},\n/g, '<li class="close-bracket">},</li></ul>')
            .replace(/(?<!\[)\],\n/g, '<li class="close-bracket">],</li></ul>')
            .replace(/(?<!{)}\n/g, '<li class="close-bracket">}</li></ul>')
            .replace(/(?<!\[)\]\n/g, '<li class="close-bracket">]</li></ul>')


        return json;
    }
}

