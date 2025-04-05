'use strict';

import state from "./state.js";
import queryService from "./query.js";
import Utils from "./utils.js";

/**
 * Represents the Display class, which handles the initialization and interaction
 * with the application interface. It is responsible for managing database connections,
 * login credentials, user settings, and displaying databases and tables. This class
 * also provides functionality for executing and displaying SQL queries.
 */
class Display {

    static quickQueries = {
        describe: 'DESCRIBE {table}',
        selectAll: 'SELECT * FROM {table}',
        select100: 'SELECT * FROM {table} LIMIT 100',
        selectCount: 'SELECT COUNT(*) from {table}',
        showFullColumns: 'SHOW FULL COLUMNS FROM {table}',
        showIndex: 'SHOW INDEX FROM {table}',
        showCreate: 'SHOW CREATE TABLE {table}',
        showGrants: 'SHOW GRANTS',
        showProcesslist: 'SHOW PROCESSLIST',
        showVariables: 'SHOW VARIABLES',
        showGlobalVariables: 'SHOW GLOBAL VARIABLES',
    };

    /**
     * Initializes the application by setting up credentials, login form, database selection, and settings.
     * Also attaches the event listener for the SQL run button to execute queries.
     *
     * @return {Promise<void>} A promise that resolves when the initialization process is complete.
     */
    async init() {
        this.initCredentials();
        this.initLoginForm();
        this.initDatabaseSelect();
        this.initSettings();
        document.querySelector('#sql-run').addEventListener('click', () => this.runQuery());
    }

    /**
     * Put the stored credentials in the form and focus on the password field
     */
    async initCredentials() {
        if (state.credentials.host || state.credentials.user) {
            document.querySelector('#login-host').value = state.credentials.host;
            document.querySelector('#login-user').value = state.credentials.user;
            document.querySelector('#login').addEventListener('shown.bs.modal', () => {
                document.querySelector('#login-pass').focus();
            });
        }
    }

    /**
     * Retrieves the credentials entered by the user in the login form.
     * The method extracts the values for host, user, and password from
     * the respective input fields in the document.
     *
     * @return {Object} An object containing:
     * - `host`: The value of the input field with the ID 'login-host'.
     * - `user`: The value of the input field with the ID 'login-user'.
     * - `pass`: The value of the input field with the ID 'login-pass'.
     */
    getCredentials() {
        return {
            host: document.querySelector('#login-host').value,
            user: document.querySelector('#login-user').value,
            pass: document.querySelector('#login-pass').value,
        }
    }

    /**
     * Handles the submission of the login form, prevents default behavior,
     * collects entered credentials, attempts to connect to the server by
     * executing a query, updates the application state on success, and hides
     * the login modal.
     */
    async initLoginForm() {
        document.querySelector('#login-form').addEventListener('submit', ev => {
            ev.preventDefault();
            document.querySelector('#login-form button').disabled = 'disabled';
            const credentials = this.getCredentials();
            queryService.loadDatabases(credentials).then(databases => {
                document.querySelector('#login-form button').disabled = '';

                if (databases === null) {
                    return;
                }

                /** Save credentials for next time */
                state.credentials.host = credentials.host;
                state.credentials.user = credentials.user;

                /** Save server info */
                state.server.databases = databases;
                state.server.tables = [];
                state.server.connected = true;

                /** Persist configuration in the local storage */
                state.save();

                this.showDatabases();

                if (state.server.database) {
                    document.querySelector('#database').value = state.server.database;
                    document.querySelector('#database').dispatchEvent(new Event('change'));
                }

                /** Hide the login modal */
                bootstrap.Modal.getInstance(document.querySelector('#login')).hide();
            });
        });
    }

    /**
     * Initializes the settings UI by syncing the input elements' states with the application's behavior state.
     * Listens for changes in the setting inputs to update the state and save the changes.
     *
     * @return {void} This method does not return a value.
     */
    initSettings() {
        document.querySelectorAll('#settings input').forEach(element => {
            element.checked = state.behavior[element.id];
            element.addEventListener('change', () => {
                state.behavior[element.id] = element.checked;
                state.save();
            })
        });
        document.querySelector('#defaultClickAction').value = state.behavior.defaultClickAction;
        document.querySelector('#defaultClickAction').addEventListener('change', e => {
            state.behavior.defaultClickAction = e.target.value;
            state.save();
        });
    }

