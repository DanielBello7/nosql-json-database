import { NoSQLJsonDatabaseCollection, NoSQLJsonDatabaseDocument, NoSQLJsonDatabaseID } from "./index.types";
import { flattenObject, unflattenObject } from "./update-object";
import { v4 as uuid, validate } from "uuid";
import Database from "./nosql-json-database";
import updateObject from "./update-object";
import Container from "./nosql-json-database-container";

export default class Collection<T extends Record<string, unknown>> extends Database implements NoSQLJsonDatabaseCollection<T> {
  private collectionTitle: string;
  private collectionContainer: Container;
  private collectionFolder: string

  /**
   * constructor for creating a new collection for the database being specified
   * @param title string. The title of the model to be created. Would also be the filename of the model collection being created
   * @param database JsonDatabase. The database container for the collection.
   */
  constructor(title: string, databaseContainer: Container) {
    super();
    this.collectionContainer = databaseContainer;
    this.collectionTitle = title;
    this.collectionFolder = databaseContainer.folderLocation;
    this.createCollectionFile(this.collectionContainer.folderLocation, title);
  }

  /**
   * generates an identifier for the object being added to the database
   * @returns string
   */
  private generateId = (): string => {
    const id = `json://${this.collectionTitle}.${uuid()}`;
    return id;
  }

  /**
   * checks if a string was actually created by this json-database
   * @param id string
   * @returns { _id: string; collection: string; uuid: string }
   */
  private confirmId = (id: string): NoSQLJsonDatabaseID => {
    const states = id.split("://");
    if (![2].includes(states.length) || states[0] !== "json")
      throw new Error("id not a json-database id");

    const idSplit = states[1].split(".");
    if (![2].includes(idSplit.length))
      throw new Error("id not a json-database id");

    if (!validate(idSplit[1]))
      throw new Error("id not a json-database id");

    return {
      _id: id,
      collection: idSplit[0],
      uuid: idSplit[1]
    }
  }

  /**
   * Populates a selected field with its actual data from another collection
   * @param data Record<string, unknown>
   * @param populatePath string
   * @returns Record<string, unknown>
   */
  private populate = (data: Record<string, unknown>, populatePath: string): Record<string, unknown> => {
    const flattened = flattenObject(data);
    if (!Object.keys(flattened).includes(populatePath)) return data

    const id = flattened[populatePath];
    if (typeof id !== "string")
      throw new Error("type of specified path value should be string");

    const checkId = this.confirmId(id);
    if (!this.collectionContainer.collections.includes(checkId.collection))
      throw new Error("collection currently not available");

    const getPopulateCollectionData = this.readFromCollectionFile(this.collectionFolder, checkId.collection);
    const findSelected = getPopulateCollectionData.find((item) => item._id === checkId._id);
    const fixed = unflattenObject({ ...flattened, [populatePath]: findSelected })
    return fixed;
  }

  /**
   * method for getting all the documents within a specific collection. returns data based on filter whenever a filter is added
   * @param data Partial<JsonDatabaseDocumentType<T>>
   * @returns JsonDatabaseDocumentType<T>[]
   */
  find = (data?: Partial<NoSQLJsonDatabaseDocument<T>>): NoSQLJsonDatabaseDocument<T>[] => {
    const files = this.readFromCollectionFile<T>(this.collectionContainer.folderLocation, this.collectionTitle);
    if (data) {
      const filtered = files.filter((item) => {
        const confirmation = Object.keys(data).every(obj1 => {
          return data[obj1 as keyof typeof data] === item[obj1 as keyof typeof item]
        });
        if (confirmation) return item;
      });
      return filtered
    } else return files;
  }

  /**
   * method for getting all the documents within a collection and populating them with data stored in another collection under
   * the same database container. expects a data parameter which consist of the field name to be populated and the model of the populating collection.
   * @param data {field: string; model: string}
   * @returns JsonDatabaseDocumentType<T>[]
   */
  findAndPopulate = (populatedPath: string | string[]): NoSQLJsonDatabaseDocument<T>[] => {
    const data = this.find();
    const populated = data.map((item) => {
      if (typeof populatedPath === "string") {
        const result = this.populate(item, populatedPath);
        return result as NoSQLJsonDatabaseDocument<T>
      } else {
        let result: any = item;
        for (let i = 0; i < populatedPath.length; i++)
          result = this.populate(result, populatedPath[i]);
        return result;
      }
    });
    return populated;
  }

  /**
   * method for finding a single document within a collection. uses the filter provided to search
   * Returns the first document matching what was found
   * @param value Partial<T>
   * @returns JsonDatabaseDocumentType<T> | undefined
   */
  findOne = (value: Partial<NoSQLJsonDatabaseDocument<T>>): NoSQLJsonDatabaseDocument<T> | undefined => {
    const data = this.find();
    const selected = data.find((item) => {
      const confirmation = Object.keys(value).every(obj1 => {
        return value[obj1 as keyof typeof value] === item[obj1 as keyof typeof item]
      });
      if (confirmation) return item;
    });
    return selected;
  }

