import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

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
  const [selectedGenre, setSelectedGenre] = useState(
    props.selectedGenre || "all"
  );
  const result = useQuery(ALL_BOOKS);

  useEffect(() => {
    if (props.selectedGenre) {
      setSelectedGenre(props.selectedGenre);
    }
  }, [props.selectedGenre]);

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

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (props.onGenreChange) {
      props.onGenreChange(genre);
    }
  };

  if ((props.isFavoriteView && !selectedGenre) || selectedGenre === "all") {
    return (
      <div>
        <h2>recommended books</h2>
        <div style={{ marginTop: "20px" }}>
          <p>Select your favorite genre to get book recommendations:</p>
          <div style={{ marginTop: "10px" }}>
            {allGenres.map((genre) => (
              <button key={genre} onClick={() => handleGenreChange(genre)}>
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>{props.isFavoriteView ? "recommended books" : "books"}</h2>

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

      {!props.isFavoriteView && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => handleGenreChange("all")}>all genres</button>
          {allGenres.map((genre) => (
            <button key={genre} onClick={() => handleGenreChange(genre)}>
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
