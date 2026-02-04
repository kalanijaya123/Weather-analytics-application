# Weather Analytics Application - Fidenz Assignment

A full-stack weather analytics application with authentication, featuring a custom Comfort Index algorithm to rank cities by livability based on weather conditions.

## 🌟 Features

- **Weather Data Retrieval**: Fetches real-time weather data from OpenWeatherMap API
- **Custom Comfort Index**: Proprietary algorithm ranking cities from most to least comfortable
- **Server-Side Caching**: 5-minute caching for optimized performance
- **Authentication**: Secure Auth0 integration with MFA support
- **Responsive Design**: Mobile-first UI built with React and Tailwind CSS v4
- **Real-time Updates**: Dynamic weather data with automatic ranking

## 🏗️ Architecture

### Backend (.NET 8 Minimal API)
- **Framework**: ASP.NET Core 8.0
- **Caching**: In-memory cache with 5-minute expiration
- **CORS**: Configured for cross-origin requests
- **API Endpoints**:
  - `GET /api/weather` - Returns ranked weather data with comfort scores
  - `GET /api/cache-status` - Debug endpoint showing cache hits/misses

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Authentication**: Auth0 React SDK
- **HTTP Client**: Axios

## 📊 Comfort Index Algorithm

### Formula Design

The Comfort Index is calculated using three key weather parameters:

```
Comfort Score = (TempScore × 0.55) + (HumidityScore × 0.30) + (WindScore × 0.15)
```

### Parameter Weights & Reasoning

1. **Temperature (55% weight)** - Most significant factor
   - Optimal: 22°C
   - Score calculation: `100 - |ActualTemp - 22| × 5`
   - Reasoning: Temperature has the most direct impact on human comfort. Studies show 20-24°C is ideal for most people.

2. **Humidity (30% weight)** - Second most important
   - Optimal: 50%
   - Score calculation: `100 - |ActualHumidity - 50| × 2.5`
   - Reasoning: High humidity makes heat feel worse, low humidity causes discomfort. 40-60% is the comfortable range.

3. **Wind Speed (15% weight)** - Moderate impact
   - Optimal: 12 km/h (light breeze)
   - Score calculation: `100 - |ActualWind - 12| × 4`
   - Reasoning: Light breeze is pleasant; too much or too little affects comfort. Wind has less direct impact than temperature/humidity.

### Why These Parameters?

- **Temperature**: Universal comfort indicator, affects body's ability to regulate heat
- **Humidity**: Affects perceived temperature and respiratory comfort
- **Wind Speed**: Influences wind chill and heat dissipation

### Trade-offs Considered

1. **Not included - Pressure**: Minimal impact on day-to-day comfort for most people
2. **Not included - Cloudiness**: Subjective preference (some prefer sunny, others cloudy)
3. **Not included - Visibility**: Only critical for specific activities, not general comfort
4. **Simplified formula**: Linear scoring for simplicity; real-world comfort is non-linear but this provides good approximations

### Score Range

- **90-100**: Excellent comfort conditions
- **70-89**: Good comfort
- **50-69**: Moderate comfort
- **30-49**: Poor comfort
- **0-29**: Very uncomfortable

## 🚀 Setup Instructions

### Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- OpenWeatherMap API key
- Auth0 account

### Backend Setup

1. Navigate to backend directory:
```bash
cd Weather_analytics_application/backend/Api
```

2. Set OpenWeatherMap API key (optional - default key included):
```bash
# Windows PowerShell
$env:OPENWEATHER_API_KEY="your_api_key_here"

# Linux/Mac
export OPENWEATHER_API_KEY="your_api_key_here"
```

3. Run the backend:
```bash
dotnet run
```

Backend will start on `http://localhost:5212`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Weather_analytics_application/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:5173` (or next available port)

### Testing the Application

1. Open browser to `http://localhost:5173`
2. Click "Log in with Auth0"
3. Use test credentials:
   - Email: `careers@fidenz.com`
   - Password: `Pass#fidenz`
4. View ranked weather data with comfort scores

## 🔒 Authentication & Authorization

### Auth0 Configuration

- **Domain**: `dev-d2l2uyw511hsvvru.us.auth0.com`
- **Client ID**: `Yak2f2K9SkMlAES2B0LH8qJdMHc2BhD6`
- **Features Enabled**:
  - ✅ Multi-Factor Authentication (MFA) via email
  - ✅ Restricted signups (disabled public registration)
  - ✅ Whitelisted user: careers@fidenz.com

### Security Features

