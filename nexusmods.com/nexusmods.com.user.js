// ==UserScript==
// @name Nexus Mods Auto-Click Slow Download
// @namespace    au.benjithatfoxguy.nexusmods.com
// @icon         https://cdn.benjifox.gay/favicon.ico
// @version      1.0.4
// @description Automatically clicks the "Slow Download" button on Nexus Mods download pages.
// @author       BenjiThatFoxGuy
// @match *://*.nexusmods.com/*
// @grant        none
// @license MIT
// @updateURL    https://updates.benjifox.gay/nexusmods.com.meta.js
// @downloadURL  https://updates.benjifox.gay/nexusmods.com.user.js
// ==/UserScript==

(function() {
    // Delay the execution to ensure the button is loaded
    setTimeout(function() {
      // Locate the "Slow Download" button element using the supplied selector
      var slowDownloadBtn = document.evaluate('//*[@id="slowDownloadButton"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
      // Check if the button exists
      if (slowDownloadBtn) {
        // Programmatically trigger a click event on the button
        slowDownloadBtn.click();
      }
    }, 1000); // Adjust the delay time (in milliseconds) if needed
  })();
  