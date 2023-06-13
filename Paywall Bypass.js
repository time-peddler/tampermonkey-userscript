// ==UserScript==
// @name         Regwall Element Blocker
// @namespace    regwall-element-blocker
// @version      1.1
// @description  Blocks rendering of elements with class or id containing "regwall"
// @match        https://www.economist.com/*
// @match        *://*.fortune.com/*
// @run-at       document-start
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
             // Remove paywallFade class from elements
            let paywallFadeElements = wrapper.querySelectorAll('.paywallFade');
            for (let i = 0; i < paywallFadeElements.length; i++) {
                paywallFadeElements[i].classList.remove('paywallFade');
            };

            // Remove paywallActive class from elements with class 'paywall'
            let paywallElements = wrapper.querySelectorAll('.paywall.paywallActive');
            for (let i = 0; i < paywallElements.length; i++) {
                paywallElements[i].classList.remove('paywallActive');
            };

            // Hide elements with class 'tp-container-inner' by adding 'display: none' to their style attribute
            let tpContainerInnerElements = wrapper.querySelectorAll('.tp-container-inner');
            for (let i = 0; i < tpContainerInnerElements.length; i++) {
                tpContainerInnerElements[i].style.display = 'none';
            };
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

