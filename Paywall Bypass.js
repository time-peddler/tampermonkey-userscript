// ==UserScript==
// @name         Regwall Element Blocker
// @namespace    regwall-element-blocker
// @version      1.3
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
            if (this.readyState == 4 && this.status == 200) {
                document.documentElement.innerHTML = "Removing the Subscription...";
                removeSubscription(this.responseText);
            }
            else if(this.readyState == 0){
                document.documentElement.innerHTML = "Initiating the Request...";
            }
            else if(this.readyState == 1){
                document.documentElement.innerHTML = "Establishing the Server...";
            }
            else if(this.readyState == 2){
                document.documentElement.innerHTML = "Request Received...";
            }
            else if(this.readyState == 3){
                document.documentElement.innerHTML = "Processing the Request...";
            }
            else{
                document.documentElement.innerHTML = "Error Finding the Page!";
            }
        };
    };

    let removeSubscription = (htmlContentStr) => {
        let wrapper = document.createElement("DIV");
        wrapper.innerHTML = htmlContentStr;
        if (matchDomain('economist.com')) {
            let paywalls = wrapper.querySelectorAll(".paywall");
            let subscriptions = wrapper.querySelectorAll(".subscription-benefits");

            paywalls.forEach((paywall) => {
                paywall.remove();
            });
            subscriptions.forEach((subscription) => {
                subscription.remove();
            });
        } else if (matchDomain('fortune.com')) {
            // Hide elements with class 'tp-container-inner' by adding 'display: none' to their style attribute
            let tpContainerInnerElements = wrapper.querySelectorAll('.paywall-selector paywallFade');
            for (let i = 0; i < tpContainerInnerElements.length; i++) {
                tpContainerInnerElements[i].style.display = 'none';
            };

            // Set style attribute 'display: none' for lazy-transclude elements with domain 'fortune.com'
            let lazyTranscludeElements = wrapper.querySelectorAll('lazy-transclude');
            lazyTranscludeElements.forEach((element) => {
                if (element.getAttribute('domain') === 'fortune.com') {
                    element.style.display = 'none';
                }
            });
        };

        document.documentElement.innerHTML = "Removing the Ads...";
        removeAds(wrapper.innerHTML);
    };

    let removeAds = (htmlContentStr) => {
        let wrapper = document.createElement("DIV");
        wrapper.innerHTML = htmlContentStr;

        let adverts = wrapper.querySelectorAll(".advert");
        adverts.forEach((advert) => {
            advert.remove();
        });

        putNewPage(wrapper);
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
