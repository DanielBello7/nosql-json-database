export type UsersModel = {
  email: string
  name: string
  password: string
}

export type BookType = {
  title: string
  nin: number
  authorId: string
}

export type AuthorType = {
  fullname: string
  address: string
}

export type OrganizationType = {
  title: string
  address: string
  account: {
    nin: string
    bookId: string
    country: string
  }
}

