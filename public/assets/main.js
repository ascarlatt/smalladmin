'use strict';

import display from "./app/display.js";

/**
 * Initialize all the display items
 */
display.init();

/**
 * Show the login form, as only the host and user are stored in State and password
 * needs to be added by user
 */
bootstrap.Modal.getOrCreateInstance(document.querySelector('#login')).show();

/**
 * Prevent the user from leaving the page
 * TODO: implement a history mechanism
 */
window.addEventListener('beforeunload', e => e.preventDefault());

/**
 * Setup the tooltips
 */
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

/**
 * Setup the generic queries
 */
document.querySelectorAll('#server-info [data-query]').forEach(el => {
    el.addEventListener('click', () => display.quickQuery(el));
});

/**
 * I don't know a better way to make this crap full height and scrollable
 */
window.addEventListener('resize', () => {
    document.querySelector('#sidebar').style.maxHeight = window.innerHeight + 'px';
});
window.dispatchEvent(new Event('resize'));

/**
 * Register keyboard shortcuts
 */
document.addEventListener('keyup', e => {
    if (e.altKey && e.key == 'Enter') {
        e.preventDefault();
        display.runQuery();
        return;
    }
});
