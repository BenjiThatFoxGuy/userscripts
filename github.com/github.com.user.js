// ==UserScript==
// @name         GitHub Quick Import
// @namespace    au.benjithatfoxguy.github.com
// @version      0.3.0
// @description  Adds an Import button on GitHub repos and pre-fills the import flow
// @author       BenjiThatFoxGuy
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @updateURL    https://updates.benjifox.gay/github.com.meta.js
// @downloadURL  https://updates.benjifox.gay/github.com.user.js
// ==/UserScript==

(function() {
    'use strict';

    const IMPORT_PARAM = 'source_url';
    const BUTTON_ID = 'gh-quick-import-btn';

    function setReactInputValue(input, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(input, value);

        const events = [
            new Event('input', { bubbles: true }),
            new Event('change', { bubbles: true }),
            new Event('blur', { bubbles: true })
        ];

        events.forEach(event => input.dispatchEvent(event));
    }

    function isRepositoryPage() {
        const pathParts = location.pathname.split('/').filter(Boolean);
        if (pathParts.length < 2) {
            return false;
        }

        const reserved = new Set([
            'about', 'account', 'codespaces', 'collections', 'contact', 'customer-stories',
            'dashboard', 'enterprise', 'events', 'explore', 'features', 'gist', 'home',
            'issues', 'login', 'marketplace', 'new', 'notifications', 'organizations',
            'orgs', 'pricing', 'pulls', 'search', 'security', 'settings', 'signup', 'sponsors',
            'team', 'topics', 'trending', 'users'
        ]);

        return !reserved.has(pathParts[0]);
    }

    function buildRepoUrl() {
        const pathParts = location.pathname.split('/').filter(Boolean);
        return `${location.origin}/${pathParts[0]}/${pathParts[1]}`;
    }

    function createImportButton(repoUrl) {
        const anchor = document.createElement('a');
        anchor.id = BUTTON_ID;
        anchor.className = 'btn btn-sm';
        anchor.href = `/new/import?${IMPORT_PARAM}=${encodeURIComponent(repoUrl)}`;
        anchor.textContent = 'Import/Private Fork';
        anchor.setAttribute('data-turbo', 'false');
        anchor.setAttribute('aria-label', 'Import this repository into a new repository');

        const li = document.createElement('li');
        li.appendChild(anchor);
        return li;
    }

    function findPageheadActions() {
        return document.querySelector('ul.pagehead-actions, div.pagehead-actions ul, div.AppHeader-actions ul');
    }

    function insertButtonIntoActions() {
        if (!isRepositoryPage()) {
            return;
        }

        const actions = findPageheadActions();
        if (!actions || actions.querySelector(`#${BUTTON_ID}`)) {
            return;
        }

        const repoUrl = buildRepoUrl();
        const newButtonLi = createImportButton(repoUrl);

        const actionItems = Array.from(actions.children).filter((node) => node.tagName === 'LI');

        const starItem = actionItems.find((item) => /\bStar\b/i.test(item.textContent || ''));
        const forkItem = actionItems.find((item) => /\bFork\b/i.test(item.textContent || ''));

        if (starItem && forkItem && starItem.nextSibling) {
            actions.insertBefore(newButtonLi, forkItem);
            return;
        }

        if (starItem && starItem.nextSibling) {
            actions.insertBefore(newButtonLi, starItem.nextSibling);
            return;
        }

        if (forkItem) {
            actions.insertBefore(newButtonLi, forkItem);
            return;
        }

        actions.appendChild(newButtonLi);
    }

    function findImportUrlInput() {
        return document.querySelector(
            '#_r_2_, input[name="vcs_url"], input[name*="vcs" i], input[type="url"]'
        );
    }

    function getRepoNameFromUrl(sourceUrl) {
        try {
            const parsed = new URL(sourceUrl);
            const parts = parsed.pathname.split('/').filter(Boolean);
            if (parts.length < 2) {
                return '';
            }

            return parts[1].replace(/\.git$/i, '');
        } catch {
            return '';
        }
    }

    function findRepositoryNameInput() {
        return document.querySelector(
            '#repository-name-input, input[name="repository[name]"], input[name="repository_name"], input[aria-label*="Repository name" i]'
        );
    }

    function findPrivateVisibilityControl() {
        return document.querySelector(
            '#_r_10_, input[name="repository[visibility]"][value="private"], input[name="visibility"][value="private"], input[type="radio"][value="private"]'
        );
    }

    function fillImportUrlFromParam() {
        if (location.pathname !== '/new/import') {
            return;
        }

        const sourceUrl = new URLSearchParams(location.search).get(IMPORT_PARAM);
        if (!sourceUrl) {
            return;
        }

        const repoName = getRepoNameFromUrl(sourceUrl);

        const tryFill = () => {
            const importUrlInput = findImportUrlInput();
            const repositoryNameInput = findRepositoryNameInput();
            const privateVisibilityControl = findPrivateVisibilityControl();

            if (!importUrlInput) {
                return false;
            }

            if (importUrlInput.value !== sourceUrl) {
                setReactInputValue(importUrlInput, sourceUrl);
            }

            if (repositoryNameInput && repoName && repositoryNameInput.value !== repoName) {
                setReactInputValue(repositoryNameInput, repoName);
            }

            if (privateVisibilityControl && !privateVisibilityControl.checked) {
                privateVisibilityControl.click();
                privateVisibilityControl.dispatchEvent(new Event('input', { bubbles: true }));
                privateVisibilityControl.dispatchEvent(new Event('change', { bubbles: true }));
            }

            return true;
        };

        if (tryFill()) {
            return;
        }

        const observer = new MutationObserver(() => {
            if (tryFill()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => observer.disconnect(), 10000);
    }

    function run() {
        insertButtonIntoActions();
        fillImportUrlFromParam();
    }

    run();
    document.addEventListener('turbo:load', run);
})();
