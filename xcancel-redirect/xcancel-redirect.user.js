// ==UserScript==
// @name         Redirect to xCancel
// @namespace    au.benjithatfoxguy.xcancel
// @version      1.0
// @description  Automatically redirect from Twitter/X to xCancel (xcancel.com).
// @icon         https://xcancel.com/favicon.ico
// @include      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+$/
// @run-at       document-start
// @license MIT
// @updateURL    https://updates.benjifox.gay/xcancel-redirect.meta.js
// @downloadURL  https://updates.benjifox.gay/xcancel-redirect.user.js
// @author       BenjiThatFoxGuy
// ==/UserScript==

(function() {
    const xCancelInstance = 'xcancel.com';
    location.href = `https://${xCancelInstance}${location.pathname}${location.search}`;
})();
