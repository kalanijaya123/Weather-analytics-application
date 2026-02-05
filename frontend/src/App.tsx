import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, error } = useAuth0();
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'temp' | 'name'>('rank');
  const [filterLevel, setFilterLevel] = useState<'all' | 'excellent' | 'good' | 'moderate' | 'poor'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      axios.get('http://localhost:5212/api/weather')
        .then(res => setWeather(res.data))
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
    let filtered = weather.filter((w: any) => w?.item);

    // Apply filter
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

    // Apply sorting
    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'score') return b.item.comfortScore - a.item.comfortScore;
      if (sortBy === 'temp') return b.item.tempC - a.item.tempC;
      if (sortBy === 'name') return a.item.name.localeCompare(b.item.name);
      return 0;
    });

    return sorted;
  };

  if (isLoading) return <div className="text-center py-20 text-2xl">Loading...</div>;

  // Display error if authentication fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{error.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Please ensure you're using the correct credentials or contact support.
            </p>
            <button
              onClick={() => window.location.href = window.location.origin}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="bg-indigo-600 p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fidenz Weather Comfort Index</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          {isAuthenticated ? (
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold">
              Logout
            </button>
          ) : (
            <button onClick={() => loginWithRedirect()} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg">
              Log in with Auth0
            </button>
          )}
        </div>
      </header>

      {!isAuthenticated ? (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Welcome to Weather Comfort Index</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                View real-time weather comfort rankings for cities worldwide
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">Important: Use Your Personal Email</h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1 list-disc list-inside">
                    <li>This app requires authentication with your personal email</li>
                    <li>Test credentials (careers@fidenz.com) are for demo purposes only</li>
                    <li>If stuck on verification code screen: Close the Auth0 tab and click login again</li>
                    <li>You can also clear your browser cache if issues persist</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => loginWithRedirect()} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-bold text-xl transition-colors shadow-lg"
              >
                🔐 Log in with Auth0
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Having trouble logging in?{' '}
                  <button
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Clear session and retry
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-center">Quick Tip: Stuck on Verification Code?</h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Close or go back in the Auth0 login popup/tab</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Return to this page and click "Log in with Auth0" again</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Enter your correct email address this time</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Or use "Clear session and retry" button above</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <main className="p-6 max-w-7xl mx-auto">
          {loading ? <p>Loading weather data...</p> : (
            <>
              {/* Filters and Sorting */}
              <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="rank">Rank (Best First)</option>
                      <option value="score">Comfort Score (High to Low)</option>
                      <option value="temp">Temperature (Hot to Cold)</option>
                      <option value="name">City Name (A-Z)</option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold mb-2">Filter by Comfort Level</label>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value as any)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="all">All Cities ({weather.filter((w: any) => w?.item).length})</option>
                      <option value="excellent">Excellent (90-100)</option>
                      <option value="good">Good (70-89)</option>
                      <option value="moderate">Moderate (50-69)</option>
                      <option value="poor">Poor (0-49)</option>
                    </select>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {getFilteredAndSortedWeather().length} cities
                  </div>
                </div>
              </div>

              {/* Temperature & Comfort Score Graphs */}
              <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temperature Bar Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Temperature by City (°C)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getFilteredAndSortedWeather()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="item.name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: darkMode ? '#9ca3af' : '#374151', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#374151' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: '1px solid #4b5563',
                          borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: darkMode ? '#fff' : '#000' }}
                      />
                      <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#374151' }} />
                      <Bar dataKey="item.tempC" fill="#6366f1" name="Temperature (°C)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Comfort Score Line Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Comfort Score Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getFilteredAndSortedWeather()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="item.name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: darkMode ? '#9ca3af' : '#374151', fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: darkMode ? '#9ca3af' : '#374151' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: '1px solid #4b5563',
                          borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: darkMode ? '#fff' : '#000' }}
                      />
                      <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#374151' }} />
                      <Line
                        type="monotone"
                        dataKey="item.comfortScore"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Comfort Score"
                        dot={{ fill: '#10b981', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredAndSortedWeather().map((w: any) => (
                  <div key={w.item.name} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold">{w.item.name}</h2>
                          <p className="text-gray-500 dark:text-gray-400 capitalize">#{w.rank} • {w.item.description}</p>
                        </div>
                        <img src={`https://openweathermap.org/img/wn/${w.item.icon}@4x.png`} alt="icon" className="w-20 h-20 -mt-4" />
                      </div>

                      <div className="mt-8 flex items-end gap-4">
                        <div className="text-6xl font-light">{w.item.tempC}°C</div>
                        <div className="mb-2">
                          <div className="text-5xl font-bold text-emerald-500">{w.item.comfortScore}</div>
                          <div className="text-xs uppercase tracking-widest -mt-1">Comfort</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;