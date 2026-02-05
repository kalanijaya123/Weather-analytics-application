# 🌦️ Weather Comfort Index - Full Stack Application

> A sophisticated weather analytics platform that ranks cities by comfort level using a proprietary algorithm. Built with .NET 8, React 19, and Auth0 authentication.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Auth0](https://img.shields.io/badge/Auth0-Secured-EB5424?logo=auth0)](https://auth0.com/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Comfort Index Algorithm](#-comfort-index-algorithm)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Security](#-security)
- [Testing](#-testing)
- [Project Structure](#-project-structure)

## 🎯 Overview

This full-stack application helps users discover the most comfortable cities worldwide based on real-time weather data. It features a custom Comfort Index algorithm that analyzes temperature, humidity, and wind speed to rank cities from most to least comfortable.

**Built for**: Fidenz Technologies Full Stack Developer Assessment

### ✨ Key Highlights

- **🎨 Modern UI**: Clean, responsive design with light/dark mode support
- **⚡ Performance**: Server-side caching with 5-minute expiration
- **🔒 Secure**: Auth0 authentication with MFA support
- **📊 Data Visualization**: Interactive charts showing temperature trends and comfort scores
- **🎛️ Filtering**: Sort and filter cities by comfort level
- **🧪 Tested**: 20 comprehensive unit tests for Comfort Index calculation

## 🚀 Features

### Core Features
✅ Real-time weather data from 15+ cities worldwide  
✅ Custom Comfort Index algorithm (Temperature 55% + Humidity 30% + Wind 15%)  
✅ Automatic city ranking by comfort score  
✅ Server-side caching for optimal performance  
✅ Auth0 authentication with MFA  
✅ Protected dashboard routes  
✅ Responsive design (mobile, tablet, desktop)  

### Bonus Features
✅ **Dark/Light Mode**: Toggle between themes  
✅ **Advanced Filtering**: Filter by comfort level (Excellent, Good, Moderate, Poor)  
✅ **Dynamic Sorting**: Sort by rank, score, temperature, or name  
✅ **Data Visualization**: Bar chart (temperature) + Line chart (comfort trend)  
✅ **Unit Tests**: 20 tests covering edge cases and real-world scenarios  
✅ **Error Handling**: Graceful error screens with retry functionality  

## 🎬 Demo

### Login Screen
```
🔐 Secure authentication powered by Auth0
- Email-based MFA
- Session management
- Remember me functionality
```

### Dashboard
```
📊 Weather cards showing:
- City name & current conditions
- Temperature in Celsius
- Comfort score (0-100)
- Global rank position
- Weather icon
```

### Live Preview
```bash
Backend:  http://localhost:5212
Frontend: http://localhost:5173
```

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET 8.0 (ASP.NET Core Minimal APIs)
- **Caching**: In-Memory Cache
- **Serialization**: System.Text.Json
- **API**: OpenWeatherMap API
- **Testing**: xUnit

### Frontend
- **Framework**: React 19.2
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **Authentication**: Auth0 React SDK 2.12
- **HTTP Client**: Axios 1.13
- **Charts**: Recharts 2.15
- **State Management**: React Hooks

## 🏁 Getting Started

### Prerequisites

Before you begin, ensure you have:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Weather_analytics_application
```

2. **Backend Setup**
```bash
cd backend/Api
dotnet restore
dotnet run
```
✅ Backend running on `http://localhost:5212`

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on `http://localhost:5173`

### Quick Test

1. Open browser: `http://localhost:5173`
2. Click **"Log in with Auth0"**
3. Use test credentials:
   - 📧 Email: `careers@fidenz.com`
   - 🔑 Password: `Pass#fidenz`
4. View weather dashboard with ranked cities

## 📊 Comfort Index Algorithm

## 📊 Comfort Index Algorithm

### 🧮 The Formula

Our proprietary Comfort Index combines three weather parameters with scientifically-weighted importance:

```
Comfort Score = (Temperature Score × 0.55) + (Humidity Score × 0.30) + (Wind Score × 0.15)
```

### 🌡️ Parameter Breakdown

| Parameter | Weight | Optimal Value | Calculation |
|-----------|--------|---------------|-------------|
| **Temperature** | 55% | 22°C | `100 - \|temp - 22\| × 5` |
| **Humidity** | 30% | 50% | `100 - \|humidity - 50\| × 2.5` |
| **Wind Speed** | 15% | 12 km/h | `100 - \|wind - 12\| × 4` |

### 💡 Why These Weights?

**Temperature (55%)** - *Primary Comfort Driver*
- Most direct impact on human thermal comfort
- Research shows 20-24°C is optimal for most people
- Extreme temperatures cause immediate discomfort

**Humidity (30%)** - *Secondary Factor*
- Affects perceived temperature (heat index)
- High humidity reduces body's cooling ability
- Low humidity causes skin and respiratory issues
- Comfort range: 40-60%

**Wind Speed (15%)** - *Tertiary Modifier*
- Light breeze (12 km/h) is pleasant
- Too much wind causes discomfort
- Too little feels stagnant
- Less impactful than temperature/humidity

### 📈 Score Interpretation

| Score Range | Comfort Level | Description |
|-------------|---------------|-------------|
| 90-100 | 🌟 Excellent | Perfect weather conditions |
| 70-89 | ✅ Good | Pleasant and comfortable |
| 50-69 | 😐 Moderate | Tolerable but not ideal |
| 30-49 | ⚠️ Poor | Uncomfortable conditions |
| 0-29 | ❌ Very Poor | Highly unpleasant weather |

### 🔄 Trade-offs & Decisions

**✅ Included:**
- Temperature, Humidity, Wind - Universal comfort indicators
- Linear scoring - Simple, predictable, easy to understand
- 0-100 range - Intuitive percentage-based scoring

**❌ Not Included:**
- **Atmospheric Pressure**: Minimal day-to-day impact for most people
- **Cloudiness**: Subjective (some prefer sunny, others cloudy)
- **Visibility**: Only relevant for specific activities
- **Air Quality**: Not available in basic OpenWeatherMap tier
- **UV Index**: Time-dependent, less critical for general comfort

**📐 Simplifications:**
- Linear relationship (reality is non-linear but close enough)
- Fixed optimal points (varies by individual adaptation)
- Equal treatment of above/below optimal (asymmetric in reality)

These trade-offs prioritize **simplicity**, **universality**, and **data availability** while maintaining accuracy.

## 🌐 API Documentation

### Weather Endpoint

**GET** `/api/weather`

Returns ranked weather data with comfort scores.

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
  },
  {
    "item": {
      "name": "Tokyo",
      "description": "light rain",
      "icon": "10d",
      "tempC": 18.5,
      "comfortScore": 72
    },
    "rank": 2
  }
]
```

### Cache Status Endpoint

**GET** `/api/cache-status`

Returns cache performance metrics.

**Response:**
```json
{
  "hits": 145,
  "misses": 12
}
```

## 🏗️ Architecture

### System Design

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Browser   │ ←────→  │  React App   │ ←────→  │  .NET Backend   │
│  (Client)   │  HTTPS  │  (Frontend)  │   API   │    (Server)     │
└─────────────┘         └──────────────┘         └─────────────────┘
                              │                          │
                              │                          │
                              ↓                          ↓
                        ┌──────────┐              ┌─────────────┐
                        │  Auth0   │              │ OpenWeather │
                        │   SSO    │              │     API     │
                        └──────────┘              └─────────────┘
```

### Backend Architecture

- **Design Pattern**: Minimal API (lightweight, modern .NET approach)
- **Caching Strategy**: Two-level in-memory cache
  - Raw API responses (5 min TTL per city)
  - Processed results (5 min TTL for dataset)
- **CORS**: Enabled for localhost development
- **Separation of Concerns**: 
  - `Program.cs` - API routes & configuration
  - `ComfortIndexCalculator.cs` - Pure calculation logic (testable)

### Frontend Architecture

- **Component Structure**: Single-page application (SPA)
- **State Management**: React Hooks (useState, useEffect)
- **Authentication Flow**: Auth0 redirect-based login
- **Routing**: Protected dashboard route
- **Styling**: Utility-first with Tailwind CSS

### Data Flow

1. **User Login** → Auth0 → JWT Token → React App
2. **Data Request** → React → Backend API
3. **Cache Check** → HIT: Return cached data | MISS: Fetch from OpenWeatherMap
4. **Processing** → Calculate comfort scores → Rank cities
5. **Response** → JSON → React updates UI

## 🔒 Security

### Authentication & Authorization

- **Provider**: Auth0 (Industry-standard OAuth 2.0)
- **Domain**: `dev-d2l2uyw511hsvvru.us.auth0.com`
- **Client Type**: Single Page Application (SPA)
- **Flow**: Authorization Code Flow with PKCE

### Security Features

✅ **Protected Routes**: Dashboard requires authentication  
✅ **Token-Based Auth**: JWT tokens for API requests  
✅ **Multi-Factor Authentication**: Email verification enabled  
✅ **Restricted Signups**: Only whitelisted users can register  
✅ **HTTPS Ready**: Production deployment configured for SSL  
✅ **CORS Policy**: Restricted to allowed origins  

### Test Credentials

```
Email: careers@fidenz.com
Password: Pass#fidenz
MFA: Email verification code
```

⚠️ **Note**: These credentials are for evaluation purposes only.

## 🧪 Testing

### Unit Tests

**Location**: `backend/Api.Tests/ComfortIndexCalculatorTests.cs`

**Coverage**: 20 comprehensive tests including:
- ✅ Optimal conditions (perfect scores)
- ✅ Extreme temperatures (-40°C to 50°C)
- ✅ Extreme humidity (0% to 100%)
- ✅ Wind speed variations (0 to 100 km/h)
- ✅ Edge cases (exactly optimal values)
- ✅ Real-world city examples
- ✅ Weight verification

**Run Tests:**
```bash
cd backend/Api.Tests
dotnet test
```

**Expected Output:**
```
Passed! - 20 test(s) passed, 0 failed, 0 skipped
```

### Manual Testing Checklist

- [ ] Login with Auth0
- [ ] View weather dashboard
- [ ] Verify city rankings
- [ ] Check temperature display
- [ ] Test dark/light mode toggle
- [ ] Filter by comfort level
- [ ] Sort cities (4 options)
- [ ] View charts
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Logout functionality

## 📁 Project Structure

```
Weather_analytics_application/
├── backend/
│   ├── Api/
│   │   ├── Program.cs                 # API routes & config
│   │   ├── ComfortIndexCalculator.cs  # Algorithm logic
│   │   ├── cities.json                # City list (15 cities)
│   │   └── Api.csproj                 # Dependencies
│   └── Api.Tests/
│       ├── ComfortIndexCalculatorTests.cs
│       └── Api.Tests.csproj
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Main component
│   │   ├── main.tsx                   # App entry + Auth0
│   │   └── index.css                  # Tailwind imports
│   ├── package.json                   # Dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind setup
│   └── postcss.config.js              # PostCSS plugins
├── README.md                          # This file
├── AUTH0_SETUP.md                     # Auth0 configuration guide
├── ASSIGNMENT_COMPLETION.md           # Requirements checklist
└── .gitignore                         # Ignored files
```

## 💾 Caching Strategy

## 💾 Caching Strategy

### Two-Level Cache Design

**Level 1: Raw API Response Cache**
```
Key: "raw_{cityId}"
TTL: 5 minutes
Purpose: Avoid redundant OpenWeatherMap API calls
```

**Level 2: Processed Results Cache**
```
Key: "processed_weather"
TTL: 5 minutes
Purpose: Store calculated comfort scores and rankings
```

### Benefits

| Benefit | Impact |
|---------|--------|
| 💰 Cost Reduction | Fewer external API calls |
| ⚡ Performance | Sub-millisecond response time (cache hits) |
| 📊 Transparency | Debug endpoint shows hit/miss ratio |
| 🔄 Freshness | 5-minute TTL balances speed and accuracy |

### Cache Flow

```
Request → Check processed cache → HIT: Return
                                → MISS: Check raw cache → HIT: Calculate + Cache
                                                        → MISS: Fetch API + Cache + Calculate
```

### Monitoring

```bash
curl http://localhost:5212/api/cache-status
```

**Response:**
```json
{
  "hits": 145,
  "misses": 12
}
```

## 📱 Responsive Design

### Breakpoint Strategy

| Device | Breakpoint | Grid Columns | Target Width |
|--------|------------|--------------|--------------|
| 📱 Mobile | Default | 1 column | < 640px |
| 📱 Tablet | sm: | 2 columns | ≥ 640px |
| 💻 Laptop | lg: | 3 columns | ≥ 1024px |
| 🖥️ Desktop | xl: | 4 columns | ≥ 1280px |

### Mobile-First Approach

- Tailwind CSS responsive classes (`sm:`, `md:`, `lg:`, `xl:`)
- Touch-friendly buttons and controls
- Optimized chart sizing for small screens
- Hamburger menu for header actions (if needed)

## ⚙️ Configuration

### Environment Variables (Optional)

**Backend:**
```bash
# Windows PowerShell
$env:OPENWEATHER_API_KEY="your_api_key_here"

# Linux/Mac/Git Bash
export OPENWEATHER_API_KEY="your_api_key_here"
```

**Default API Key**: Included in code for easy evaluation (can be overridden)

### Cities Configuration

Edit `backend/Api/cities.json` to add/remove cities:

```json
[
  { "id": 2147714, "name": "Sydney" },
  { "id": 1850144, "name": "Tokyo" }
]
```

## 🎨 UI Features

### Theme Support
- ☀️ **Light Mode**: Clean, bright interface with soft blues
- 🌙 **Dark Mode**: Easy on the eyes with dark grays and muted colors
- Toggle button in header for instant switching

### Interactive Elements
- **Filtering**: 5 comfort levels (All, Excellent, Good, Moderate, Poor)
- **Sorting**: 4 options (Rank, Score, Temperature, Name)
- **Charts**: Interactive tooltips and legends
- **Cards**: Hover effects and smooth transitions

## ⚠️ Known Limitations

| Limitation | Impact | Production Solution |
|------------|--------|---------------------|
| In-memory cache | Lost on restart | Use Redis/Memcached |
| Single server | Not horizontally scalable | Distributed cache |
| Hardcoded API key | Security risk | Azure Key Vault / AWS Secrets |
| Rate limits | 60 calls/min (free tier) | Upgrade to paid tier |
| Fixed city list | Static configuration | Dynamic city selection |
| Basic error handling | Limited user feedback | Comprehensive error UI |

## 🚀 Deployment

### Production Checklist

- [ ] Move API keys to environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure production Auth0 tenant
- [ ] Set up distributed caching (Redis)
- [ ] Add application logging
- [ ] Configure CDN for frontend
- [ ] Set up monitoring (Application Insights / DataDog)
- [ ] Enable rate limiting
- [ ] Add health check endpoints
- [ ] Configure auto-scaling

### Suggested Stack

**Backend**: Azure App Service / AWS Elastic Beanstalk  
**Frontend**: Vercel / Netlify / Azure Static Web Apps  
**Cache**: Azure Cache for Redis / AWS ElastiCache  
**Monitoring**: Application Insights / CloudWatch  

## 📚 Additional Documentation

- [Auth0 Setup Guide](./AUTH0_SETUP.md) - Complete Auth0 configuration
- [Assignment Completion](./ASSIGNMENT_COMPLETION.md) - Requirements checklist
- [API Reference](#-api-documentation) - Endpoint documentation

## 🎯 Assignment Completion Status

### Mandatory Requirements ✅

- [x] Weather data from 15+ cities
- [x] Custom Comfort Index (3+ parameters)
- [x] Score range 0-100
- [x] Backend computation
- [x] Cities ranked by comfort
- [x] Display all required fields
- [x] Server-side caching (5 min)
- [x] Cache debug endpoint
- [x] Responsive UI
- [x] Auth0 authentication
- [x] Protected dashboard
- [x] MFA documentation
- [x] Restricted signups
- [x] Test credentials provided
- [x] Comprehensive README
- [x] Formula explanation
- [x] Trade-offs discussion

### Bonus Features ✅

- [x] Dark mode toggle
- [x] Unit tests (20 tests)
- [x] Frontend sorting & filtering
- [x] Temperature trend graphs






---

<div align="center">

**Built with** ❤️ **using .NET 8, React 19, and modern best practices**

[⬆ Back to Top](#️-weather-comfort-index---full-stack-application)

</div>