    /**
     * Initializes the database selection mechanism by attaching an event listener
     * to the database dropdown element. Whenever the database selection is changed,
     * it updates the application state, fetches the tables for the selected database,
     * and displays them.
     *
     * @return {void} This method does not return a value.
     */
    initDatabaseSelect() {
        document.querySelector('#database').addEventListener('change', ev => {
            state.server.database = ev.target.value;
            state.save();
            if (state.server.database == '') {
                document.querySelector('#tables').innerHTML = '';
                return;
            }
            queryService.loadTables(this.getCredentials(), state.server.database).then(tables => {
                if (tables === null) {
                    return;
                }
                state.server.tables = tables;
                state.save();
                this.showTables();
            });
        });
    }

    /**
     * Populates the database selection dropdown with the list of databases.
     * Clears any previously listed options, leaving only the default option,
     * and then adds new options based on the available databases in the server state.
     *
     * @return {void} This method does not return anything.
     */
    showDatabases() {
        document.querySelector('#database').options.length = 1;
        for (const db of state.server.databases) {
            document.querySelector('#database').options.add(new Option(db, db));
        }
    }

    /**
     * Displays the list of database tables in the UI. If no tables are available,
     * a message indicating the absence of tables is shown. For each table, a set
     * of actions is rendered as interactive buttons with dropdown options.
     *
     * @return {void} This method does not return a value.
     */
    showTables() {
        if (state.server.tables.length === 0) {
            document.querySelector('#tables').innerHTML = 'No tables in current database';
            return;
        }
        document.querySelector('#tables').innerHTML = '';
        let html = '';
        for (const table of state.server.tables) {
            const etable = Utils.escapeHtml(table);
            html +=
                '<div class="btn-group my-1 w-100" role="group" aria-label="Table">' +
                '<button type="button" class="btn btn-outline-light" data-table="' + etable + '">' + etable + '</button>' +
                '<button type="button" class="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">' +
                '<span class="visually-hidden">Toggle Dropdown</span>' +
                '</button>' +
                '<ul class="dropdown-menu dropdown-menu-end">' +
                '<li class="dropdown-item" data-query="describe" data-table="' + etable + '">DESCRIBE</li>' +
                '<li class="dropdown-item" data-query="selectAll" data-table="' + etable + '">SELECT *</li>' +
                '<li class="dropdown-item" data-query="select100" data-table="' + etable + '">SELECT * LIMIT 100</li>' +
                '<li class="dropdown-item" data-query="selectCount" data-table="' + etable + '">SELECT COUNT(*)</li>' +
                '<li class="dropdown-item" data-query="showFullColumns" data-table="' + etable + '">SHOW FULL COLUMNS</li>' +
                '<li class="dropdown-item" data-query="showIndex" data-table="' + etable + '">SHOW INDEX</li>' +
                '<li class="dropdown-item" data-query="showCreate" data-table="' + etable + '">SHOW CREATE</li>' +
                '</ul>' +
                '</div>'
        }
        document.querySelector('#tables').innerHTML = html;

        // setup events
        document.querySelectorAll('#tables [data-table]').forEach(btn => {
            btn.addEventListener('click', e => this.quickQuery(e.target));
        }, this);
    }

