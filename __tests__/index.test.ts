import { BookType, AuthorType, OrganizationType, UsersModel } from "./types";
import { JsonDatabaseCollectionType, JsonDatabaseType } from "../index";
import { describe } from "mocha";
import { expect } from "chai";
import { Container } from "../index";

describe("Test Json Database functionality", function () {
  let Database: JsonDatabaseType
  let AuthorModel: JsonDatabaseCollectionType<AuthorType>
  let BooksModel: JsonDatabaseCollectionType<BookType>
  let UsersModel: JsonDatabaseCollectionType<UsersModel>

  it("should clear all older files", () => {
    const newDb = new Container();
    Database = newDb;
    newDb.deleteDatabase();
  });

  it("should create a new folder called database", () => {
    Database.createDatabase();

    const newModel = Database.createCollection<BookType>("books");
    BooksModel = newModel;

    const newAuthorModel = Database.createCollection<AuthorType>("authors");
    AuthorModel = newAuthorModel;
  });

  it("should create a new model", () => {
    const model = Database.createCollection<UsersModel>("users");
    UsersModel = model
  });

  it("should get all documents from model", () => {
    const response = UsersModel.find();
    expect(response.length).to.equals(0);
  });

  it("should add a new document within the users database", function () {
    const newUser = UsersModel.addOne({
      email: "daniel@gmail.com",
      name: "daniel",
      password: "daniel1"
    });
    const response = UsersModel.find();

    expect(response.length)
      .to
      .equals(1);

    expect(response[0].name)
      .to
      .equals(newUser.name);
  });

  it("should return a document using _id", function () {
    const newUser = UsersModel.addOne({
      email: "tony@gmail.com",
      name: "tony",
      password: "tony1"
    });
    const findUser = UsersModel.findOneById(newUser._id);

    expect(findUser)
      .to
      .contain
      .keys(["name"]);

    expect(findUser?.name)
      .to
      .equal(newUser.name);
  });

  it("should update a document", function () {
    const newUser = UsersModel.addOne({
      email: "david@gmail.com",
      name: "david",
      password: "david1"
    });
    const update = { name: "david benson" }
    UsersModel.updateOneUsingId(newUser._id, update);
    const getUser = UsersModel.findOneById(newUser._id);

    expect(getUser)
      .to
      .contain
      .keys(["name"]);

    expect(getUser?.name)
      .to
      .equals(update.name);
  });

  it("should delete a document", function () {
    const addUser = UsersModel.addOne({
      email: "james@gmail.com",
      name: "james",
      password: "james1"
    });
    UsersModel.deleteOneUsingId(addUser._id);
    const findJames = UsersModel.findOneById(addUser._id);

    expect(findJames).to.be.undefined
  });

  it("should reset database model", function () {
    BooksModel.addOne({
      authorId: "james",
      nin: 123456789,
      title: "times we spent together"
    });
    const getBooks = BooksModel.find();
    BooksModel.resetModel();
    const getBooksAgain = BooksModel.find();

    expect(getBooks.length)
      .to
      .equals(1);

    expect(getBooksAgain.length)
      .to
      .equals(0);
  });

  it("should populate a document", function () {
    const newAuthor = AuthorModel.addOne({
      address: "france",
      fullname: "daniel"
    });
    const newBook = BooksModel.addOne({
      authorId: newAuthor._id,
      nin: 1234567890,
      title: "james and the pages burnt"
    });
    const populatedBook: any = BooksModel
      .findOneByIdAndPopulate(newBook._id, "authorId");

    expect(populatedBook?.authorId.fullname)
      .to
      .equals(newAuthor.fullname);
  });

  it("should populate a nested document", function () {
    const OrganizationModel = Database.createCollection<OrganizationType>("organizations");
    const books = BooksModel.find();
    const newOrganization = OrganizationModel.addOne({
      account: {
        bookId: books[0]._id,
        country: "usa",
        nin: "68u988-249427h297"
      },
      address: "karu site abuja",
      title: "chowberry"
    });
    const populatedOrganization: any = OrganizationModel
      .findOneByIdAndPopulate(newOrganization._id, "account.bookId");

    expect(populatedOrganization.account.bookId.title)
      .to
      .equals(books[0].title);
  });

});

