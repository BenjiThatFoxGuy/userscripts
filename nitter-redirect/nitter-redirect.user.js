// ==UserScript==
// @name         Redirect to Nitter
// @namespace    au.benjithatfoxguy.nitter
// @version      1.3
// @description  Automatically redirect from Twitter/X to Nitter, automatically choosing a Nitter instance based on which one has the current post/user available.
// @icon         https://nitter.net/favicon.ico
// @include      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+$/
// @run-at       document-start
// @license MIT
// @updateURL    https://updates.benjifox.gay/nitter-redirect.meta.js
// @downloadURL  https://updates.benjifox.gay/nitter-redirect.user.js
// @author       BenjiThatFoxGuy
// ==/UserScript==

(function() {
    const nitterInstance = 'twiiit.com';
    location.href = `https://${nitterInstance}${location.pathname}${location.search}`;
})();