    /**
     * Executes a quick query action based on the data attributes of the provided element.
     *
     * @param {HTMLElement} element The HTML element that contains the query configuration in its dataset properties.
     * The dataset should include `query` for the action key and optionally `table` for the table name.
     *
     * @return {boolean} Returns `false` to prevent the default action.
     * If the quick query action is not defined, a toast notification is displayed indicating an error.
     */
    quickQuery(element) {
        let action = element.dataset.query;
        if (!action) {
            if (state.behavior.defaultClickAction === '') {
                return;
            }
            action = state.behavior.defaultClickAction;
        }
        if (!Display.quickQueries[action]) {
            return Utils.toast('No quick query for action ' + action + ' available', 'Error');
        }
        let table = element.dataset.table;
        if (state.behavior.backticks) {
            table = '`' + table + '`';
        }
        document.querySelector('#sql-editor').value = Display.quickQueries[action].replace('{table}', table) + ';';
        if (action !== 'selectAll') {
            document.querySelector('#sql-run').dispatchEvent(new Event('click'));
        }
        return false; // poor man's preventDefault()
    }

    /**
     * Toggles the state of the query submit button based on the provided status.
     *
     * @param {string} status - The status of the submit button, expected values are 'active' or any other value to toggle states.
     * @return {void} This method does not return a value.
     */
    toggleQuerySubmitButton(status) {
        if (status === 'active') {
            document.querySelector('#sql-run').disabled = '';
            document.querySelector('#sql-run').nextElementSibling.classList.add('d-none');
        } else {
            document.querySelector('#sql-run').disabled = 'disabled';
            document.querySelector('#sql-run').nextElementSibling.classList.remove('d-none');
        }
    }

    /**
     * Executes the SQL query provided in the editor, processes the result, and displays the outcome in the results section.
     *
     * The method retrieves the SQL query from the designated editor input element. If the query is empty, no operation is performed.
     * Otherwise, it clears the previous results (if configured to do so), disables the query submission button during execution,
     * and invokes the query service to execute the query against the database. Once the query execution is completed,
     * it re-enables the submit button and processes the results. Depending on the outcome, it formats and displays the appropriate result
     * (successful rows, affected rows, or errors) in a structured table.
     *
     * @return {void} This method does not return a value. The query results, errors, or affected rows are directly rendered in the results section on the page.
     */
    runQuery() {
        const query = document.querySelector('#sql-editor').value;
        if (query === '') {
            return;
        }
        if (!state.behavior.keepPreviousResults) {
            document.querySelector('#sql-results').innerHTML = '';
        }
        this.toggleQuerySubmitButton('disabled');
        const runStart = new Date();
        queryService.run(this.getCredentials(), state.server.database, query).then(result => {
            this.toggleQuerySubmitButton('active');

            // something really bad happened (with the connection or something)
            if (result === null) {
                return;
            }
            let duration = (new Date() - runStart) / 1000; // seconds
            let html = '<table class="table table-striped table-hover table-bordered">';
            html += '<caption class="caption-top font-monospace">' + Utils.escapeHtml(result.query) + '</caption>';
            html += '<caption>' +
                '<pre class="float-end">Transfer Duration: ' + (Math.round(duration * 100) / 100) + ' seconds</pre>' +
                '<pre>Query Duration: ' + (Math.round(result.duration * 100) / 100) + ' seconds</pre>' +
                '</caption>';
            if (result.errno != 0) {
                html += '<thead><tr><th>Error Code</th><th>Error Message</th></tr></thead>';
                html += '<tbody><tr><td class="text-danger-emphasis">' + result.errno + '</td><td class="text-danger-emphasis">' + result.error + '</td></tr></tbody>';
            } else if (result.affected > -1) {
                html += '<thead><tr><th>Affected Rows</th></tr></thead>';
                html += '<tbody><tr><td>' + result.affected + '</td></tr></tbody>';
            } else {
                html += '<thead>';
                html += '<tr>';
                for (const column of result.columns) {
                    html += '<th>' + Utils.escapeHtml(column) + '</th>';
                }
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                for (let i = 0; i < result.rows.length; i++) {
                    html += '<tr title="Row ' + (i + 1) + '">';
                    for (const cell of result.rows[i]) {
                        html += '<td>' + (cell == null ? '<em>NULL</em>' : Utils.escapeHtml(cell)) + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</tbody>';
            }
            html += '</table>';

            document.querySelector('#sql-results').insertAdjacentHTML('afterbegin', html);
        });
    }

}

export default new Display();
