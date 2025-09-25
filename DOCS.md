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
- `analysis_mode` (string, required): Analysis mode, either `detailed_analysis` or `quick_analysis`
<!-- - `day_range` (int, required): Number of days to include in the range
- `years_back` (int, required): Number of years back to look for historical data -->
<!-- - `parameters` (string, required): Comma-separated list of weather parameters to retrieve -->
<!-- - `format` (string, required): Data format specification -->

### Response

Returns JSON object with:

- `query` (object): Contains the input parameters
    - `location` (object): Location coordinates
        - `latitude` (float): Latitude value
        - `longitude` (float): Longitude value
    - `date` (object): Date information
        - `month` (string): Month in MM format
        - `day` (string): Day in DD format
- `analysis_summary` (object): Summary of the analysis
    - `title` (string): Analysis title with date
    - `data_source` (string): Source of weather data (NASA POWER MERRA-2 Dataset)
    - `data_points` (int): Number of data points analyzed
- `weather_probabilities` (object): Weather probability data
    - `statistics` (object): Statistical analysis results
        - `temperature` (object): Temperature statistics
            - `unit` (string): Temperature unit (Celsius)
            - `average` (float): Average temperature value
            - `average_range` (float): Temperature range information
        - `precipitation` (object): Precipitation statistics
            - `unit` (string): Precipitation unit (mm/day)
            - `average` (float): Average precipitation value
        - `wind` (object): Wind statistics
            - `unit` (string): Wind speed unit (m/s)
            - `average_speed` (float): Average wind speed value
        - `humidity` (object): Humidity statistics
            - `unit` (string): Humidity unit (%)
            - `average` (float): Average humidity value
    - `probabilities` (object): Calculated weather probabilities
        - > In Development
- `thresholds_info` (object): Information about analysis thresholds
    - `climate_zone` (string): Climate zone classification
    - `thresholds_used` (object): Threshold values used in analysis
- `error` (string): Error message if request fails

### Example Request
```
GET /api/weather_probability?lat=40.7589&lon=-73.9851&month=6&day=15&analysis_mode=detailed_analysis
```

### Example Response
```json
{
  "query": {
    "location": {
      "latitude": 40.7589,
      "longitude": -73.9851
    },
    "date": {
      "month": "09",
      "day": "25"
    },
    "analysis_mode": "detailed_analysis"
  },
  "analysis_summary": {
    "title": "Weather Analysis for 09/15",
    "analysis_mode": "detailed_analysis",
    "data_source": "NASA POWER MERRA-2 Dataset",
    "data_points": 30
  },
  "weather_probabilities": {
    "statistics": {
      "temperature": {
        "unit": "Celsius",
        "average": 24.5,
        "average_range": 3.2
      },
      "precipitation": {
        "unit": "mm/day",
        "average": 2.1
      },
      "wind": {
        "unit": "m/s",
        "average_speed": 4.8
      },
      "humidity": {
        "unit": "%",
        "average": 68.3
      }
    },
    "probabilities": {
      "note": "In Development"
    }
  },
  "thresholds_info": {
    "climate_zone": "temperate",
    "thresholds_used": {
      "comfortable_max": 25,
      "very_hot": 32,
      "very_cold": -5,
      "heavy_rain": 10,
      "very_windy": 14,
      "very_cloudy": 80,
    }
  }
}
```

### Error Response Example
```json
{
  "error": "Invalid coordinates: latitude must be between -90 and 90, longitude must be between -180 and 180."
}
```