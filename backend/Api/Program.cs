using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMemoryCache();
builder.Services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();
app.UseCors("AllowAll");

var cacheHits = 0;
var cacheMisses = 0;
var apiKey = Environment.GetEnvironmentVariable("OPENWEATHER_API_KEY") ?? "701abfa691c2b11f296426e4d098444d"; // replace or use env var