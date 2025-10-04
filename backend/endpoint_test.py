import time
import requests


params = {
    "lat": 37.874641,
    "lon": 32.493156,
    "month": 10,
    "day": 5,
    "analysis_mode": "quick_analysis",  # "detailed_analysis" also available
}

start_time = time.time()

response = requests.get("http://127.0.0.1:5000/api/weather_probability", params=params)
print(response.json())

end_time = time.time()
execution_time = end_time - start_time
print(f"Request took: {execution_time:.2f} seconds.")

"""
{
    "analysis_summary": {
        "analysis_mode": "detailed_analysis",
        "data_points": 30,
        "data_source": "NASA POWER MERRA-2 Dataset",
        "time_taken": 77.3,
        "title": "Weather Probabilities for 10/05",
    },
    "query": {
        "analysis_mode": "detailed_analysis",
        "date": {"day": "05", "month": "10"},
        "location": {"latitude": 37.874641, "longitude": 32.493156},
    },
    "thresholds_info": {
        "climate_zone": "temperate",
        "thresholds_used": {
            "comfort_temp_max": {"unit": "°C", "value": 25},
            "heavy_precipitation": {"unit": "mm/day", "value": 10},
            "very_cold": {"unit": "°C", "value": -5},
            "very_hot": {"unit": "°C", "value": 32},
            "very_windy": {"unit": "m/s", "value": 10},
        },
    },
    "visualizations": {
        "temperature": {
            "temperature": {
                "temperatures": [
                    8.07,
                    14.82,
                    10.91,
                    16.91,
                    21.41,
                    18.36,
                    16.62,
                    13.33,
                    18.8,
                    12.9,
                    12.22,
                    16.94,
                    16.33,
                    14.7,
                    16.66,
                    10.12,
                    13.33,
                    15.42,
                    3.82,
                    14.97,
                    18.5,
                    17.52,
                    10.05,
                    13.66,
                    16.26,
                    18.56,
                    10.05,
                    14.87,
                    14.27,
                    18.7,
                ],
                "years": [
                    1995,
                    1996,
                    1997,
                    1998,
                    1999,
                    2000,
                    2001,
                    2002,
                    2003,
                    2004,
                    2005,
                    2006,
                    2007,
                    2008,
                    2009,
                    2010,
                    2011,
                    2012,
                    2013,
                    2014,
                    2015,
                    2016,
                    2017,
                    2018,
                    2019,
                    2020,
                    2021,
                    2022,
                    2023,
                    2024,
                ],
            }
        }
    },
    "weather_probabilities": {
        "probabilities": {
            "heavy_precipitation_percent": 0,
            "heavy_snowfall_percent": 0,
            "uncomfortable_percent": 0,
            "very_cold_percent": 0,
            "very_hot_percent": 0,
            "very_windy_percent": 3,
        },
        "statistics": {
            "cloud": {"average": 28.1, "unit": "%"},
            "fog": {"scale": 0, "status": "No fog", "unit": "0-3 scale"},
            "humidity": {"average": 50.8, "unit": "%"},
            "rain": {"probability": 16.7, "unit": "%"},
            "snow_cover": {"probability": 3.3, "unit": "%"},
            "temperature": {
                "average": 14.6,
                "average_range": {"max": 22.0, "min": 8.7},
                "unit": "°C",
            },
            "wind": {"average_speed": 11.2, "unit": "km/h"},
        },
    },
}
"""