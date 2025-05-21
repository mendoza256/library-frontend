import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    const genre = localStorage.getItem("library-user-favorite-genre");
    if (token) {
      setToken(token);
    }
    if (genre) {
      setFavoriteGenre(genre);
    }
  }, []);

  const logout = () => {
    setToken(null);
    setFavoriteGenre("");
    localStorage.clear();
  };

  const setGenre = (genre) => {
    setFavoriteGenre(genre);
    localStorage.setItem("library-user-favorite-genre", genre);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("favorite")}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <Books
        show={page === "favorite"}
        selectedGenre={favoriteGenre}
        onGenreChange={setGenre}
        isFavoriteView={true}
      />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
