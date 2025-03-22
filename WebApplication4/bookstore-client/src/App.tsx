import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  classification: string;
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
      // Use a relative URL since the API is now served from the same origin
      const response = await axios.get('/api/books', {
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
          <label style={{ marginLeft: '30px' }}>Sort by: </label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="Title">Title</option>
            <option value="Author">Author</option>
            <option value="Publisher">Publisher</option>
            <option value="ISBN">ISBN</option>
            <option value="Category">Category</option>
            <option value="Classification">Classification</option>
            <option value="Pages">Pages</option>
            <option value="Price">Price</option>
          </select>
        </div>

        {/* Books Table */}
        <table className="table table-striped" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
          <tr>
            <th style={{ width: '15%' }}>Title</th>
            <th style={{ width: '15%' }}>Author</th>
            <th style={{ width: '15%' }}>Publisher</th>
            <th style={{ width: '15%' }}>ISBN</th>
            <th style={{ width: '10%' }}>Category</th>
            <th style={{ width: '10%' }}>Classification</th>
            <th style={{ width: '10%', textAlign: 'right' }}>Pages</th>
            <th style={{ width: '10%', textAlign: 'right' }}>Price</th>
          </tr>
          </thead>
          <tbody>
          {books.map((book) => (
              <tr key={book.bookId}>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.publisher}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.isbn}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.category}</td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.classification}</td>
                <td style={{ textAlign: 'right' }}>{book.pageCount}</td>
                <td style={{ textAlign: 'right' }}>${book.price}</td>
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
