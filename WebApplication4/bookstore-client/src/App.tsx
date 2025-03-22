import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  pageCount: number;
  price: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("Title");

  const fetchBooks = useCallback(async () => {
    try {
      // Note: Sending the query parameters expected by the controller.
      const response = await axios.get('http://localhost:5299/api/books', {
        params: { page, pageSize, sortField, sortOrder: 'asc' },
      });
      setBooks(response.data.books);
      setTotalItems(response.data.totalBooks); // Use "totalBooks" as returned from the API
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [page, pageSize, sortField]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
      <div className="container mt-4">
        <h2>Book List</h2>

        {/* Page Size & Sort Controls */}
        <div className="mb-3">
          <label>Results per page: </label>
          <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <label className="ml-3">Sort by: </label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="Title">Title</option>
            <option value="Author">Author</option>
          </select>
        </div>

        {/* Books Table */}
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price}</td>
              </tr>
          ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, idx) => (
                <li key={idx} className={`page-item ${page === idx + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
  );
}

export default App;
