import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState } from "react";

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
  const [selectedGenre, setSelectedGenre] = useState("all");
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  // Extract unique genres from all books
  const allGenres = [...new Set(books.flatMap((book) => book.genres))];

  // Filter books based on selected genre
  const filteredBooks =
    selectedGenre === "all"
      ? books
      : books.filter((book) => book.genres.includes(selectedGenre));

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
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setSelectedGenre("all")}>all genres</button>
        {allGenres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
