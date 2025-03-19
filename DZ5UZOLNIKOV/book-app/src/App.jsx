import React, { useState, useEffect } from "react";
import BookCard from "./components/BookCard";
import SearchSort from "./components/SearchAndSort";
import "./index.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setBooks([]);
      return;
    }

    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setBooks(
            data.items.map((item) => ({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || [],
              coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
            }))
          );
        } else {
          setBooks([]);
        }
      })
      .catch((error) => console.error("Ошибка загрузки книг:", error));
  }, [searchTerm]);

  const sortedBooks = books.sort((a, b) => {
    let valueA = a[sortBy].toString().toLowerCase();
    let valueB = b[sortBy].toString().toLowerCase();
    return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  return (
    <div className="container">
      <h1>BOOKS</h1>
      <SearchSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <div className="book-list">
        {sortedBooks.length > 0 ? (
          sortedBooks.map((book) => <BookCard key={book.id} {...book} />)
        ) : (
          <p className="no-books">Книги не найдены</p>
        )}
      </div>
    </div>
    );
};

export default App;
