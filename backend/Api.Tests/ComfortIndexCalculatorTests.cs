using Api;
using Xunit;

namespace Api.Tests;

/// <summary>
/// Unit tests for the Comfort Index calculation algorithm
/// </summary>
public class ComfortIndexCalculatorTests
{
    [Fact]
    public void Calculate_OptimalConditions_Returns100()
    {
        // Arrange: Perfect conditions (22°C, 50% humidity, 12 km/h wind)
        double tempC = 22;
        int humidity = 50;
        double windKmh = 12;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert
        Assert.Equal(100, result);
    }

    [Fact]
    public void Calculate_VeryHotTemperature_ReturnsLowScore()
    {
        // Arrange: Very hot day (40°C)
        double tempC = 40;
        int humidity = 50;
        double windKmh = 12;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Temperature deviation of 18°C should significantly reduce score
        Assert.True(result <= 50, $"Expected score <= 50 for very hot conditions, got {result}");
    }

    [Fact]
    public void Calculate_VeryColdTemperature_ReturnsLowScore()
    {
        // Arrange: Very cold day (0°C)
        double tempC = 0;
        int humidity = 50;
        double windKmh = 12;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Temperature deviation of 22°C should significantly reduce score
        Assert.True(result <= 45, $"Expected score <= 45 for very cold conditions, got {result}");
    }

    [Fact]
    public void Calculate_HighHumidity_ReducesScore()
    {
        // Arrange: High humidity (90%)
        double tempC = 22;
        int humidity = 90;
        double windKmh = 12;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: High humidity should reduce score
        Assert.True(result < 100, $"Expected score < 100 for high humidity, got {result}");
        Assert.True(result > 60, $"Expected score > 60 (temp is optimal), got {result}");
    }

    [Fact]
    public void Calculate_LowHumidity_ReducesScore()
    {
        // Arrange: Low humidity (10%)
        double tempC = 22;
        int humidity = 10;
        double windKmh = 12;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Low humidity should reduce score
        Assert.True(result < 100, $"Expected score < 100 for low humidity, got {result}");
        Assert.True(result > 60, $"Expected score > 60 (temp is optimal), got {result}");
    }

    [Fact]
    public void Calculate_HighWind_ReducesScore()
    {
        // Arrange: High wind (40 km/h)
        double tempC = 22;
        int humidity = 50;
        double windKmh = 40;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: High wind should reduce score slightly
        Assert.True(result < 100, $"Expected score < 100 for high wind, got {result}");
        Assert.True(result > 80, $"Expected score > 80 (wind has low weight), got {result}");
    }

    [Fact]
    public void Calculate_NoWind_ReducesScore()
    {
        // Arrange: No wind (0 km/h)
        double tempC = 22;
        int humidity = 50;
        double windKmh = 0;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: No wind should reduce score slightly
        Assert.True(result < 100, $"Expected score < 100 for no wind, got {result}");
        Assert.True(result > 90, $"Expected score > 90 (wind has low weight), got {result}");
    }

    [Fact]
    public void Calculate_ExtremeConditions_ReturnsZero()
    {
        // Arrange: Extreme conditions (-40°C, 100% humidity, 100 km/h wind)
        double tempC = -40;
        int humidity = 100;
        double windKmh = 100;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Extreme conditions should return very low score
        Assert.True(result >= 0, "Score should never be negative");
        Assert.True(result <= 10, $"Expected score <= 10 for extreme conditions, got {result}");
    }

    [Theory]
    [InlineData(22, 50, 12, 100)]    // Perfect conditions
    [InlineData(20, 45, 10, 92)]     // Good conditions
    [InlineData(25, 60, 15, 81)]     // Decent conditions
    [InlineData(30, 70, 20, 58)]     // Moderate conditions
    [InlineData(35, 80, 30, 36)]     // Poor conditions
    public void Calculate_VariousScenarios_ReturnsExpectedRange(double tempC, int humidity, double windKmh, int expectedScore)
    {
        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Allow 5-point tolerance for rounding
        Assert.InRange(result, expectedScore - 5, expectedScore + 5);
    }

    [Fact]
    public void Calculate_ScoreNeverExceeds100()
    {
        // Arrange: Beyond optimal conditions
        double tempC = 22;
        int humidity = 50;
        double windKmh = 12;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert
        Assert.True(result <= 100, $"Score should never exceed 100, got {result}");
    }

    [Fact]
    public void Calculate_ScoreNeverBelowZero()
    {
        // Arrange: Extremely poor conditions
        double tempC = -50;
        int humidity = 100;
        double windKmh = 150;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert
        Assert.True(result >= 0, $"Score should never be negative, got {result}");
    }

    [Fact]
    public void Calculate_TemperatureHasHighestWeight()
    {
        // Arrange: Two scenarios - one with bad temp, one with bad humidity
        double optimalTemp = 22;
        double badTemp = 35;
        int optimalHumidity = 50;
        int badHumidity = 90;
        double optimalWind = 12;

        // Act
        int scoreBadTemp = ComfortIndexCalculator.Calculate(badTemp, optimalHumidity, optimalWind);
        int scoreBadHumidity = ComfortIndexCalculator.Calculate(optimalTemp, badHumidity, optimalWind);

        // Assert: Bad temperature should impact score more than bad humidity (55% vs 30% weight)
        Assert.True(scoreBadTemp < scoreBadHumidity, 
            $"Temperature should have more impact than humidity. BadTemp score: {scoreBadTemp}, BadHumidity score: {scoreBadHumidity}");
    }

    [Fact]
    public void Calculate_WindHasLowestWeight()
    {
        // Arrange: Compare impact of wind vs humidity
        double optimalTemp = 22;
        int optimalHumidity = 50;
        int badHumidity = 90;
        double optimalWind = 12;
        double badWind = 40;

        // Act
        int scoreBadWind = ComfortIndexCalculator.Calculate(optimalTemp, optimalHumidity, badWind);
        int scoreBadHumidity = ComfortIndexCalculator.Calculate(optimalTemp, badHumidity, optimalWind);

        // Assert: Bad humidity should impact score more than bad wind (30% vs 15% weight)
        Assert.True(scoreBadWind > scoreBadHumidity, 
            $"Wind should have less impact than humidity. BadWind score: {scoreBadWind}, BadHumidity score: {scoreBadHumidity}");
    }

    [Fact]
    public void Calculate_RealWorldExample_Sydney()
    {
        // Arrange: Typical Sydney summer day
        double tempC = 27.8;
        int humidity = 65;
        double windKmh = 15;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Should be in "good" range (70-89)
        Assert.InRange(result, 60, 85);
    }

    [Fact]
    public void Calculate_RealWorldExample_Moscow()
    {
        // Arrange: Typical Moscow winter day
        double tempC = -19.8;
        int humidity = 85;
        double windKmh = 18;

        // Act
        int result = ComfortIndexCalculator.Calculate(tempC, humidity, windKmh);

        // Assert: Should be in "poor" range (0-49)
        Assert.InRange(result, 0, 30);
    }
}
