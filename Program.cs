var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
app.MapDefaultControllerRoute();
app.MapControllerRoute("game", "{controller=Game}/{action=Index}/{id?}");
app.Run();
