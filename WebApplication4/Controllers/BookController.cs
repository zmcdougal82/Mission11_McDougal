using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookStoreContext _context;

        public BooksController(BookStoreContext context)
        {
            _context = context;
        }

        // GET: api/Books
        // Query parameters: page (default=1), pageSize (default=5), sortField, sortOrder (asc/desc)
        [HttpGet]
        public async Task<IActionResult> GetBooks(int page = 1, int pageSize = 5, string sortField = "Title", string sortOrder = "asc")
        {
            var query = _context.Books.AsQueryable();

            // Sorting by different fields
            switch (sortField.ToLower())
            {
                case "title":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.Title)
                        : query.OrderByDescending(b => b.Title);
                    break;
                case "author":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.Author)
                        : query.OrderByDescending(b => b.Author);
                    break;
                case "publisher":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.Publisher)
                        : query.OrderByDescending(b => b.Publisher);
                    break;
                case "category":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.Category)
                        : query.OrderByDescending(b => b.Category);
                    break;
                case "pagecount":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.PageCount)
                        : query.OrderByDescending(b => b.PageCount);
                    break;
                case "price":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.Price)
                        : query.OrderByDescending(b => b.Price);
                    break;
                default:
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(b => b.Title)
                        : query.OrderByDescending(b => b.Title);
                    break;
            }

            // Get total count for pagination
            var totalBooks = await query.CountAsync();

            // Apply pagination
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { totalBooks, books });
        }
    }
}
