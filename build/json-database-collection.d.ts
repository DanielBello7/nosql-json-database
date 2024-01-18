import { JsonDatabaseCollection, JsonDatabaseDocument } from "./index.types";
import Database from "./json-database";
import Container from "./json-database-container";
export default class Collection<T extends Record<string, unknown>> extends Database implements JsonDatabaseCollection<T> {
    private collectionTitle;
    private collectionContainer;
    private collectionFolder;
    /**
     * constructor for creating a new collection for the database being specified
     * @param title string. The title of the model to be created. Would also be the filename of the model collection being created
     * @param database JsonDatabase. The database container for the collection.
     */
    constructor(title: string, databaseContainer: Container);
    /**
     * generates an identifier for the object being added to the database
     * @returns string
     */
    private generateId;
    /**
     * checks if a string was actually created by this json-database
     * @param id string
     * @returns { _id: string; collection: string; uuid: string }
     */
    private confirmId;
    /**
     * Populates a selected field with its actual data from another collection
     * @param data Record<string, unknown>
     * @param populatePath string
     * @returns Record<string, unknown>
     */
    private populate;
    /**
     * method for getting all the documents within a specific collection. returns data based on filter whenever a filter is added
     * @param data Partial<JsonDatabaseDocumentType<T>>
     * @returns JsonDatabaseDocumentType<T>[]
     */
    find: (data?: Partial<JsonDatabaseDocument<T>>) => JsonDatabaseDocument<T>[];
    /**
     * method for getting all the documents within a collection and populating them with data stored in another collection under
     * the same database container. expects a data parameter which consist of the field name to be populated and the model of the populating collection.
     * @param data {field: string; model: string}
     * @returns JsonDatabaseDocumentType<T>[]
     */
    findAndPopulate: (populatedPath: string | string[]) => JsonDatabaseDocument<T>[];
    /**
     * method for finding a single document within a collection. uses the filter provided to search
     * Returns the first document matching what was found
     * @param value Partial<T>
     * @returns JsonDatabaseDocumentType<T> | undefined
     */
    findOne: (value: Partial<JsonDatabaseDocument<T>>) => JsonDatabaseDocument<T> | undefined;
    /**
     * uses the filter provided to find one document and populates it with data from another document. expects the data parameter
     * to contian the field of the to be populated data containing the id of the populating document and the model of the collection to be searched
     * @param value Partial<T>
     * @param data
     * @returns { field: string; model: string }
     */
    findOneAndPopulate: (value: Partial<JsonDatabaseDocument<T>>, populatedPath: string | string[]) => JsonDatabaseDocument<T> | undefined;
    /**
     * finds one document using the id of the document
     * @param id string
     * @returns JsonDatabaseDocumentType<T> | undefined
     */
    findOneById: (id: string) => JsonDatabaseDocument<T> | undefined;
    /**
     * uses the id provided to find one document and populates it with data from another document. expects the data parameter
     * to contian the field of the to be populated data containing the id of the populating document and the model of the collection to be searched
     * @param id string
     * @param data { field: string; model: string }
     * @returns JsonDatabaseDocumentType<T> | undefined
     */
    findOneByIdAndPopulate: (id: string, populatedPath: string | string[]) => JsonDatabaseDocument<T> | undefined;
    /**
     * inserts one document into the collection
     * @param data T
     * @returns JsonDatabaseDocumentType<T>
     */
    addOne: (data: T) => JsonDatabaseDocument<T>;
    /**
     * inserts multiple documents at once into a collection and returns the proper documents after being saved
     * in the database
     * @param data T[]
     * @returns JsonDatabaseDocumentType<T>[]
     */
    addMany: (data: T[]) => JsonDatabaseDocument<T>[];
    /**
     * deletes document from the collection using the id of the document to be deleted
     * @param id string
     */
    deleteOneUsingId: (id: string) => void;
    /**
     * updates a document with the provided values using the id. keys of _id, updatedAt and createdAt cannot be updated
     * @param id string
     * @param updates Partial<T>
     * @returns JsonDatabaseDocumentType<T>
     */
    updateOneUsingId: (id: string, updates: Partial<T>) => JsonDatabaseDocument<T>;
    /**
     * resets the model collection and clears all data
     */
    resetModel: () => void;
}
