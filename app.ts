import { Container } from "./index"
function main() {
  const database = new Container();
  const users = database.createCollection("users");
  console.log("here", users.find());
}

main();

