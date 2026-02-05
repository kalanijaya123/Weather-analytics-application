using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using Api;

internal class Program
{
    private static async Task Main(string[] args)
    {
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

        // Main endpoint (PDF: fetch, compute, rank, cache)
        app.MapGet("/api/weather", async (IMemoryCache cache) =>
        {
            var processedKey = "processed_weather";
            if (cache.TryGetValue(processedKey, out List<object>? cachedData))
            {
                cacheHits++;
                return Results.Ok(cachedData);
            }

            cacheMisses++;
            var results = new List<object>();

            foreach (var city in cities.Take(15))
            {
                var rawKey = $"raw_{city.id}";
                WeatherResponse? raw;

                if (!cache.TryGetValue(rawKey, out raw))
                {
                    cacheMisses++;
                    var url = $"https://api.openweathermap.org/data/2.5/weather?id={city.id}&appid={apiKey}&units=metric";
                    using var client = new HttpClient();
                    var json = await client.GetStringAsync(url);
                    raw = JsonSerializer.Deserialize<WeatherResponse>(json);
                    cache.Set(rawKey, raw, TimeSpan.FromMinutes(5)); // 5 min raw cache (PDF)
                }
                else cacheHits++;

                if (raw == null) continue;

                var tempC = raw.main.temp;
                var humidity = raw.main.humidity;
                var windKmh = raw.wind.speed * 3.6;
                var score = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

                results.Add(new
                {
                    Name = city.name,
                    Description = raw.weather[0].description,
                    Icon = raw.weather[0].icon,
                    TempC = Math.Round(tempC, 1),
                    ComfortScore = score
                });
            }

            // Rank: Most Comfortable → Least 
            var ranked = results
                .OrderByDescending(x => ((dynamic)x).ComfortScore)
                .Select((item, index) => new { Item = item, Rank = index + 1 })
                .ToList();


            cache.Set(processedKey, ranked, TimeSpan.FromMinutes(5)); // processed cache
            return Results.Ok(ranked);
        });

        // Debug endpoint 
        app.MapGet("/api/cache-status", () => Results.Ok(new { Hits = cacheHits, Misses = cacheMisses }));

        app.Run();
    }
}

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

record WeatherResponse(Weather[] weather, Main main, Wind wind);
record Weather(string description, string icon);
record Main(double temp, int humidity);
record Wind(double speed);