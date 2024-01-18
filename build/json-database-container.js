"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_database_collection_1 = __importDefault(require("./json-database-collection"));
const pluralize_1 = __importDefault(require("pluralize"));
const fs_1 = __importDefault(require("fs"));
const json_database_1 = __importDefault(require("./json-database"));
const path_1 = __importDefault(require("path"));
class Container extends json_database_1.default {
    constructor(location) {
        super();
        this.collections = [];
        /**
         * checks for all current database collections within memory
         */
        this.checkForDatabaseCollections = () => {
            const files = fs_1.default.readdirSync(this.folderLocation);
            const titles = files.map((item) => item.split(".")[0]);
            this.collections = [...new Set([...this.collections, ...titles])];
        };
        /**
         * reset the whole database container, by deleting all the collections contained
         * within the container
         */
        this.resetDatabase = () => {
            try {
                const files = fs_1.default.readdirSync(this.folderLocation);
                for (const file in files) {
                    const item = files[file];
                    const filepath = path_1.default.join(this.folderLocation, item);
                    fs_1.default.unlinkSync(filepath);
                }
                this.collections = [];
            }
            catch (error) {
                throw error;
            }
        };
        /**
         * delete the database entirely and remove all the contents of the container
         */
        this.deleteDatabase = () => {
            this.resetDatabase();
            fs_1.default.rmdirSync(this.folderLocation);
        };
        /**
         * create the database container, if the container doesnt exist
         * if it does it doesn't perform anything
         */
        this.createDatabase = () => {
            const folder = this.folderLocation;
            if (!this.checkIfFolderExists(folder))
                fs_1.default.mkdirSync(folder);
            this.checkForDatabaseCollections();
        };
        /**
         * delete a particular collection within the database container and remove all the contents
         * @param title string
         */
        this.deleteCollection = (title) => {
            const modelpath = this.getCollectionFilePath(this.folderLocation, title);
            fs_1.default.unlinkSync(modelpath);
            this.collections = this.collections.filter((item) => item !== title);
        };
        /**
         * takes the title and creates a new collection within the particular database
         * this adds the value to the collections list within the database
         * @param name string
         * @returns JsonDatabaseCollection<T>
         */
        this.createCollection = (name) => {
            const corrected = (0, pluralize_1.default)(name);
            const newCollection = new json_database_collection_1.default(corrected, this);
            if (!this.collections.includes(corrected))
                this.collections.push(corrected);
            return newCollection;
        };
        if (location) {
            this.loc = location;
            const folder = path_1.default.join(location, "/database");
            this.folderLocation = folder;
        }
        else {
            const folderPath = this.getFunctionCallingLocation();
            const foldername = path_1.default.join(folderPath, "/database");
            this.folderLocation = foldername;
        }
        this.createDatabase();
    }
}
exports.default = Container;
