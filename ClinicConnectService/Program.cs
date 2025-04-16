using ClinicConnectService.Services;
using ClinicConnectService.DataService;
using ClinicConnectService.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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
builder.Services.AddSingleton<IFirebaseService, FirebaseService>();

var app = builder.Build();

// Initialize Firebase
var firebaseService = app.Services.GetRequiredService<IFirebaseService>();
firebaseService.InitializeFirebase();

app.UseHttpsRedirection();
app.UseCors("ReactAppPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