1. **Protected Routes**: Dashboard only accessible after authentication
2. **Token-based Auth**: JWT tokens for secure API access
3. **MFA**: Email verification required for enhanced security
4. **Single Sign-On**: Auth0 SSO capabilities enabled

## 💾 Cache Design

### Two-Level Caching Strategy

1. **Raw Weather Data Cache**
   - Key: `raw_{cityId}`
   - Duration: 5 minutes
   - Purpose: Avoid redundant API calls to OpenWeatherMap

2. **Processed Results Cache**
   - Key: `processed_weather`
   - Duration: 5 minutes
   - Purpose: Store computed comfort scores and rankings

### Benefits

- **Reduced API Costs**: Fewer calls to OpenWeatherMap
- **Better Performance**: Instant responses for cached data
- **Cache Transparency**: Debug endpoint shows hit/miss statistics

### Monitoring

Access `http://localhost:5212/api/cache-status` to see:
```json
{
  "hits": 45,
  "misses": 3
}
```

## 📱 Responsive Design

- **Mobile-first approach**: Tailwind CSS responsive classes
- **Breakpoints**:
  - Mobile: 1 column grid
  - Tablet (sm): 2 columns
  - Desktop (lg): 3 columns
  - Large (xl): 4 columns
- **Dark mode ready**: Dark mode classes included

## 🌐 API Endpoints

### Weather Data
```
GET /api/weather
```
Returns ranked cities with weather and comfort scores.

**Response:**
```json
[
  {
    "item": {
      "name": "Sydney",
      "description": "clear sky",
      "icon": "01d",
      "tempC": 27.8,
      "comfortScore": 75
    },
    "rank": 1
  }
]
```

### Cache Status (Debug)
```
GET /api/cache-status
```
Returns cache hit/miss statistics.

**Response:**
```json
{
  "hits": 12,
  "misses": 3
}
```

## 🎯 Assignment Requirements Checklist

### Part 1 - Weather Analytics ✅
- [x] Reads city codes from cities.json (15 cities processed)
- [x] Fetches weather data from OpenWeatherMap
- [x] Custom Comfort Index with 3+ parameters
- [x] Backend computes comfort score (not frontend)
- [x] Score range: 0-100
- [x] Cities ranked from most to least comfortable
- [x] Displays: City name, weather description, temperature, comfort score, rank
- [x] Server-side caching (5 minutes)
- [x] Cache debug endpoint
- [x] Responsive UI (mobile + desktop)

### Part 2 - Authentication & Authorization ✅
- [x] Auth0 authentication
- [x] Protected dashboard (login required)
- [x] Login/logout flow
- [x] MFA via email verification
- [x] Disabled public signups
- [x] Whitelisted test user: careers@fidenz.com

### Additional Requirements ✅
- [x] Documentation in README
- [x] Comfort Index formula explanation
- [x] Cache design explanation
- [x] Trade-offs discussion
- [x] Setup instructions

## ⚠️ Known Limitations

1. **OpenWeatherMap Rate Limits**: Free tier allows 60 calls/minute
2. **Cache Storage**: In-memory cache is lost on server restart (use Redis for production)
3. **Single Server**: Not horizontally scalable without external cache
4. **API Key Security**: Currently hardcoded (should use secure key management)
5. **Error Handling**: Basic error handling (could be more comprehensive)
6. **City Selection**: Fixed to 15 cities (configurable but not dynamic)

## 🔧 Technologies Used

### Backend
- .NET 8.0
- ASP.NET Core Minimal APIs
- System.Text.Json
- In-Memory Caching

### Frontend
- React 19.2
- TypeScript 5.9
- Vite 7.2
- Tailwind CSS 4.1
- Auth0 React SDK 2.12
- Axios 1.13

## 📝 Future Enhancements

- [ ] Dark mode toggle
- [ ] Unit tests for Comfort Index
- [ ] Frontend sorting/filtering
- [ ] Temperature trend graphs
- [ ] Redis caching for production
- [ ] Environment variable management
- [ ] Comprehensive error handling
- [ ] API rate limiting
- [ ] User preferences (preferred cities, temperature units)
- [ ] Historical data tracking

## 👥 Team Access

Repository access granted to:
- kanishka.d@fidenz.com
- srimal.w@fidenz.com
- narada.a@fidenz.com
- amindu.l@fidenz.com
- niroshanan.s@fidenz.com

## 📄 License

This project is part of Fidenz Technologies assessment assignment.

---

**Author**: [Your Name]  
**Date**: February 2026  
**Assignment**: Full Stack Developer Position - Fidenz Technologies
