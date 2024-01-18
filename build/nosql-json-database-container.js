"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nosql_json_database_collection_1 = __importDefault(require("./nosql-json-database-collection"));
const pluralize_1 = __importDefault(require("pluralize"));
const fs_1 = __importDefault(require("fs"));
const nosql_json_database_1 = __importDefault(require("./nosql-json-database"));
const path_1 = __importDefault(require("path"));
class Container extends nosql_json_database_1.default {
    constructor(location) {
        super();
        this.collections = [];
        this.getFunctionCallingLocation = () => {
            var _a;
            function getLocationFromAnonymous() {
                var _a;
                const stack = (_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split("\n");
                for (const line of stack) {
                    if (line.includes('<anonymous>')) {
                        const file = line.split(" (")[1].split(':').slice(0, -2).join(':');
                        return path_1.default.dirname(file);
                    }
                }
                return null;
            }
            function standard() {
                const stack = new Error().stack;
                const callerFile = stack === null || stack === void 0 ? void 0 : stack.split('\n')[2].split(' (')[1].split(':').slice(0, -2).join(':');
                const folderLocation = path_1.default.dirname(callerFile);
                return folderLocation;
            }
            return (_a = getLocationFromAnonymous()) !== null && _a !== void 0 ? _a : standard();
        };
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
            const newCollection = new nosql_json_database_collection_1.default(corrected, this);
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