  /**
   * uses the filter provided to find one document and populates it with data from another document. expects the data parameter
   * to contian the field of the to be populated data containing the id of the populating document and the model of the collection to be searched
   * @param value Partial<T>
   * @param data 
   * @returns { field: string; model: string }
   */
  findOneAndPopulate = (value: Partial<NoSQLJsonDatabaseDocument<T>>, populatedPath: string | string[]): NoSQLJsonDatabaseDocument<T> | undefined => {
    const selectedData = this.findOne(value);
    if (!selectedData) return undefined

    if (typeof populatedPath === "string") {
      const result = this.populate(selectedData, populatedPath);
      return result as NoSQLJsonDatabaseDocument<T>
    } else {
      let result: any = selectedData;
      for (let i = 0; i < populatedPath.length; i++)
        result = this.populate(result, populatedPath[i]);
      return result as NoSQLJsonDatabaseDocument<T>;
    }
  }

  /**
   * finds one document using the id of the document
   * @param id string
   * @returns JsonDatabaseDocumentType<T> | undefined
   */
  findOneById = (id: string): NoSQLJsonDatabaseDocument<T> | undefined => {
    if (typeof id !== "string")
      throw new Error("type of id should be a string");

    const documents = this.find();
    const document = documents.find((item) => item._id === id);
    return document;
  }

  /**
   * uses the id provided to find one document and populates it with data from another document. expects the data parameter
   * to contian the field of the to be populated data containing the id of the populating document and the model of the collection to be searched
   * @param id string
   * @param data { field: string; model: string }
   * @returns JsonDatabaseDocumentType<T> | undefined
   */
  findOneByIdAndPopulate = (id: string, populatedPath: string | string[]): NoSQLJsonDatabaseDocument<T> | undefined => {
    const selectedData = this.findOneById(id);
    if (!selectedData) return undefined
    if (typeof populatedPath === "string") {
      const result = this.populate(selectedData, populatedPath);
      return result as NoSQLJsonDatabaseDocument<T>
    } else {
      let result: any = selectedData;
      for (let i = 0; i < populatedPath.length; i++)
        result = this.populate(result, populatedPath[i]);
      return result as NoSQLJsonDatabaseDocument<T>;
    }
  }

  /**
   * inserts one document into the collection 
   * @param data T
   * @returns JsonDatabaseDocumentType<T>
   */
  addOne = (data: T): NoSQLJsonDatabaseDocument<T> => {
    if (typeof data !== "object")
      throw new Error("type object required");

    const response = this.find();

    const newDoc = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, [...response, newDoc]);
    return newDoc;
  }

  /**
   * inserts multiple documents at once into a collection and returns the proper documents after being saved
   * in the database
   * @param data T[]
   * @returns JsonDatabaseDocumentType<T>[]
   */
  addMany = (data: T[]): NoSQLJsonDatabaseDocument<T>[] => {
    const response = data.map((item) => {
      return this.addOne(item);
    });
    return response;
  }

  /**
   * deletes document from the collection using the id of the document to be deleted
   * @param id string
   */
  deleteOneUsingId = (id: string): void => {
    if (typeof id !== "string")
      throw new Error('string required');

    const data = this.find()
    const updatedDocs = data.filter((item) => item._id !== id);
    this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, updatedDocs);
  }

  /**
   * updates a document with the provided values using the id. keys of _id, updatedAt and createdAt cannot be updated
   * @param id string
   * @param updates Partial<T>
   * @returns JsonDatabaseDocumentType<T>
   */
  updateOneUsingId = (id: string, updates: Partial<T>): NoSQLJsonDatabaseDocument<T> => {
    if (typeof id !== "string")
      throw new Error("type of id should be a string");

    if (typeof updates !== "object")
      throw new Error("type of updates should be an object");

    const updatedData = this.find().map((item) => {
      if (item._id !== id) return item;
      const updated = updateObject<NoSQLJsonDatabaseDocument<T>>(item, updates as NoSQLJsonDatabaseDocument<T>);
      const { _id, createdAt, ...rest } = updated;
      item = { ...item, ...rest, updatedAt: new Date().toISOString() }
      return item
    });

    this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, updatedData);
    const item = updatedData.find((item) => item._id === id);
    if (item) return item;
    throw new Error("error occured getting document");
  }

  /**
   * resets the model collection and clears all data 
   */
  resetModel = () => {
    this.writeIntoCollectionFile(this.collectionFolder, this.collectionTitle, []);
  }
}

