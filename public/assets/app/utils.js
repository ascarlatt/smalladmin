'use strict';

/**
 * Utility class providing helper functions for common operations.
 */
export default class Utils {
    /**
     * Displays a Bootstrap toast notification with a specified message and optional title.
     *
     * @param {string} message The message to display in the toast notification.
     * @param {string} [title='Error'] The title to display in the toast header. Defaults to 'Error'.
     * @return {null} Returns null after displaying the toast notification.
     */
    static toast(message, title = 'Error') {
        document.querySelector('#toast .toast-header strong').innerHTML = title;
        document.querySelector('#toast .toast-body').innerHTML = message;
        bootstrap.Toast.getOrCreateInstance(document.querySelector('#toast')).show();
        return null;
    }

    /**
     * Escapes HTML special characters in a string to their corresponding HTML entities.
     *
     * @param {string} unsafe - The input string that may contain HTML special characters.
     * @return {string} A new string with HTML special characters escaped.
     */
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
