// ==UserScript==
// @name         twitchemotes.com - Unblock Right Click on Images
// @namespace    au.benjithatfoxguy.twitchemotes.com
// @icon         https://cdn.benjifox.gay/favicon.ico
// @version      0.1
// @description  Removes the right-click blocker on emote images and adds a disclaimer.
// @author       BenjiThatFoxGuy
// @match        https://twitchemotes.com/*
// @grant        none
// @license      MIT
// @updateURL    https://updates.benjifox.gay/twitchemotes.com.meta.js
// @downloadURL  https://updates.benjifox.gay/twitchemotes.com.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Remove all oncontextmenu attributes from images
    function cleanImages() {
        document.querySelectorAll('img').forEach(function(img) {
            img.oncontextmenu = null;
            img.removeAttribute('oncontextmenu');
        });
    }

    // Remove jQuery delegated contextmenu handler repeatedly
    function nukeJQueryHandler() {
        if (window.jQuery) {
            window.jQuery(document).off('contextmenu', 'img');
        }
    }

    // Intercept contextmenu events at the capture phase and stop them
    function blockContextMenu(e) {
        if (e.target.tagName === 'IMG') {
            e.stopImmediatePropagation();
            // Do not call e.preventDefault(), so the browser menu still appears
        }
    }

    document.addEventListener('contextmenu', blockContextMenu, true);

    // Run cleanup repeatedly in case scripts re-add handlers
    setInterval(function() {
        cleanImages();
        nukeJQueryHandler();
    }, 500);

    // Initial cleanup
    cleanImages();
    nukeJQueryHandler();
})();
