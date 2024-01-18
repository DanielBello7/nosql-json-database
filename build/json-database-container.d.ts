import type { JsonDatabaseContainer } from "./index.types";
import JsonDatabaseCollection from "./json-database-collection";
import Database from "./json-database";
export default class Container extends Database implements JsonDatabaseContainer {
    protected loc?: string;
    collections: string[];
    folderLocation: string;
    constructor(location?: string);
    /**
     * checks for all current database collections within memory
     */
    protected checkForDatabaseCollections: () => void;
    /**
     * reset the whole database container, by deleting all the collections contained
     * within the container
     */
    resetDatabase: () => void;
    /**
     * delete the database entirely and remove all the contents of the container
     */
    deleteDatabase: () => void;
    /**
     * create the database container, if the container doesnt exist
     * if it does it doesn't perform anything
     */
    createDatabase: () => void;
    /**
     * delete a particular collection within the database container and remove all the contents
     * @param title string
     */
    deleteCollection: (title: typeof this.collections[number]) => void;
    /**
     * takes the title and creates a new collection within the particular database
     * this adds the value to the collections list within the database
     * @param name string
     * @returns JsonDatabaseCollection<T>
     */
    createCollection: <T extends Record<string, unknown>>(name: string) => JsonDatabaseCollection<T>;
}
