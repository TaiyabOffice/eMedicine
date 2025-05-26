using eMedicineAdmin.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure HTTP Client
builder.Services.AddHttpClient("eMedicineClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["HttpClient:BaseAddress"] ?? "https://api.example.com/");
    client.DefaultRequestHeaders.Add("User-Agent", builder.Configuration["HttpClient:UserAgent"] ?? "eMedicineAdminClient");
    client.DefaultRequestHeaders.Add("Accept", builder.Configuration["HttpClient:Accept"] ?? "application/json");
});

// Add Controllers with Views
builder.Services.AddControllersWithViews();

// Add Distributed Cache and Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Session timeout duration
    options.Cookie.HttpOnly = true;                // Make the session cookie accessible only via HTTP
    options.Cookie.IsEssential = true;             // Ensure the cookie is considered essential
});

// Add HttpContext Accessor and Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<VisitorService>(); // Replace with AddScoped if needed

var app = builder.Build();

// Configure middleware for error handling
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error"); // Redirect to Error action in HomeController
    app.UseHsts();                          // Enforce HTTPS in production
}

// Configure middleware
app.UseHttpsRedirection();
app.UseStaticFiles();  // Serve static files (wwwroot)

app.UseRouting();      // Enable routing

app.UseSession();      // Enable session middleware
app.UseAuthorization(); // Enable authorization middleware

// Configure default route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Login}/{id?}");

// Run the application
app.Run();


