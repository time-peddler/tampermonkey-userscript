// ==UserScript==
// @name         Fortune.com Paywall Bypass
// @namespace    Fortune.com Paywall Bypass
// @version      1.0
// @description  Bypass paywall on Fortune.com, hide tp-container-inner element, and remove paywallFade class
// @author       TIME
// @match        https://fortune.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load completely
    window.addEventListener('load', function() {
        // Remove paywallFade class from elements
        let paywallFadeElements = document.querySelectorAll('.paywallFade');
        for (let i = 0; i < paywallFadeElements.length; i++) {
            paywallFadeElements[i].classList.remove('paywallFade');
        }

        // Remove paywallActive class from elements with class 'paywall'
        let paywallElements = document.querySelectorAll('.paywall.paywallActive');
        for (let i = 0; i < paywallElements.length; i++) {
            paywallElements[i].classList.remove('paywallActive');
        }

        // Hide elements with class 'tp-container-inner' by adding 'display: none' to their style attribute
        let tpContainerInnerElements = document.querySelectorAll('.tp-container-inner');
        for (let i = 0; i < tpContainerInnerElements.length; i++) {
            tpContainerInnerElements[i].style.display = 'none';
        }
    });
})();
