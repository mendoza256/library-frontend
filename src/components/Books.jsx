import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries/bookQueries";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(
    props.selectedGenre || "all"
  );
  const allBooksResult = useQuery(ALL_BOOKS);
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: selectedGenre === "all",
  });

  useEffect(() => {
    if (props.selectedGenre) {
      setSelectedGenre(props.selectedGenre);
    }
  }, [props.selectedGenre]);

  if (!props.show) {
    return null;
  }

  if (
    allBooksResult.loading ||
    (selectedGenre !== "all" && booksByGenreResult.loading)
  ) {
    return <div>loading...</div>;
  }

  // Get books from the appropriate query result
  const books =
    selectedGenre === "all"
      ? allBooksResult.data.allBooks
      : booksByGenreResult.data.allBooks;

  // Extract unique genres from all books (always use allBooks for this)
  const allGenres = [
    ...new Set(allBooksResult.data.allBooks.flatMap((book) => book.genres)),
  ];

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (props.onGenreChange) {
      props.onGenreChange(genre);
    }
  };

  if (props.isFavoriteView && !selectedGenre) {
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
