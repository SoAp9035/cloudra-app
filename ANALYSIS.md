# Data Analysis

Parameter information:

```python
POWER_PARAMETERS = {
    # Temperature
    "T2M": "2 m Average Temperature (°C)",
    "T2M_MAX": "2 m Maximum Temperature (°C)",
    "T2M_MIN": "2 m Minimum Temperature (°C)",
    "T2MDEW": "2 m Dew Point (°C)", # For discomfort due to humidity

    # Humidity
    "RH2M": "2 m Relative Humidity (%)",

    # Precipitation
    "PRECTOTCORR": "Corrected Total Precipitation (mm/day)",
    "PRECSNOLAND": "Snowfall (mm/day)",
    "SNODP": "Snow Depth (cm)",

    # Wind
    "WS10M": "10 m Wind Speed (m/s)",
    "WS10M_MAX": "10 m Maximum Wind Speed (m/s)",

    # Cloudiness
    "CLOUD_AMT": "Total Cloud Cover (%)",
}
```

---

## Average Values

This section helps the user understand what to expect as "normal" for that day.

- **Average Temperature (°C)**
    - **Formula**: (Sum of All Temperature Values) / (Total Number of Data Points)

- **Temperature Range (°C)**
    - Maximum and minimum values.

- **Average Humidity (%)**
    - **Formula**: (Sum of All Humidity Values) / (Total Number of Data Points)

- **Average Wind Speed (km/s)**
    - **Formula**: (Sum of All Wind Speed Values) / (Total Number of Data Points)

- **Average Cloudiness (%)**
    - **Formula**: (Sum of All Cloudiness Values) / (Total Number of Data Points)

- **Fog Condition (0-3 scale)**
    - **Formula**: (T2M - T2MDEW) / (Total Number of Data Points)
    - > Note: A foggy day is defined as days where the difference between T2M and T2MDEW is less than 2°C.

- **Rain Probability (%)**
    - **Formula**: (Number of Rainy Days) / (Total Number of Days) × 100
    - > Note: A rainy day is defined as PRECTOTCORR > 0.1 mm/day.

- **Snow Cover Probability (%)**
    - **Formula**: (Number of Days with Snow Cover) / (Total Number of Days) × 100
    - > Note: A day with snow cover is defined as SNODP > 0 cm.

---

## Probability Results

Shows the user's likelihood of encountering specific weather conditions as a percentage. Will be calculated using threshold values specific to the given climate.

- **Very Uncomfortable (very_uncomfortable)**
    - **Parameters to use**: T2MDEW (°C)
    - **Formula**: Number of days where T2MDEW > 24 / Total number of days × 100
    - > Note: This represents discomfort in hot and humid conditions. Different parameters and threshold values can be used.

- **Very Hot (very_hot)**
    - **Parameter to use**: T2M_MAX (°C)
    - **Formula**: Number of days where T2M_MAX > 40 / Total number of days × 100

- **Very Cold (very_cold)**
    - **Parameter to use**: T2M_MIN (°C)
    - **Formula**: Number of days where T2M_MIN < -10 / Total number of days × 100

- **Heavy Rain (heavy_rain)**
    - **Parameters to use**: PRECTOTCORR (mm/day)
    - **Formula**: Number of days where PRECTOTCORR > 20 / Total number of days × 100

- **Heavy Snowfall (heavy_snowfall)**
    - **Parameters to use**: PRECSNOLAND (mm/day)
    - **Formula**: Number of days where PRECSNOLAND > 10 / Total number of days × 100

- **Very Windy (very_windy)**
    - **Parameters to use**: WS10M_MAX (m/s)
    - **Formula**: (Number of days where WS10M_MAX > 15) / (Total number of days) × 100

> Note: Threshold values will be adjusted according to climate and region. For example, in tropical regions, the "very hot" threshold will be set at 35°C.

