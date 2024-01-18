"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_object_1 = require("./update-object");
const uuid_1 = require("uuid");
const nosql_json_database_1 = __importDefault(require("./nosql-json-database"));
const update_object_2 = __importDefault(require("./update-object"));
class Collection extends nosql_json_database_1.default {
    /**
     * constructor for creating a new collection for the database being specified
     * @param title string. The title of the model to be created. Would also be the filename of the model collection being created
     * @param database JsonDatabase. The database container for the collection.
     */
    constructor(title, databaseContainer) {
        super();
        /**
         * generates an identifier for the object being added to the database
         * @returns string
         */
        this.generateId = () => {
            const id = `json://${this.collectionTitle}.${(0, uuid_1.v4)()}`;
            return id;
        };
        /**
         * checks if a string was actually created by this json-database
         * @param id string
         * @returns { _id: string; collection: string; uuid: string }
         */
        this.confirmId = (id) => {
            const states = id.split("://");
            if (![2].includes(states.length) || states[0] !== "json")
                throw new Error("id not a json-database id");
            const idSplit = states[1].split(".");
            if (![2].includes(idSplit.length))
                throw new Error("id not a json-database id");
            if (!(0, uuid_1.validate)(idSplit[1]))
                throw new Error("id not a json-database id");
            return {
                _id: id,
                collection: idSplit[0],
                uuid: idSplit[1]
            };
        };
        /**
         * Populates a selected field with its actual data from another collection
         * @param data Record<string, unknown>
         * @param populatePath string
         * @returns Record<string, unknown>
         */
        this.populate = (data, populatePath) => {
            const flattened = (0, update_object_1.flattenObject)(data);
            if (!Object.keys(flattened).includes(populatePath))
                return data;
            const id = flattened[populatePath];
            if (typeof id !== "string")
                throw new Error("type of specified path value should be string");
            const checkId = this.confirmId(id);
            if (!this.collectionContainer.collections.includes(checkId.collection))
                throw new Error("collection currently not available");
            const getPopulateCollectionData = this.readFromCollectionFile(this.collectionFolder, checkId.collection);
            const findSelected = getPopulateCollectionData.find((item) => item._id === checkId._id);
            const fixed = (0, update_object_1.unflattenObject)(Object.assign(Object.assign({}, flattened), { [populatePath]: findSelected }));
            return fixed;
        };
        /**
         * method for getting all the documents within a specific collection. returns data based on filter whenever a filter is added
         * @param data Partial<JsonDatabaseDocumentType<T>>
         * @returns JsonDatabaseDocumentType<T>[]
         */
        this.find = (data) => {
            const files = this.readFromCollectionFile(this.collectionContainer.folderLocation, this.collectionTitle);
            if (data) {
                const filtered = files.filter((item) => {
                    const confirmation = Object.keys(data).every(obj1 => {
                        return data[obj1] === item[obj1];
                    });
                    if (confirmation)
                        return item;
                });
                return filtered;
            }
            else
                return files;
        };
        /**
         * method for getting all the documents within a collection and populating them with data stored in another collection under
         * the same database container. expects a data parameter which consist of the field name to be populated and the model of the populating collection.
         * @param data {field: string; model: string}
         * @returns JsonDatabaseDocumentType<T>[]
         */
        this.findAndPopulate = (populatedPath) => {
            const data = this.find();
            const populated = data.map((item) => {
                if (typeof populatedPath === "string") {
                    const result = this.populate(item, populatedPath);
                    return result;
                }
                else {
                    let result = item;
                    for (let i = 0; i < populatedPath.length; i++)
                        result = this.populate(result, populatedPath[i]);
                    return result;
                }
            });
            return populated;
        };
        /**
         * method for finding a single document within a collection. uses the filter provided to search
         * Returns the first document matching what was found
         * @param value Partial<T>
         * @returns JsonDatabaseDocumentType<T> | undefined
         */
        this.findOne = (value) => {
            const data = this.find();
            const selected = data.find((item) => {
                const confirmation = Object.keys(value).every(obj1 => {
                    return value[obj1] === item[obj1];
                });
                if (confirmation)
                    return item;
            });
            return selected;
        };
        /**
         * uses the filter provided to find one document and populates it with data from another document. expects the data parameter
         * to contian the field of the to be populated data containing the id of the populating document and the model of the collection to be searched
         * @param value Partial<T>
         * @param data
         * @returns { field: string; model: string }
         */
        this.findOneAndPopulate = (value, populatedPath) => {
            const selectedData = this.findOne(value);
            if (!selectedData)
                return undefined;
            if (typeof populatedPath === "string") {
                const result = this.populate(selectedData, populatedPath);
                return result;
            }
            else {
                let result = selectedData;
                for (let i = 0; i < populatedPath.length; i++)
                    result = this.populate(result, populatedPath[i]);
                return result;
            }
        };
        /**
         * finds one document using the id of the document
         * @param id string
         * @returns JsonDatabaseDocumentType<T> | undefined
         */
        this.findOneById = (id) => {
            if (typeof id !== "string")
                throw new Error("type of id should be a string");
            const documents = this.find();
            const document = documents.find((item) => item._id === id);
            return document;
        };
        /**
         * uses the id provided to find one document and populates it with data from another document. expects the data parameter
         * to contian the field of the to be populated data containing the id of the populating document and the model of the collection to be searched
         * @param id string
         * @param data { field: string; model: string }
         * @returns JsonDatabaseDocumentType<T> | undefined
         */
        this.findOneByIdAndPopulate = (id, populatedPath) => {
            const selectedData = this.findOneById(id);
            if (!selectedData)
                return undefined;
            if (typeof populatedPath === "string") {
                const result = this.populate(selectedData, populatedPath);
                return result;
            }
            else {
                let result = selectedData;
                for (let i = 0; i < populatedPath.length; i++)
                    result = this.populate(result, populatedPath[i]);
                return result;
            }
        };
        /**
         * inserts one document into the collection
         * @param data T
         * @returns JsonDatabaseDocumentType<T>
         */
        this.addOne = (data) => {
            if (typeof data !== "object")
                throw new Error("type object required");
            const response = this.find();
            const newDoc = Object.assign(Object.assign({ _id: this.generateId() }, data), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, [...response, newDoc]);
            return newDoc;
        };
        /**
         * inserts multiple documents at once into a collection and returns the proper documents after being saved
         * in the database
         * @param data T[]
         * @returns JsonDatabaseDocumentType<T>[]
         */
        this.addMany = (data) => {
            const response = data.map((item) => {
                return this.addOne(item);
            });
            return response;
        };
        /**
         * deletes document from the collection using the id of the document to be deleted
         * @param id string
         */
        this.deleteOneUsingId = (id) => {
            if (typeof id !== "string")
                throw new Error('string required');
            const data = this.find();
            const updatedDocs = data.filter((item) => item._id !== id);
            this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, updatedDocs);
        };
        /**
         * updates a document with the provided values using the id. keys of _id, updatedAt and createdAt cannot be updated
         * @param id string
         * @param updates Partial<T>
         * @returns JsonDatabaseDocumentType<T>
         */
        this.updateOneUsingId = (id, updates) => {
            if (typeof id !== "string")
                throw new Error("type of id should be a string");
            if (typeof updates !== "object")
                throw new Error("type of updates should be an object");
            const updatedData = this.find().map((item) => {
                if (item._id !== id)
                    return item;
                const updated = (0, update_object_2.default)(item, updates);
                const { _id, createdAt } = updated, rest = __rest(updated, ["_id", "createdAt"]);
                item = Object.assign(Object.assign(Object.assign({}, item), rest), { updatedAt: new Date().toISOString() });
                return item;
            });
            this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, updatedData);
            const item = updatedData.find((item) => item._id === id);
            if (item)
                return item;
            throw new Error("error occured getting document");
        };
        /**
         * resets the model collection and clears all data
         */
        this.resetModel = () => {
            this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, []);
        };
        this.collectionContainer = databaseContainer;
        this.collectionTitle = title;
        this.collectionFolder = databaseContainer.folderLocation;
        this.createCollectionFile(this.collectionContainer.folderLocation, title);
    }
}
exports.default = Collection;
