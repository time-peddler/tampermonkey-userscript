// ==UserScript==
// @name         Paywall Element Blocker
// @name:zh-CN   无涯拦截
// @namespace    paywall-element-blocker
// @version      1.3.2
// @description  Blocks rendering of elements with class or id containing "regwall"
// @match        *://*.economist.com/*
// @match        *://*.fortune.com/*
// @match        *://*.deadline.com/*
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
            let newHtml = processHtml(this.responseText);
            document.documentElement.innerHTML = newHtml.innerHTML;
        }
    };
};

function processHtml(htmlContentStr) {
    let wrapper = document.createElement("DIV");
    wrapper.innerHTML = htmlContentStr;
    removeElementsWithAdClass(wrapper);
    if (matchDomain('fortune.com')) {
        imgHandler(wrapper);
    } else if (matchDomain('economist.com')) {
        console.log(htmlContentStr);
    } else if (matchDomain('deadline.com')) {
        imgHandler(wrapper);
    }
    return wrapper;
}

function imgHandler(wrapper) {
    // Remove all img elements with src starting with "data:image"
    var base64Images = wrapper.querySelectorAll('img[src^="data:image"]');
    base64Images.forEach(function(img) {
        img.remove();
    });

    // Update images` attribute of data-lazy-src to src
    var imgTags = wrapper.querySelectorAll('img');
    imgTags.forEach(function(img) {
        var lazySrc = img.getAttribute('data-lazy-src');
        if (lazySrc) {
        img.setAttribute('src', lazySrc);
        }
    });

    // Change all noscript elements to div
    var noscripts = wrapper.querySelectorAll('noscript');
    noscripts.forEach(function(noscript) {
        var replacementDiv = document.createElement('div');
        replacementDiv.innerHTML = noscript.innerHTML;
        noscript.parentNode.replaceChild(replacementDiv, noscript);
    });
    return wrapper;
}

// Define a function to remove elements with class containing "adComponent" or "advert"
function removeElementsWithAdClass(wrapper) {
    // Select elements with class containing "adComponent" or "advert"
    let sensitiveAdCharacters = ['adComponent','advert','admz','header-ad']
    let selectors = sensitiveAdCharacters.map(className => `[class*="${className}"]`).join(', ');
    var adElements = wrapper.querySelectorAll(selectors);
    console.log('elements:',adElements);
    // Remove the selected elements
    adElements.forEach(function(element) {
        element.remove();
    });
    return wrapper;
}

window.stop();
loadCustomPage();

function matchDomain(domains) {
    const hostname = window.location.hostname;
    if (typeof domains === 'string') { domains = [domains]; }
    return domains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
}

})();
