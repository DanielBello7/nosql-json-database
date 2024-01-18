"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unflattenObject = exports.flattenObject = void 0;
function flattenObject(obj) {
    const result = {};
    function recurse(current, path = []) {
        for (const key in current) {
            if (current.hasOwnProperty(key)) {
                const newPath = path.concat([key]);
                if (typeof current[key] === 'object' && !Array.isArray(current[key])) {
                    recurse(current[key], newPath);
                }
                else {
                    result[newPath.join('.')] = current[key];
                }
            }
        }
    }
    recurse(obj);
    return result;
}
exports.flattenObject = flattenObject;
function unflattenObject(obj) {
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const keys = key.split('.');
            let currentLevel = result;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!currentLevel[keys[i]]) {
                    currentLevel[keys[i]] = {};
                }
                currentLevel = currentLevel[keys[i]];
            }
            currentLevel[keys[keys.length - 1]] = obj[key];
        }
    }
    return result;
}
exports.unflattenObject = unflattenObject;
function updateObject(originalObject, updates) {
    const updatedObject = Object.assign({}, originalObject);
    for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
            const updatedValue = updates[key];
            if (typeof updatedValue === 'object' && !Array.isArray(updatedValue)) {
                const flattenedOriginal = flattenObject(updatedObject[key]);
                const flattenedUpdated = flattenObject(updatedValue);
                const mergedObject = Object.assign(Object.assign({}, flattenedOriginal), flattenedUpdated);
                updatedObject[key] = unflattenObject(mergedObject);
            }
            else {
                updatedObject[key] = updatedValue;
            }
        }
    }
    return updatedObject;
}
exports.default = updateObject;
