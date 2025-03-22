using WebApplication4.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register the SQLite DbContext using the connection string
builder.Services.AddDbContext<BookStoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookStoreConnection")));

// Register controllers if you plan to use them
builder.Services.AddControllers();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowReactApp");

// Map controller routes
app.MapControllers();

// Seed the database with sample data if it's empty
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<BookStoreContext>();
    
    // Ensure database is created
    context.Database.EnsureCreated();
    
    // Check if there are any books
    if (!context.Books.Any())
    {
        // Add sample books
        context.Books.AddRange(
            new WebApplication4.Models.Book
            {
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Publisher = "Scribner",
                ISBN = "978-0743273565",
                Category = "Fiction",
                PageCount = 180,
                Price = 12.99m
            },
            new WebApplication4.Models.Book
            {
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                Publisher = "HarperCollins",
                ISBN = "978-0061120084",
                Category = "Fiction",
                PageCount = 336,
                Price = 14.99m
            },
            new WebApplication4.Models.Book
            {
                Title = "1984",
                Author = "George Orwell",
                Publisher = "Signet Classic",
                ISBN = "978-0451524935",
                Category = "Science Fiction",
                PageCount = 328,
                Price = 9.99m
            },
            new WebApplication4.Models.Book
            {
                Title = "The Hobbit",
                Author = "J.R.R. Tolkien",
                Publisher = "Houghton Mifflin",
                ISBN = "978-0547928227",
                Category = "Fantasy",
                PageCount = 320,
                Price = 13.99m
            },
            new WebApplication4.Models.Book
            {
                Title = "Pride and Prejudice",
                Author = "Jane Austen",
                Publisher = "Penguin Classics",
                ISBN = "978-0141439518",
                Category = "Romance",
                PageCount = 480,
                Price = 8.99m
            }
        );
        
        // Save changes to the database
        context.SaveChanges();
    }
}

app.Run();
