// ==UserScript==
// @name         YouTube Watch Later: No Playlist Context
// @namespace    au.benjithatfoxguy.youtube.com
// @version      1.6
// @description  Removes list=WL from video links on your Watch Later playlist page so videos open solo and can be ticked off.
// @author       BenjiThatFoxGuy
// @match        https://www.youtube.com/playlist*
// @match        https://youtube.com/playlist*
// @match        https://m.youtube.com/playlist*
// @include      https://www.youtube.com/playlist*
// @include      https://youtube.com/playlist*
// @include      https://m.youtube.com/playlist*
// @include      http://www.youtube.com/playlist*
// @include      http://youtube.com/playlist*
// @include      http://m.youtube.com/playlist*
// @include      https://*.youtube.com/playlist*
// @include      http://*.youtube.com/playlist*
// @noframes
// @run-at       document-start
// @grant        none
// @updateURL    https://updates.benjifox.gay/youtube.com.user.js
// @downloadURL  https://updates.benjifox.gay/youtube.com.user.js
// ==/UserScript==

(function() {
  // Only run on Watch Later playlist
  if (!location.search.includes('list=WL')) return;

  function cleanUrl(url) {
    let u = new URL(url, location.origin);
    u.searchParams.delete('list');
    u.searchParams.delete('index');
    return '/watch?' + u.searchParams.toString();
  }

  function fixLinks() {
    document.querySelectorAll('a[href*="/watch"][href*="list=WL"]').forEach(a => {
      a.href = cleanUrl(a.href);
    });
  }

  // Intercept clicks to prevent YouTube from re-adding list=WL
  document.addEventListener('click', function(e) {
    let a = e.target.closest('a[href*="/watch"][href*="list=WL"]');
    if (a && a.href) {
      e.stopPropagation();
      e.preventDefault();
      window.location.href = cleanUrl(a.href);
    }
  }, true);
  function init() {
    // Catch new nodes and href changes
    new MutationObserver(() => { fixLinks(); }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['href']
    });

    // First pass
    fixLinks();

    // Re-run after SPA navigations
    window.addEventListener('yt-page-data-updated', fixLinks);
    window.addEventListener('yt-navigate-finish', fixLinks);
  }

  if (document.body) {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();