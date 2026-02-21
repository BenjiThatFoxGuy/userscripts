// ==UserScript==
// @name         VRCW.net World ID to VRCX Deeplink
// @namespace    au.benjithatfoxguy.vrcw.net
// @icon         https://cdn.benjifox.gay/favicon.ico
// @version      1.2.4
// @description  Converts VRChat world IDs to VRCX deeplinks on vrcw.net
// @author       BenjiThatFoxGuy
// @match        *://*.vrcw.net/*
// @grant        none
// @license MIT
// @updateURL    https://updates.benjifox.gay/vrcw.net.meta.js
// @downloadURL  https://updates.benjifox.gay/vrcw.net.user.js
// ==/UserScript==


(function() {
    'use strict';

    // --- Config: Pick link type ---
    // 'vrcx' for vrcx://world/{id}, 'vrchat' for vrchat://launch?ref=vrcx.app&id={id}
    let linkType = localStorage.getItem('vrcw_link_type') || 'vrcx';
    if (!localStorage.getItem('vrcw_link_type')) {
        linkType = prompt('Which link type do you want to use for world links? (vrcx/vrchat)', 'vrchat') || 'vrchat';
        linkType = linkType.toLowerCase() === 'vrchat' ? 'vrchat' : 'vrcx';
        localStorage.setItem('vrcw_link_type', linkType);
    }

    // Add a button to toggle link type
    function addToggleButton() {
        if (document.getElementById('vrcw-link-toggle')) return;
        const btn = document.createElement('button');
        btn.id = 'vrcw-link-toggle';
        btn.textContent = 'Switch to ' + (linkType === 'vrcx' ? 'VRChat' : 'VRCX') + ' links';
        btn.style.position = 'fixed';
        btn.style.bottom = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.padding = '6px 12px';
        btn.style.background = '#222';
        btn.style.color = '#fff';
        btn.style.border = '1px solid #888';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.onclick = function() {
            linkType = linkType === 'vrcx' ? 'vrchat' : 'vrcx';
            localStorage.setItem('vrcw_link_type', linkType);
            btn.textContent = 'Switch to ' + (linkType === 'vrcx' ? 'VRChat' : 'VRCX') + ' links';
            // Re-run replacement
            findAndReplaceWorldIds(document.body, true);
        };
        document.body.appendChild(btn);
    }

    const worldIdRegex = /wrld_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

    function makeLink(match) {
        if (linkType === 'vrchat') {
            // Default: join in-game (no &launch=1)
            return `<a href="vrchat://launch?ref=vrcx.app&id=${match}" style="color: inherit; text-decoration: underline;">${match}</a>`;
        } else {
            return `<a href="vrcx://world/${match}" style="color: inherit; text-decoration: underline;">${match}</a>`;
        }
    }

    function processTextNode(node) {
        const text = node.textContent;
        if (worldIdRegex.test(text)) {
            const span = document.createElement('span');
            span.innerHTML = text.replace(worldIdRegex, makeLink);
            node.parentNode.replaceChild(span, node);
        }
    }

    function findAndReplaceWorldIds(root, rerun) {
        // If rerun, remove all previous spans
        if (rerun) {
            document.querySelectorAll('span[data-vrcw-link-replaced]').forEach(span => {
                if (span.childNodes.length === 1 && span.childNodes[0].nodeType === Node.TEXT_NODE) {
                    span.replaceWith(span.childNodes[0]);
                }
            });
        }
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return worldIdRegex.test(node.textContent) ? 
                        NodeFilter.FILTER_ACCEPT : 
                        NodeFilter.FILTER_REJECT;
                }
            }
        );
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
            const text = node.textContent;
            if (worldIdRegex.test(text)) {
                const span = document.createElement('span');
                span.setAttribute('data-vrcw-link-replaced', '1');
                span.innerHTML = text.replace(worldIdRegex, makeLink);
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    // Process existing content
    findAndReplaceWorldIds(document.body);
    addToggleButton();

    // Watch for dynamic content changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    findAndReplaceWorldIds(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
