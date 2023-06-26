// ==UserScript==
// @name         Regwall Element Blocker
// @namespace    regwall-element-blocker
// @version      1.3.2
// @description  Blocks rendering of elements with class or id containing "regwall"
// @match        https://www.economist.com/*
// @match        *://*.fortune.com/*
// @run-at       document-start
// @author       TIME
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let loadCustomPage = () => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.href, true);
    xhr.onerror = function () {
        document.documentElement.innerHTML = "Error getting Page!";
    };
    xhr.send();
    xhr.onreadystatechange = function() {
        let states = [
            "Removing the Subscription...",
            "Initiating the Request...",
            "Establishing the Server...",
            "Request Received...",
            "Processing the Request...",
            "Error Finding the Page!"
        ];
        document.documentElement.innerHTML = states[this.readyState] || "Error Finding the Page!";
        if (this.readyState == 4 && this.status == 200) {
            removeSubscription(this.responseText);
        }
    };
};

let removeSubscription = (htmlContentStr) => {
    let wrapper = document.createElement("DIV");
    wrapper.innerHTML = htmlContentStr;
    if (matchDomain('economist.com')) {
        removeElements(wrapper, ".paywall");
        removeElements(wrapper, ".subscription-benefits");
    } else if (matchDomain('fortune.com')) {
        hideElementsBySelector(wrapper, 'tp-container-inner');
        hideElementsBySelector(wrapper, '.paywall-selector paywallFade');
        hideElementsBySelector(wrapper, 'lazy-transclude');
    }
    document.documentElement.innerHTML = "Removing the Ads...";
    removeElements(wrapper, ".advert");
    putNewPage(wrapper);
};

let removeElements = (wrapper, selector) => {
    let elements = wrapper.querySelectorAll(selector);
    elements.forEach((element) => {
        element.remove();
    });
};

let hideElementsBySelector = (wrapper, selector) => {
    let elements = wrapper.querySelectorAll(selector);
    elements.forEach((element) => {
        element.style.display = 'none';
    });
};

let putNewPage = (pageHtml) => document.documentElement.innerHTML = pageHtml.innerHTML;

window.stop();
loadCustomPage();

function matchDomain(domains) {
    const hostname = window.location.hostname;
    if (typeof domains === 'string') { domains = [domains]; }
    return domains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
}

})();
