// ==UserScript==
// @name         e621 Deleted Post Restorer
// @namespace    au.benjithatfoxguy.e621.net
// @version      0.2
// @description  Restore deleted e621/e926 posts from archive if available
// @author       BenjiThatFoxGuy
// @match        https://e621.net/posts/*
// @match        https://e926.net/posts/*
// @grant        GM_xmlhttpRequest
// @connect      e621.net
// @connect      e926.net
// @connect      iwiftp.yerf.org
// @run-at       document-end
// @updateURL    https://updates.benjifox.gay/e621.net.user.js
// @downloadURL  https://updates.benjifox.gay/e621.net.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility: get post ID from URL
    function getPostId() {
        const match = window.location.pathname.match(/\/posts\/(\d+)/);
        return match ? match[1] : null;
    }

    // Utility: check if "deleted" notice is present
    function isDeletedPost() {
        // e621 shows a notice with class 'notice' and text 'This post was deleted.'
        return Array.from(document.querySelectorAll('.notice')).some(el => el.textContent.includes('This post was deleted'));
    }

    // Utility: e621 API request for deleted post
    function fetchDeletedPost(postId, callback) {
        const url = `https://e621.net/posts.json?tags=id:${postId}+status:deleted&limit=1`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'e621-restorer-userscript/0.1 (by benjithatfoxguy on e621)'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.posts && data.posts.length > 0) {
                        callback(data.posts[0]);
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    callback(null);
                }
            },
            onerror: function() { callback(null); }
        });
    }

    // Utility: check if archive image exists
    function checkArchive(url, callback) {
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: url,
            onload: function(resp) {
                callback(resp.status === 200);
            },
            onerror: function() { callback(false); }
        });
    }

    // Main logic
    function tryRestoreDeletedPost() {
        if (!isDeletedPost()) return;
        const postId = getPostId();
        if (!postId) return;

        fetchDeletedPost(postId, function(post) {
            if (!post || !post.file || !post.file.md5) return;
            const year = post.created_at.split('-')[0];
            const month = post.created_at.split('-')[1];
            const day = post.created_at.split('-')[2].slice(0,2);
            const ext = post.file.ext;
            const md5 = post.file.md5;
            const archiveUrl = `https://iwiftp.yerf.org/Furry/Art/Image archives/e621.net/${year}/${month}/${day}/${postId}__${md5}.${ext}`;

            // Fetch the image as a blob and convert to data URL
            function setImageFromArchive(archiveUrl, imgElement) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: archiveUrl,
                    responseType: 'blob',
                    onload: function(resp) {
                        const blob = resp.response;
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            imgElement.src = reader.result;
                        };
                        reader.readAsDataURL(blob);
                    },
                    onerror: function() {
                        imgElement.alt = 'Failed to load image from archive.';
                    }
                });
            }

            checkArchive(archiveUrl, function(exists) {
                if (!exists) return;
                // Remove deleted notice
                document.querySelectorAll('.notice').forEach(el => {
                    if (el.textContent.includes('This post was deleted')) el.remove();
                });
                // Try to find or create the image container
                let imgContainer = document.getElementById('image-container');
                if (!imgContainer) {
                    imgContainer = document.createElement('section');
                    imgContainer.id = 'image-container';
                    imgContainer.className = 'blacklistable';
                    // Insert before nav-links-bottom if possible, else at top of main
                    const navBottom = document.getElementById('nav-links-bottom');
                    if (navBottom && navBottom.parentNode) {
                        navBottom.parentNode.insertBefore(imgContainer, navBottom);
                    } else {
                        const main = document.querySelector('main') || document.body;
                        main.prepend(imgContainer);
                    }
                } else {
                    imgContainer.innerHTML = '';
                }
                // Insert the image (as data URL)
                const img = document.createElement('img');
                img.alt = `Recovered deleted post #${postId}`;
                img.id = 'image';
                img.className = 'fit-window';
                img.style = 'max-width:100%;display:block;margin:1em auto;';
                imgContainer.appendChild(img);
                setImageFromArchive(archiveUrl, img);
                // Add download button (direct link, not data URL)
                let dlDiv = document.getElementById('image-download-link');
                if (!dlDiv) {
                    dlDiv = document.createElement('div');
                    dlDiv.id = 'image-download-link';
                    // Try to insert into image-extra-controls if it exists
                    const extra = document.getElementById('image-extra-controls');
                    if (extra) {
                        extra.prepend(dlDiv);
                    } else {
                        imgContainer.appendChild(dlDiv);
                    }
                } else {
                    dlDiv.innerHTML = '';
                }
                const a = document.createElement('a');
                a.className = 'button btn-warn';
                a.href = archiveUrl;
                a.download = '';
                a.innerHTML = '<i class="fa-solid fa-right-to-bracket fa-rotate-90"></i> <span>Download</span>';
                dlDiv.appendChild(a);
            });
        });
    }

    // Run on page load
    window.addEventListener('DOMContentLoaded', tryRestoreDeletedPost);
    // Also run in case of SPA navigation
    setTimeout(tryRestoreDeletedPost, 1000);
})();
