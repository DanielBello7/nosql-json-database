"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ensureError(err) {
    if (err instanceof Error)
        return err;
    let stringified = "[unable to stringify error]";
    try {
        stringified = JSON.stringify(err);
    }
    catch (_a) { }
    const error = new Error(stringified);
    return error;
}
exports.default = ensureError;
