## Weather Probability API Endpoint

**Endpoint:** `/api/weather_probability`  
**Methods:** GET

### Description
This endpoint retrieves weather data for a specific location and date range, then calculates weather probability statistics based on historical data.

### Parameters
- `lat` (float, required): Latitude coordinate of the location  
- `lon` (float, required): Longitude coordinate of the location
- `month` (int, required): Month number (1-12)
- `day` (int, required): Day of the month
<!-- - `day_range` (int, required): Number of days to include in the range
- `years_back` (int, required): Number of years back to look for historical data -->
<!-- - `parameters` (string, required): Comma-separated list of weather parameters to retrieve -->
<!-- - `format` (string, required): Data format specification -->

### Response

> Not: Yanıtlar güncellenecek. Şimdilik geçici test olarak kullanılacak API yanıtı.

Returns JSON object with:
- `is_ok` (boolean): Success status
- `temperature` (string): Calculated temperature with unit (temporary implementation)
- `error` (string): Error message if request fails
