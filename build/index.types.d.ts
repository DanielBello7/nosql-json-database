export type NoSQLJsonDatabaseMetadata = {
    _id: string;
    createdAt: string | Date;
    updatedAt: string | Date;
};
export type NoSQLJsonDatabaseDocument<T extends Record<string, unknown>> = T & NoSQLJsonDatabaseMetadata;
export interface NoSQLJsonDatabaseContainer {
    deleteDatabase: () => void;
    resetDatabase: () => void;
    deleteCollection: (title: string) => void;
    createDatabase: () => void;
    createCollection: <T extends Record<string, unknown>>(name: string) => NoSQLJsonDatabaseCollection<T>;
}
export interface NoSQLJsonDatabaseCollection<T extends Record<string, unknown>> {
    find: (data?: Partial<NoSQLJsonDatabaseDocument<T>>) => NoSQLJsonDatabaseDocument<T>[];
    findAndPopulate: (populatePath: string | string[]) => NoSQLJsonDatabaseDocument<T>[];
    findOne: (value: Partial<NoSQLJsonDatabaseDocument<T>>) => NoSQLJsonDatabaseDocument<T> | undefined;
    findOneAndPopulate: (value: Partial<NoSQLJsonDatabaseDocument<T>>, populatePath: string | string[]) => NoSQLJsonDatabaseDocument<T> | undefined;
    findOneById: (id: string) => NoSQLJsonDatabaseDocument<T> | undefined;
    findOneByIdAndPopulate: (id: string, populatePath: string | string[]) => NoSQLJsonDatabaseDocument<T> | undefined;
    deleteOneUsingId: (_id: string) => void;
    updateOneUsingId: (_id: string, updates: Partial<T>) => NoSQLJsonDatabaseDocument<T>;
    addOne: (data: T) => NoSQLJsonDatabaseDocument<T>;
    addMany: (data: T[]) => NoSQLJsonDatabaseDocument<T>[];
    resetModel: () => void;
}
export type NoSQLJsonDatabaseID = {
    _id: string;
    collection: string;
    uuid: string;
};
