/* https://gist.github.com/eligrey/738199#file-chrome-i18n-js
 * Chrome DOM i18n: Easy i18n for your Chrome extensions and apps' DOM.
 * 2011-06-22
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*jslint laxbreak: true, strict: true*/
/*global self, chrome, document*/

(function(document) {
    "use strict";
    var
        i18n = self.i18n = function(key, substitutions) {
            if (key === "@@IETF_lang_tag") {
                return i18n("@@ui_locale").replace(/_/g, "-");
            }
            return chrome.i18n.getMessage(key, substitutions);
        },
        localeText = document.querySelectorAll("[data-i18n]"),
        i = localeText.length,
        j, elt, terms, term, child, len, key, substitutions;
    while (i--) {
        elt = localeText.item(i);
        terms = elt.dataset.i18n.split(/\s*,\s*/);
        delete elt.dataset.i18n;
        child = j = 0;
        len = terms.length;
        for (; j < len; j++) {
            term = terms[j].split(/\s*=\s*/);
            if (term.length > 1 && isNaN(term[0])) {
                elt.setAttribute(term[0], i18n(term[1]));
            } else {
                if (term.length === 1) {
                    child++;
                } else {
                    child = +term[0];
                }
                elt.insertBefore(
                    document.createTextNode(i18n(term[term.length - 1])), elt.children.item(child - 1)
                );
            }
        }
    }
}(document));