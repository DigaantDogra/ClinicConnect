using ClinicConnectService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5174") // React app URL
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register services
builder.Services.AddHttpClient();
builder.Services.AddScoped<ICarePlanService, CarePlanService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("ReactAppPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
