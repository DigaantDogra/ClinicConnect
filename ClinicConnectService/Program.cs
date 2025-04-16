using ClinicConnectService.Services;
using ClinicConnectService.DataService;
using ClinicConnectService.Service;
using System;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var value = parts[1].Trim().Trim('"');
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}

// Verify environment variables
var credentialsPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");
var projectId = Environment.GetEnvironmentVariable("PROJECT_ID");

if (string.IsNullOrEmpty(credentialsPath))
{
    throw new InvalidOperationException("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set");
}

if (string.IsNullOrEmpty(projectId))
{
    throw new InvalidOperationException("PROJECT_ID environment variable is not set");
}

if (!File.Exists(credentialsPath))
{
    throw new FileNotFoundException($"Firebase credentials file not found at: {credentialsPath}");
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Register services
builder.Services.AddHttpClient();
builder.Services.AddScoped<ICarePlanService, CarePlanService>();
builder.Services.AddSingleton<IFirebaseService, FirebaseService>();

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

var app = builder.Build();

// Initialize Firebase
var firebaseService = app.Services.GetRequiredService<IFirebaseService>();
firebaseService.InitializeFirebase();

app.UseHttpsRedirection();
app.UseCors("ReactAppPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
