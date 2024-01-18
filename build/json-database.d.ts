import type { JsonDatabaseDocument } from "./index.types";
export default class Database {
    constructor();
    protected getCollectionFilePath: (modelFolderLocation: string, modelName: string) => string;
    protected checkIfFolderExists: (folderLocation: string) => boolean;
    protected checkIfCollectionExists: (location: string, modelName: string) => boolean;
    protected getFunctionCallingLocation: () => string;
    protected createDatabaseFile: (fileURL: string) => void;
    protected createCollectionFile: (location: string, modelName: string) => void;
    protected writeIntoCollectionFile: <T extends object>(location: string, model: string, data: T) => void;
    protected readFromCollectionFile: <T extends Record<string, unknown>>(modelFolderLocation: string, modelName: string) => JsonDatabaseDocument<T>[];
}
