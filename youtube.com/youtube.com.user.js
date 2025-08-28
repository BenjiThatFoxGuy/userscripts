// ==UserScript==
// @name         YouTube Watch Later: No Playlist Context
// @namespace    au.benjithatfoxguy.youtube.com
// @version      1.3
// @description  Removes list=WL from video links on your Watch Later playlist page so videos open solo and can be ticked off.
// @author       BenjiThatFoxGuy
// @match        https://www.youtube.com/*
// @grant        none
// @updateURL    https://updates.benjifox.gay/youtube.com.user.js
// @downloadURL  https://updates.benjifox.gay/youtube.com.user.js
// ==/UserScript==

(function() {
  function fixLinks() {
    document.querySelectorAll('a[href*="/watch"][href*="list=WL"]').forEach(a => {
      let url = new URL(a.href, location.origin);
      url.searchParams.delete('list');
      url.searchParams.delete('index');
      a.href = `/watch?${url.searchParams.toString()}`;
    });
  }

  new MutationObserver(fixLinks).observe(document.body, {subtree:true,childList:true});
  fixLinks();
})();