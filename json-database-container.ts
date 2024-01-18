import type { JsonDatabaseContainer } from "./index.types";
import JsonDatabaseCollection from "./json-database-collection";
import pluralize from "pluralize";
import fs from "fs";
import Database from "./json-database";
import path from "path";

export default class Container extends Database implements JsonDatabaseContainer {
  protected loc?: string;
  public collections: string[] = []
  public folderLocation: string;

  constructor(location?: string) {
    super();
    if (location) {
      this.loc = location
      const folder = path.join(location, "/database");
      this.folderLocation = folder;
    } else {
      const folderPath = this.getFunctionCallingLocation();
      const foldername = path.join(folderPath, "/database");
      this.folderLocation = foldername;
    }
    this.createDatabase();
  }

  /**
   * checks for all current database collections within memory
   */
  protected checkForDatabaseCollections = () => {
    const files = fs.readdirSync(this.folderLocation);
    const titles = files.map((item) => item.split(".")[0])
    this.collections = [...new Set([...this.collections, ...titles])];
  }

  /**
   * reset the whole database container, by deleting all the collections contained
   * within the container
   */
  public resetDatabase = () => {
    try {
      const files = fs.readdirSync(this.folderLocation);
      for (const file in files) {
        const item = files[file]
        const filepath = path.join(this.folderLocation, item);
        fs.unlinkSync(filepath);
      }
      this.collections = []
    } catch (error) {
      throw error
    }
  }

  /**
   * delete the database entirely and remove all the contents of the container
   */
  public deleteDatabase = (): void => {
    this.resetDatabase();
    fs.rmdirSync(this.folderLocation);
  }

  /**
   * create the database container, if the container doesnt exist
   * if it does it doesn't perform anything
   */
  public createDatabase = (): void => {
    const folder = this.folderLocation;
    if (!this.checkIfFolderExists(folder)) fs.mkdirSync(folder);
    this.checkForDatabaseCollections();
  }

  /**
   * delete a particular collection within the database container and remove all the contents
   * @param title string
   */
  public deleteCollection = (title: typeof this.collections[number]): void => {
    const modelpath = this.getCollectionFilePath(this.folderLocation, title);
    fs.unlinkSync(modelpath);
    this.collections = this.collections.filter((item) => item !== title);
  }

  /**
   * takes the title and creates a new collection within the particular database
   * this adds the value to the collections list within the database
   * @param name string
   * @returns JsonDatabaseCollection<T>
   */
  public createCollection = <T extends Record<string, unknown>>(
    name: string
  ): JsonDatabaseCollection<T> => {
    const corrected = pluralize(name);
    const newCollection = new JsonDatabaseCollection<T>(corrected, this);
    if (!this.collections.includes(corrected)) this.collections.push(corrected);
    return newCollection;
  }
}

