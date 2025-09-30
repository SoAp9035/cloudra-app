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
  - `analysis_mode` (string): Analysis mode type
- `analysis_summary` (object): Summary of the analysis
  - `title` (string): Analysis title with date
  - `analysis_mode` (string): Analysis mode used
  - `data_source` (string): Source of weather data (NASA POWER MERRA-2 Dataset)
  - `data_points` (int): Number of data points analyzed
- `weather_probabilities` (object): Weather probability data
  - `statistics` (object): Statistical analysis results
    - `temperature` (object): Temperature statistics
      - `unit` (string): Temperature unit (Celsius)
      - `average` (float): Average temperature value
      - `average_range` (object): Temperature range information
        - `max` (float): Maximum average temperature
        - `min` (float): Minimum average temperature
    - `rain` (object): Rain statistics
      - `unit` (string): Rain unit (%)
      - `probability` (float): Rain probability percentage
    - `wind` (object): Wind statistics
      - `unit` (string): Wind speed unit (m/s)
      - `average_speed` (float): Average wind speed value
    - `humidity` (object): Humidity statistics
      - `unit` (string): Humidity unit (%)
      - `average` (float): Average humidity value
    - `cloud` (object): Cloudiness statistics
      - `unit` (string): Cloudiness unit (%)
      - `average` (float): Average cloudiness value
    - `snow_cover` (object): Snow cover statistics
      - `unit` (string): Snow cover unit (%)
      - `probability` (float): Snow cover probability percentage
    - `fog` (object): Fog statistics
      - `unit` (string): Fog unit (0-3 scale)
      - `status` (int): Fog status value
  - `probabilities` (object): Calculated weather probabilities
    - `heavy_precipitation_percent` (int): Heavy precipitation probability
    - `heavy_snowfall_percent` (int): Heavy snowfall probability
    - `uncomfortable_percent` (int): Uncomfortable weather probability
    - `very_cold_percent` (int): Very cold weather probability
    - `very_hot_percent` (int): Very hot weather probability
    - `very_windy_percent` (int): Very windy weather probability
- `thresholds_info` (object): Information about analysis thresholds
  - `climate_zone` (string): Climate zone classification
  - `thresholds_used` (object): Threshold values used in analysis
    - `comfortable_max` (int): Maximum comfortable temperature
    - `very_hot` (int): Very hot temperature threshold
    - `very_cold` (int): Very cold temperature threshold
    - `heavy_precipitation` (int): Heavy precipitation threshold
    - `very_windy` (int): Very windy threshold
- `error` (string): Error message if request fails

**Note:** All values return `None` if data is missing or unavailable.

### Example Request
```
GET /api/weather_probability?lat=40.7589&lon=-73.9851&month=6&day=15&analysis_mode=detailed_analysis
```

### Example Response
```json
{
  "query": {
    "location": {
      "latitude": 37.874641,
      "longitude": 32.493156
    },
    "date": {
      "month": "09",
      "day": "30"
    },
    "analysis_mode": "detailed_analysis"
  },
  "analysis_summary": {
    "title": "Weather Probabilities for 09/30",
    "analysis_mode": "detailed_analysis",
    "data_source": "NASA POWER MERRA-2 Dataset",
    "data_points": 30
  },
  "weather_probabilities": {
    "statistics": {
      "temperature": {
        "unit": "Celcius",
        "average": 16.2,
        "average_range": {
          "max": 23.3,
          "min": 10.0
        }
      },
      "rain": {
        "unit": "%",
        "probability": 36.7
      },
      "wind": {
        "unit": "m/s",
        "average_speed": 5.2
      },
      "humidity": {
        "unit": "%",
        "average": 50.9
      },
      "cloud": {
        "unit": "%",
        "average": 40.4
      },
      "snow_cover": {
        "unit": "%",
        "probability": 0.0
      },
      "fog": {
        "unit": "0-3",
        "status": 0
      }
    },
    "probabilities": {
      "heavy_precipitation_percent": 0,
      "heavy_snowfall_percent": 0,
      "uncomfortable_percent": 0,
      "very_cold_percent": 0,
      "very_hot_percent": 0,
      "very_windy_percent": 0
    }
  },
  "thresholds_info": {
    "climate_zone": "temperate",
    "thresholds_used": {
      "comfortable_max": 25,
      "very_hot": 32,
      "very_cold": -5,
      "heavy_precipitation": 10,
      "very_windy": 14
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