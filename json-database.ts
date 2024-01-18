import type { JsonDatabaseDocument } from "./index.types";
import fileService from "fs";
import path from "path";
import ensureError from "./ensure-error";

export default class Database {
  constructor() { }

  protected getCollectionFilePath = (modelFolderLocation: string, modelName: string): string => {
    try {
      const correct = modelName.toLowerCase();
      return path.join(modelFolderLocation, `${correct}.json`);
    } catch (error) {
      const err = ensureError(error);
      const msg = `error getting model file path - ${err.message}`
      throw new Error(msg);
    }
  }

  protected checkIfFolderExists = (folderLocation: string): boolean => {
    try {
      fileService.accessSync(folderLocation, fileService.constants.F_OK);
      return true
    } catch (error) {
      return false
    }
  }

  protected checkIfCollectionExists = (location: string, modelName: string): boolean => {
    try {
      const locationURL = this.getCollectionFilePath(location, modelName);
      return fileService.existsSync(locationURL);
    } catch (error) {
      const err = ensureError(error);
      const msg = `error checking if model exists - ${err.message}`
      throw new Error(msg);
    }
  }

  protected getFunctionCallingLocation = (): string => {
    const stack = new Error().stack;
    const callerFile = stack?.split('\n')[2].split(' (')[1].split(':').slice(0, -2).join(':');
    const folderLocation = path.dirname(callerFile!);
    return folderLocation;
  }

  protected createDatabaseFile = (fileURL: string): void => {
    try {
      const result = fileService.existsSync(fileURL);
      if (!result) {
        fileService.writeFileSync(
          fileURL, JSON.stringify([], null, 3)
        );
      }
    } catch (error) {
      const err = ensureError(error);
      const msg = `error creating database file - ${err.message}`
      throw new Error(msg);
    }
  }

  protected createCollectionFile = (location: string, modelName: string): void => {
    try {
      const filename = modelName.toLowerCase();
      const file = this.getCollectionFilePath(location, filename);
      this.createDatabaseFile(file);
    } catch (error) {
      const err = ensureError(error);
      const msg = `error creating model file - ${err.message}`
      throw new Error(msg);
    }
  }

  protected writeIntoCollectionFile = <T extends object>(
    location: string, model: string, data: T
  ): void => {
    try {
      const writeLocation = this.getCollectionFilePath(location, model);
      fileService.writeFileSync(writeLocation,
        JSON.stringify(data, null, 3)
      );
    } catch (error) {
      const err = ensureError(error);
      const msg = `error writing into file - ${err.message}`
      throw new Error(msg);
    }
  }

  protected readFromCollectionFile = <T extends Record<string, unknown>>(
    modelFolderLocation: string, modelName: string
  ): JsonDatabaseDocument<T>[] => {
    const fileURL = this.getCollectionFilePath(modelFolderLocation, modelName);
    const fileContents = fileService.readFileSync(fileURL, "utf-8").trim();
    try {
      if (!fileContents) {
        this.writeIntoCollectionFile(modelFolderLocation, modelName, []);
        return []
      }
      const parsed = JSON.parse(fileContents);
      if (!Array.isArray(parsed)) {
        this.writeIntoCollectionFile(modelFolderLocation, modelName, []);
        return []
      } else return parsed;
    } catch (error) {
      const err = ensureError(error);
      const msg = `error writing into file - ${err.message}`
      if (err.message.includes("Unexpected non-whitespace character after JSON at position")) {
        const a = fileContents.indexOf("]");
        const managedContents = fileContents.slice(0, a + 1);
        if (!Array.isArray(JSON.parse(managedContents))) {
          this.writeIntoCollectionFile(modelFolderLocation, modelName, []);
          return []
        } else {
          this.writeIntoCollectionFile(modelFolderLocation, modelName, JSON.parse(managedContents));
          return JSON.parse(managedContents);
        }
      } else throw new Error(msg);
    }
  }
}

