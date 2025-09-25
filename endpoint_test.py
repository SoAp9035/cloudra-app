import time
import requests


params = {
    "lat": 38.401088,
    "lon": 27.128347,
    "month": 9,
    "day": 25,
    "analysis_mode": "detailed_analysis",# "quick_analysis",
}

start_time = time.time()

response = requests.get("http://127.0.0.1:5000/api/weather_probability", params=params)
print(response.json())

end_time = time.time()
execution_time = end_time - start_time
print(f"Request took: {execution_time:.2f} seconds.")
