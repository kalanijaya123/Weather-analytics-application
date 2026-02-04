import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      axios.get('http://localhost:5212/api/weather')
        .then(res => setWeather(res.data))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (isLoading) return <div className="text-center py-20 text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="bg-indigo-600 p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fidenz Weather Comfort Index</h1>
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
      </header>

      {!isAuthenticated ? (
        <div className="text-center py-32 text-2xl">Please log in to see the dashboard (test user: careers@fidenz.com)</div>
      ) : (
        <main className="p-6 max-w-7xl mx-auto">
          {loading ? <p>Loading weather data...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {weather.filter((w: any) => w?.item).map((w: any) => (
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
          )}
        </main>
      )}
    </div>
  );
}

export default App;