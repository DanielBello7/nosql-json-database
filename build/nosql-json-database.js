"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ensure_error_1 = __importDefault(require("./ensure-error"));
class Database {
    constructor() {
        this.getCollectionFilePath = (modelFolderLocation, modelName) => {
            try {
                const correct = modelName.toLowerCase();
                return path_1.default.join(modelFolderLocation, `${correct}.json`);
            }
            catch (error) {
                const err = (0, ensure_error_1.default)(error);
                const msg = `error getting model file path - ${err.message}`;
                throw new Error(msg);
            }
        };
        this.checkIfFolderExists = (folderLocation) => {
            try {
                fs_1.default.accessSync(folderLocation, fs_1.default.constants.F_OK);
                return true;
            }
            catch (error) {
                return false;
            }
        };
        this.checkIfCollectionExists = (location, modelName) => {
            try {
                const locationURL = this.getCollectionFilePath(location, modelName);
                return fs_1.default.existsSync(locationURL);
            }
            catch (error) {
                const err = (0, ensure_error_1.default)(error);
                const msg = `error checking if model exists - ${err.message}`;
                throw new Error(msg);
            }
        };
        this.createDatabaseFile = (fileURL) => {
            try {
                const result = fs_1.default.existsSync(fileURL);
                if (!result) {
                    fs_1.default.writeFileSync(fileURL, JSON.stringify([], null, 3));
                }
            }
            catch (error) {
                const err = (0, ensure_error_1.default)(error);
                const msg = `error creating database file - ${err.message}`;
                throw new Error(msg);
            }
        };
        this.createCollectionFile = (location, modelName) => {
            try {
                const filename = modelName.toLowerCase();
                const file = this.getCollectionFilePath(location, filename);
                this.createDatabaseFile(file);
            }
            catch (error) {
                const err = (0, ensure_error_1.default)(error);
                const msg = `error creating model file - ${err.message}`;
                throw new Error(msg);
            }
        };
        this.writeIntoCollectionFile = (location, model, data) => {
            try {
                const writeLocation = this.getCollectionFilePath(location, model);
                fs_1.default.writeFileSync(writeLocation, JSON.stringify(data, null, 3));
            }
            catch (error) {
                const err = (0, ensure_error_1.default)(error);
                const msg = `error writing into file - ${err.message}`;
                throw new Error(msg);
            }
        };
        this.readFromCollectionFile = (modelFolderLocation, modelName) => {
            const fileURL = this.getCollectionFilePath(modelFolderLocation, modelName);
            const fileContents = fs_1.default.readFileSync(fileURL, "utf-8").trim();
            try {
                if (!fileContents) {
                    this.writeIntoCollectionFile(modelFolderLocation, modelName, []);
                    return [];
                }
                const parsed = JSON.parse(fileContents);
                if (!Array.isArray(parsed)) {
                    this.writeIntoCollectionFile(modelFolderLocation, modelName, []);
                    return [];
                }
                else
                    return parsed;
            }
            catch (error) {
                const err = (0, ensure_error_1.default)(error);
                const msg = `error writing into file - ${err.message}`;
                if (err.message.includes("Unexpected non-whitespace character after JSON at position")) {
                    const a = fileContents.indexOf("]");
                    const managedContents = fileContents.slice(0, a + 1);
                    if (!Array.isArray(JSON.parse(managedContents))) {
                        this.writeIntoCollectionFile(modelFolderLocation, modelName, []);
                        return [];
                    }
                    else {
                        this.writeIntoCollectionFile(modelFolderLocation, modelName, JSON.parse(managedContents));
                        return JSON.parse(managedContents);
                    }
                }
                else
                    throw new Error(msg);
            }
        };
    }
}
exports.default = Database;
