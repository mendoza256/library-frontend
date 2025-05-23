import { gql } from "@apollo/client";

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
        id
        born
        bookCount
      }
      published
      genres
      id
    }
  }
`;
