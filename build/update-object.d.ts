export declare function flattenObject(obj: any): Record<string, unknown>;
export declare function unflattenObject(obj: Record<string, any>): Record<string, any>;
export default function updateObject<T extends Record<string, unknown>>(originalObject: T, updates: Partial<T>): T;
