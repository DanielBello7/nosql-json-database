export type JsonDatabaseMetadata = {
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type JsonDatabaseDocument<T extends Record<string, unknown>> = T & JsonDatabaseMetadata

export interface JsonDatabaseContainer {
  deleteDatabase: () => void
  resetDatabase: () => void
  deleteCollection: (title: string) => void
  createDatabase: () => void
  createCollection: <T extends Record<string, unknown>>(name: string) => JsonDatabaseCollection<T>
}

export interface JsonDatabaseCollection<T extends Record<string, unknown>> {
  find: (data?: Partial<JsonDatabaseDocument<T>>) => JsonDatabaseDocument<T>[]
  findAndPopulate: (populatePath: string | string[]) => JsonDatabaseDocument<T>[]
  findOne: (value: Partial<JsonDatabaseDocument<T>>) => JsonDatabaseDocument<T> | undefined
  findOneAndPopulate: (value: Partial<JsonDatabaseDocument<T>>, populatePath: string | string[]) => JsonDatabaseDocument<T> | undefined
  findOneById: (id: string) => JsonDatabaseDocument<T> | undefined
  findOneByIdAndPopulate: (id: string, populatePath: string | string[]) => JsonDatabaseDocument<T> | undefined
  deleteOneUsingId: (_id: string) => void
  updateOneUsingId: (_id: string, updates: Partial<T>) => JsonDatabaseDocument<T>
  addOne: (data: T) => JsonDatabaseDocument<T>
  addMany: (data: T[]) => JsonDatabaseDocument<T>[]
  resetModel: () => void
}

export type JsonDatabaseID = {
  _id: string
  collection: string
  uuid: string
}


