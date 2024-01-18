# NoSQL JSON Database

<p align=center>
  NoSQL JSON Database is a quick setup database for <a href="http://nodejs.org">node</a> and the browser that can be delightfully paired with any javascript testing framework.
</p>

## Installation

### Node.js

`nosql-json-database` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install --save-dev json-database

## Why?

This module aims to help simplify the use of file modules using fs and path whenever developing 
an application that needs a database but you just don't want to use a standard database due to the long setup or for any other reason.

This module uses JSON files to store database documents and files. This was designed to be 
a simple node-js module to assist during the development of applications temporarily, or even
during the designing or testing of an application. The application can be useful in multiple 
backend areas and offers some useful methods such as populate to allow for complex no-sql data 
structures to be implemented.

## Usage

import `Container` from the package folder and use to create the container for the database

```javascript
import { Container } from "nosql-json-database";

const database = new Container();
const usersCollection = database.createCollection("users");
```


## Specifying location for database container

You can specify the location where all the database files would be contained

```javascript
import { Container } from "nosql-json-database";
import path from "path";

const location = path.join(__dirname, "/");
const database = new Container(location);
```


## Specifying Type as Models

It is recommended to specify the type as a model basis for the data to be contained
this would help in intellisence and also when performing operations

```javascript
import { Container } from "nosql-json-database";

type Users = {
  name: string;
  age: number;
  email: string;
}

const database = new Container();
const usersCollection = database.createCollection<Users>("users");
```


## Adding Documents

```javascript
import { Container } from "nosql-json-database";

type Users = {
  name: string;
  age: number;
  email: string;
}

const database = new Container();
const usersCollection = database.createCollection("users");
usersCollection.addOne({
  email: "joe@test.com",
  age: 23,
  name: "joe",
});
```


## Retrieving Documents

In addition to storing the data provided, an _id along with createdAt and updatedAt information is
added to the newly inserted document.
The _id is generated from using `Date.now()`

```javascript
import { Container } from "nosql-json-database";

type Users = {
  name: string;
  password: string;
  email: string;
}

const database = new Container();
const usersCollection = database.createCollection("users");
usersCollection.addOne({
  email: "daniel@test.com",
  password: "daniel1",
  name: "daniel",
});

const response = usersCollection.find();
console.log(response);
// [
//   {
//     _id: 'json://users.be72b673-3f7c-4315-bbe0-a7311bf591d0',
//     email: 'daniel@gmail.com',
//     name: 'daniel',
//     password: 'daniel1',
//     createdAt: '2024-01-17T21:22:06.532Z',
//     updatedAt: '2024-01-17T21:22:06.534Z'
//   }
// ]
```

## Populating a document

A document can be populated by specifying the field to be populated. The JSON database would handle the matching of the collections

```javascript
import { Container } from "nosql-json-database";

type Users = {
  name: stringl;
  password: string;
  email: string;
}

type Posts = {
  title: string;
  user: string;
  body: string;
}

type Comments = {
  postId: string;
  userId: string;
  text: string;
}


const database = new Container();
const users = database.createCollection<Users>("users");
const post = database.createCollection<Posts>("posts");
const comment = database.createCollection<Comments>("comments");

const newUser = usersCollection.addOne({
  email: "joe@test.com",
  name: "joe davis",
  password: "joe1"
});

const newPost = postCollection.addOne({
  user: newUser._id,
  title: "test case post title",
  body: "test case body 2",
});

const newComment = commentCollection.addOne({
  postId: newPost._id,
  userId: newUser._id,
  text: "comment case",
});

console.log(comment.findAndPopulate(["postId", "userId"]));
// [
//   {
//     _id: 'json://comments.8a82370e-11e9-4514-a04f-bda2d30938fa',
//     postId: {
//       _id: 'json://posts.b1b3bf21-631d-4065-88b0-3b1b06983837',
//       user: 'json://users.ba8febaf-0df2-4df4-afb7-4b3862293255',
//       title: 'test case post title',
//       body: 'test case body 2',
//       createdAt: '2024-01-17T21:31:30.746Z',
//       updatedAt: '2024-01-17T21:31:30.746Z'
//     },
//     userId: {
//       _id: 'json://users.ba8febaf-0df2-4df4-afb7-4b3862293255',
//       email: 'joe@gmail.com',
//       password: 'joe1',
//       name: 'joe davis',
//       createdAt: '2024-01-17T21:31:30.744Z',
//       updatedAt: '2024-01-17T21:31:30.745Z'
//     },
//     text: 'comment case',
//     createdAt: '2024-01-17T21:31:30.747Z',
//     updatedAt: '2024-01-17T21:31:30.747Z'
//   }
// ]

```


## License

MIT

