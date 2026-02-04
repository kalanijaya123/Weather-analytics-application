using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMemoryCache();
builder.Services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();
app.UseCors("AllowAll");

var cacheHits = 0;
var cacheMisses = 0;
var apiKey = Environment.GetEnvironmentVariable("OPENWEATHER_API_KEY") ?? "701abfa691c2b11f296426e4d098444d"; 

// Load cities.json 
var citiesJson = await File.ReadAllTextAsync("cities.json");
var cities = JsonSerializer.Deserialize<List<City>>(citiesJson) ?? new();

record City(int id, string name, string country);

record WeatherData(
    string Name,
    string Description,
    string Icon,
    double TempC,
    int Humidity,
    double WindSpeedKmh,
    int ComfortScore
);
// Comfort Index – backend only 
int CalculateComfortIndex(double tempC, int humidity, double windKmh)
{
    // Formula: Temperature 55%, Humidity 30%, Wind 15%
    double tempScore = Math.Max(0, 100 - Math.Abs(tempC - 22) * 5);
    double humScore  = Math.Max(0, 100 - Math.Abs(humidity - 50) * 2.5);
    double windScore = Math.Max(0, 100 - Math.Abs(windKmh - 12) * 4);

    double score = tempScore * 0.55 + humScore * 0.30 + windScore * 0.15;
    return (int)Math.Clamp(Math.Round(score), 0, 100);
}