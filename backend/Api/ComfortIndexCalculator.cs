namespace Api;

/// <summary>
/// Calculates comfort index based on weather parameters
/// </summary>
public static class ComfortIndexCalculator
{
    /// <summary>
    /// Calculates a comfort index score from 0-100 based on temperature, humidity, and wind speed.
    /// Higher scores indicate more comfortable conditions.
    /// </summary>
    /// <param name="tempC">Temperature in Celsius</param>
    /// <param name="humidity">Humidity percentage (0-100)</param>
    /// <param name="windKmh">Wind speed in kilometers per hour</param>
    /// <returns>Comfort index score (0-100)</returns>
    public static int Calculate(double tempC, int humidity, double windKmh)
    {
        // Formula: Temperature 55%, Humidity 30%, Wind 15%
        // Optimal values: 22°C, 50% humidity, 12 km/h wind
        
        double tempScore = Math.Max(0, 100 - Math.Abs(tempC - 22) * 5);
        double humScore = Math.Max(0, 100 - Math.Abs(humidity - 50) * 2.5);
        double windScore = Math.Max(0, 100 - Math.Abs(windKmh - 12) * 4);

        double score = tempScore * 0.55 + humScore * 0.30 + windScore * 0.15;
        return (int)Math.Clamp(Math.Round(score), 0, 100);
    }
}
