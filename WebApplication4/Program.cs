using WebApplication4.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using System.Diagnostics;
using System.Runtime.InteropServices;

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

// Add SPA static files
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "bookstore-client/build";
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowReactApp");

// Enable static files
app.UseStaticFiles();
app.UseSpaStaticFiles();

// Map controller routes
app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<BookStoreContext>();
    
    // Ensure database is created
    context.Database.EnsureCreated();
}

// Configure the SPA
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "bookstore-client";

    if (app.Environment.IsDevelopment())
    {
        // Start the React development server
        spa.UseReactDevelopmentServer(npmScript: "start");
        
        // Open browser automatically
        var url = "http://localhost:3000";
        try
        {
            // Open browser based on OS
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                Process.Start(new ProcessStartInfo("cmd", $"/c start {url}") { CreateNoWindow = true });
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                Process.Start("xdg-open", url);
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                Process.Start("open", url);
            }
        }
        catch
        {
            // Ignore any errors when trying to open the browser
        }
    }
});

app.Run();
