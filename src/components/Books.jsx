import { useQuery, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries/bookQueries";
import { BOOK_ADDED } from "../queries/subscriptionQueries";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(
    props.selectedGenre || "all"
  );
  const allBooksResult = useQuery(ALL_BOOKS);
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: selectedGenre === "all",
  });

  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log("Subscription data received:", data);
      const addedBook = data.data.bookAdded;
      window.alert(
        `New book added: ${addedBook.title} by ${addedBook.author.name}`
      );

      // Update the cache for ALL_BOOKS query
      const cachedData = client.cache.readQuery({ query: ALL_BOOKS });
      if (cachedData) {
        console.log("Updating ALL_BOOKS cache with new book:", addedBook);
        client.cache.writeQuery({
          query: ALL_BOOKS,
          data: {
            allBooks: [...cachedData.allBooks, addedBook],
          },
        });
      }

      // Update the cache for BOOKS_BY_GENRE query if the new book matches the selected genre
      if (selectedGenre !== "all" && addedBook.genres.includes(selectedGenre)) {
        const cachedGenreData = client.cache.readQuery({
          query: BOOKS_BY_GENRE,
          variables: { genre: selectedGenre },
        });
        if (cachedGenreData) {
          console.log(
            "Updating BOOKS_BY_GENRE cache with new book:",
            addedBook
          );
          client.cache.writeQuery({
            query: BOOKS_BY_GENRE,
            variables: { genre: selectedGenre },
            data: {
              allBooks: [...cachedGenreData.allBooks, addedBook],
            },
          });
        }
      }
    },
  });

  useEffect(() => {
    console.log("Subscription status:", {
      subscriptionLoading,
      subscriptionError,
      subscriptionData,
    });
  }, [subscriptionLoading, subscriptionError, subscriptionData]);

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

  const books =
    selectedGenre === "all"
      ? allBooksResult.data.allBooks
      : booksByGenreResult.data.allBooks;

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
