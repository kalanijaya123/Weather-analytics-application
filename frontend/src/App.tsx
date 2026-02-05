import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, error } =
    useAuth0();

  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false; // or use prefers-color-scheme if desired
  });

  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'temp' | 'name'>('rank');
  const [filterLevel, setFilterLevel] = useState<
    'all' | 'excellent' | 'good' | 'moderate' | 'poor'
  >('all');

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      axios
        .get('http://localhost:5212/api/weather') // ← adjust port if needed
        .then((res) => setWeather(res.data))
        .catch((err) => console.error('Weather fetch error:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getFilteredAndSortedWeather = () => {
    let filtered = weather.filter((w: any) => w?.item && w?.rank);

    // Filter by comfort level
    if (filterLevel !== 'all') {
      filtered = filtered.filter((w: any) => {
        const score = w.item.comfortScore;
        if (filterLevel === 'excellent') return score >= 90;
        if (filterLevel === 'good') return score >= 70 && score < 90;
        if (filterLevel === 'moderate') return score >= 50 && score < 70;
        if (filterLevel === 'poor') return score < 50;
        return true;
      });
    }

    // Sort
    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'score') return b.item.comfortScore - a.item.comfortScore;
      if (sortBy === 'temp') return b.item.tempC - a.item.tempC;
      if (sortBy === 'name') return a.item.name.localeCompare(b.item.name);
      return 0;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-950 text-gray-700 dark:text-gray-100">
        <div className="text-2xl font-medium">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center border border-blue-100 dark:border-gray-700">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-100">
            Authentication Error
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.href = window.location.origin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredAndSortedWeather();

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#030712' : '#eff6ff', color: darkMode ? '#f3f4f6' : '#374151' }}>
      {/* Header */}
      <header className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ backgroundColor: darkMode ? '#4338ca' : '#93c5fd', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 className="text-3xl font-bold text-white">Weather App</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-indigo-300 hover:bg-blue-50 dark:hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-indigo-300 hover:bg-blue-50 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-bold transition-colors shadow-sm"
            >
              Log in with Auth0
            </button>
          )}
        </div>
      </header>

      {!isAuthenticated ? (
        /* Login screen – already quite good, minor dark mode tweaks */
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-2xl p-8" style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#dbeafe'}`, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4" style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}>
                Welcome to Weather Comfort Index
              </h2>
              <p className="text-lg" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                View real-time comfort rankings powered by OpenWeatherMap
              </p>
            </div>

            <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.1)' : '#dbeafe', border: `1px solid ${darkMode ? '#4338ca' : '#93c5fd'}` }}>
              <p className="font-medium" style={{ color: darkMode ? '#a5b4fc' : '#1e40af' }}>
                🔐 Authentication Required
              </p>
              <p className="text-sm mt-1" style={{ color: darkMode ? '#818cf8' : '#2563eb' }}>
                Log in to access city weather data and comfort scores.
              </p>
            </div>

            <button
              onClick={() => loginWithRedirect()}
              className="w-full py-4 rounded-lg font-bold text-xl transition-colors"
              style={{ backgroundColor: darkMode ? '#4f46e5' : '#3b82f6', color: '#ffffff' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#4338ca' : '#2563eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#4f46e5' : '#3b82f6'}
            >
              Log in with Auth0
            </button>
          </div>
        </div>
      ) : (
        <main className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <p className="text-center text-xl">Loading weather data...</p>
          ) : (
            <>
              {/* Controls */}
              <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#bfdbfe'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="flex flex-col sm:flex-row gap-6 items-end">
                  <div className="flex-1 min-w-[220px]">
                    <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition"
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#f3f4f6' : '#1f2937',
                        border: `1px solid ${darkMode ? '#4b5563' : '#bfdbfe'}`
                      }}
                    >
                      <option value="rank">Rank (Best First)</option>
                      <option value="score">Comfort Score (High → Low)</option>
                      <option value="temp">Temperature (High → Low)</option>
                      <option value="name">City Name (A-Z)</option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[220px]">
                    <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}>
                      Filter Comfort Level
                    </label>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition"
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#f3f4f6' : '#1f2937',
                        border: `1px solid ${darkMode ? '#4b5563' : '#bfdbfe'}`
                      }}
                    >
                      <option value="all">All Cities ({weather.length})</option>
                      <option value="excellent">Excellent (≥90)</option>
                      <option value="good">Good (70–89)</option>
                      <option value="moderate">Moderate (50–69)</option>
                      <option value="poor">Poor (0-49)</option>
                    </select>
                  </div>

                  <div className="text-sm" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    Showing {filteredData.length} {filteredData.length === 1 ? 'city' : 'cities'}
                  </div>
                </div>
              </div>

              {/* Charts – improved contrast & colors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Temp Bar Chart */}
                <div className="rounded-xl p-6" style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#bfdbfe'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}>
                    Temperature by City (°C)
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                      <XAxis
                        dataKey="item.name"
                        angle={-45}
                        textAnchor="end"
                        height={90}
                        tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          borderColor: darkMode ? '#4b5563' : '#e0e7ff',
                          borderRadius: '0.5rem',
                          color: darkMode ? '#f3f4f6' : '#1e293b',
                        }}
                      />
                      <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#64748b' }} />
                      <Bar dataKey="item.tempC" fill="#60a5fa" name="Temperature (°C)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Comfort Line Chart */}
                <div className="rounded-xl p-6" style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#bfdbfe'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}>
                    Comfort Score Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                      <XAxis
                        dataKey="item.name"
                        angle={-45}
                        textAnchor="end"
                        height={90}
                        tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 12 }}
                      />
                      <YAxis domain={[0, 100]} tick={{ fill: darkMode ? '#9ca3af' : '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          borderColor: darkMode ? '#4b5563' : '#e0e7ff',
                          borderRadius: '0.5rem',
                          color: darkMode ? '#f3f4f6' : '#1e293b',
                        }}
                      />
                      <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#64748b' }} />
                      <Line
                        type="monotone"
                        dataKey="item.comfortScore"
                        stroke="#34d399"
                        strokeWidth={3}
                        dot={{ fill: '#34d399', stroke: darkMode ? '#064e3b' : '#fff', r: 5 }}
                        activeDot={{ r: 8 }}
                        name="Comfort Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* City Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.map((w: any) => (
                  <div
                    key={w.item.name}
                    className="rounded-2xl overflow-hidden transition-shadow"
                    style={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#bfdbfe'}`,
                      boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div className="h-2" style={{ background: darkMode ? 'linear-gradient(to right, #6366f1, #3b82f6)' : 'linear-gradient(to right, #93c5fd, #60a5fa)' }} />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold" style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}>
                            {w.item.name}
                          </h2>
                          <p className="text-sm capitalize mt-1" style={{ color: darkMode ? '#9ca3af' : '#9ca3af' }}>
                            #{w.rank} • {w.item.description}
                          </p>
                        </div>
                        <img
                          src={`https://openweathermap.org/img/wn/${w.item.icon}@4x.png`}
                          alt={w.item.description}
                          className="w-20 h-20 -mt-3 object-contain"
                        />
                      </div>

                      <div className="flex items-end gap-5">
                        <div className="text-5xl font-light" style={{ color: darkMode ? '#f3f4f6' : '#374151' }}>
                          {w.item.tempC}°C
                        </div>
                        <div>
                          <div className="text-5xl font-bold" style={{ color: darkMode ? '#34d399' : '#10b981' }}>
                            {w.item.comfortScore}
                          </div>
                          <div className="text-xs uppercase tracking-wide mt-1" style={{ color: darkMode ? '#9ca3af' : '#9ca3af' }}>
                            Comfort Score
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
                  No cities match the current filter/sort settings.
                </div>
              )}
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;