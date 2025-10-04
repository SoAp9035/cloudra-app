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
  - `time_taken` (float): Time taken to process the request in seconds
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
      - `unit` (string): Wind speed unit (km/h)
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
      - `scale` (int): Fog scale value (0-3)
      - `status` (string): Fog status value (No fog, Light fog, Moderate fog, Heavy fog)
  - `probabilities` (object): Calculated weather probabilities
    - `heavy_precipitation_percent` (int): Heavy precipitation probability
    - `heavy_snowfall_percent` (int): Heavy snowfall probability
    - `uncomfortable_percent` (int): Uncomfortable weather probability
    - `very_cold_percent` (int): Very cold weather probability
    - `very_hot_percent` (int): Very hot weather probability
    - `very_windy_percent` (int): Very windy weather probability
- `visualizations` (object): Data for visualizations
  - `temperature` (object): Temperature visualization data
    - `years` (array): List of years
    - `temperatures` (array): Corresponding list of temperatures for each year
- `thresholds_info` (object): Information about analysis thresholds
  - `climate_zone` (string): Climate zone classification (polar, subarctic, temperate, subtropical, tropical)
  - `thresholds_used` (object): Threshold values used in analysis
    - `comfort_temp_max` (object): Maximum comfortable temperature
      - `value` (int): Temperature value
      - `unit` (string): Temperature unit (°C)
    - `very_hot` (object): Very hot temperature threshold
      - `value` (int): Temperature value
      - `unit` (string): Temperature unit (°C)
    - `very_cold` (object): Very cold temperature threshold
      - `value` (int): Temperature value
      - `unit` (string): Temperature unit (°C)
    - `heavy_precipitation` (object): Heavy precipitation threshold
      - `value` (int): Precipitation value
      - `unit` (string): Precipitation unit (mm/day)
    - `very_windy` (object): Very windy threshold
      - `value` (int): Wind speed value
      - `unit` (string): Wind speed unit (m/s)
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
    "data_points": 30,
    "time_taken": 67.5
  },
  "weather_probabilities": {
    "statistics": {
      "temperature": {
        "unit": "°C",
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
        "unit": "km/h",
        "average_speed": 18.8
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
        "unit": "0-3 scale",
        "scale": 0,
        "status": "No fog"
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
  "visualizations": {
    "temperature": {
      "years": [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      "temperatures": [15.1, 16.3, 14.8, 15.6, 16.0, 17.2, 15.9, 16.5, 15.4, 16.1, 17.0, 16.8, 15.7, 16.4, 17.1, 16.2, 15.9, 16.6, 17.3, 16.5, 15.8, 16.7, 17.4, 16.9, 15.6, 16.8, 17.5, 16.3, 15.7, 16.4]
    }
  },
  "thresholds_info": {
    "climate_zone": "temperate",
    "thresholds_used": {
      "comfort_temp_max": {
        "value": 25,
        "unit": "°C"
      },
      "very_hot": {
        "value": 32,
        "unit": "°C"
      },
      "very_cold": {
        "value": -5,
        "unit": "°C"
      },
      "heavy_precipitation": {
        "value": 10,
        "unit": "mm/day"
      },
      "very_windy": {
        "value": 10,
        "unit": "m/s"
      }
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


**Endpoint:** `/api/find_optimal_days`
**Methods:** GET

### Description
This endpoint helps users find the best days for outdoor activities based on weather probabilities and user-defined preferences.

### Parameters

- `lat` (float, required): Latitude coordinate of the location
- `lon` (float, required): Longitude coordinate of the location
- `month` (int, required): Month number (1-12)
- `day` (int, required): Day of the month
- `analysis_mode` (string, required): Analysis mode, either `detailed_analysis` or `quick_analysis`

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
- `optimal_days` (array): List of optimal days for outdoor activities in YYYY-MM-DD format

### Example Request
```
GET /api/find_optimal_days?lat=40.7589&lon=-73.9851&month=6&day=15&analysis_mode=detailed_analysis
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
  "optimal_days": [
    "2025-09-15",
    "2025-09-20",
    "2025-09-10"
  ]
}
```