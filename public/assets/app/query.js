'use strict';

import Utils from "./utils.js";

/**
 * Provides methods to interact with a database by executing queries and retrieving metadata such as databases or tables.
 * This service communicates with an API endpoint to send and receive data.
 */
class QueryService {
    url = './query'; // the API url

    /**
     * Executes a database query by sending credentials, database details, and a query string
     * to a specified endpoint and handles the response.
     *
     * @param {Object} credentials - The credentials required to connect to the database.
     * @param {string} credentials.host - The hostname of the database server.
     * @param {string} credentials.user - The username for database authentication.
     * @param {string} credentials.pass - The password for database authentication.
     * @param {string} db - The name of the database to query.
     * @param {string} queryString - The query to be executed on the database.
     * @return {Promise<Object>} A promise that resolves to the response object after processing the query or rejects
     *                           with an error message in case of failure.
     */
    async run(credentials, db, queryString) {
        return fetch(this.url, {
            method: 'POST',
            body: new URLSearchParams({
                'credentials[host]': credentials.host,
                'credentials[user]': credentials.user,
                'credentials[pass]': credentials.pass,
                db: db,
                query: queryString
            })
        }).then(response => this.validateResponse(response)).catch(err => Utils.toast(err.message, 'Connection error'));
    }

    /**
     * Loads and retrieves the list of databases using the provided credentials.
     *
     * @param {Object} credentials - The credentials required to connect to the database.
     * @return {Promise<null|string[]>} A promise that resolves to an array of database names if successful, or null if the operation fails.
     */
    async loadDatabases(credentials) {
        return this.run(credentials, '', 'SHOW DATABASES').then(result => {
            if (!result) {
                return null;
            } else if (result.errno > 0) {
                return Utils.toast(result.error, 'SQL Error ' + result.errno);
            }
            const databases = [];
            for (const db of result.rows) {
                databases.push(db[0]);
            }
            return databases;
        })
    }

    /**
     * Loads the list of tables from the specified database.
     *
     * @param {Object} credentials - The credentials required to connect to the database.
     * @param {string} database - The name of the database from which to fetch the tables.
     * @return {Promise<Array<string>|null>} A promise that resolves to an array of table names, or null if no result is found.
     */
    async loadTables(credentials, database) {
        return this.run(credentials, database, 'SHOW TABLES').then(result => {
            if (!result) {
                return null;
            } else if (result.errno > 0) {
                return Utils.toast(result.error, 'SQL Error ' + result.errno);
            }
            const tables = [];
            for (const db of result.rows) {
                tables.push(db[0]);
            }
            return tables;
        });
    }

    /**
     * Checks the response object to validate the content type and parse JSON, handling errors and providing appropriate feedback.
     *
     * @param {Response} response - The response object retrieved from a fetch API call.
     * @return {Promise<Object|undefined>} - Returns a parsed JSON object if the response is valid; otherwise, uses
     *                                       toast to display an error or informational message and returns undefined.
     */
    async validateResponse(response) {
        const contentType = response.headers.get('content-type');
        let json;
        if (contentType && contentType.includes('application/json')) {
            json = await response.json();
        }

        if (!response.ok) {
            if (json && json.error) {
                return Utils.toast(json.error, 'Error');
            }
            return Utils.toast('Server returned ' + response.status + ' ' + response.statusText, 'Bad Response');
        }

        if (!contentType || !contentType.includes('application/json')) {
            return Utils.toast('Server Content-Type is ' + contentType, 'Not a JSON response');
        }

        return json;
    }

}

export default new QueryService();
