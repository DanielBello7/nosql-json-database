"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function main() {
    const database = new index_1.Container();
    const users = database.createCollection("users");
    console.log("here", users.find());
}
main();
