import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
      id
    }
  }
`;

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
