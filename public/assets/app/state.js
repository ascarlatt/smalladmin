'use strict';

/**
 * The State class is responsible for managing application state, including configuration,
 * history, and behavior properties. It supports loading and saving its state to and from
 * localStorage.
 */
class State {
    credentials = {
        host: 'localhost',
        user: '',
    };
    server = {
        databases: [],
        database: '',
        tables: [],
        connected: false,
    };
    history = {
        queries: [],
        maxLength: 100,
        maxAge: 2592000,
        keepDuplicates: false,
    };
    behavior = {
        backticks: true,
        keepPreviousResults: false,
        parallelQueries: 0,
        displayWarnings: true,
        defaultClickAction: 'describe',
    };
    results = {
        maxRows: 50,
        maxRowsBleed: 5,
        keepPrevious: false,
    };

    /**
     * Constructs a new instance of the class and invokes the `load` method
     * to initialize necessary resources or configurations.
     *
     * @return {void} No return value.
     */
    constructor() {
        this.load();
    }

    /**
     * Loads and populates the object's properties with saved data.
     *
     * The method iterates over the object's own properties, retrieves stored
     * data for each property, and updates the properties with the saved values.
     *
     * @return {void} This method does not return a value.
     */
    load() {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                this.loadVar(key);
            }
        }
    }

    /**
     * Loads and parses a JSON object from local storage based on the provided key.
     *
     * @param {string} key - The key used to retrieve the value from local storage.
     * @return {Object} The parsed JSON object retrieved from local storage. If the key does not exist, returns an empty object.
     */
    loadVar(key) {
        const savedData = JSON.parse(localStorage.getItem(key) ?? '{}');
        for (const prop in savedData) {
            this[key][prop] = savedData[prop];
        }
    }

    /**
     * Saves all the properties of the current object by iterating through them
     * and calling the saveVar method for each property.
     *
     * @return {void} Does not return a value.
     */
    save() {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                this.saveVar(key);
            }
        }
    }

    /**
     * Saves the value of the specified key from the current object into the localStorage.
     * The value is serialized into a JSON string before being stored.
     *
     * @param {string} key - The key of the property from the object to save in localStorage.
     * @return {void} Does not return a value.
     */
    saveVar(key) {
        localStorage.setItem(key, JSON.stringify(this[key]));
    }
}

export default new State();
