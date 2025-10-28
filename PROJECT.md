### Project Overview and Purpose

This project aims to develop a web application that provides users with **probability-based insights** into potential weather conditions for a specific future date (e.g., 6 months ahead) and location. This is **not a weather forecast**—instead, it's a statistical analysis of weather conditions based on decades of historical data from NASA for that particular day and location.

**Example Scenario:** A user is planning an outdoor party in Istanbul during the first week of June. They enter the location and date into the application. The app analyzes NASA data and reports that there's a 40% chance of rain in Istanbul on that date, an average temperature of 26°C, and a 10% probability of an extreme heat wave. This information helps the user take precautions (such as arranging an umbrella or backup indoor venue).

---

### 1. What Does This Project Deliver?

The competition expects a fully functional web application (or mobile app) that includes:

1.  **Personalized Dashboard:** An intuitive interface for easy user interaction.
2.  **User Inputs:**
    *   **Location Selection:** Users can specify a location by marking a point on a map, typing a place name, or drawing an area on the map.
    *   **Date Selection:** Users can select a specific day of the year (e.g., July 15th).
3.  **Information Display:** Present the following data for the selected location and date:
    *   **Probabilities:** Percentage likelihood of conditions such as "very hot", "very cold", "very windy", "very rainy", or "very uncomfortable".
    *   **Average Values:** Statistical data like average temperature and wind speed for that day.
    *   **Extreme Weather Events:** Probability of exceeding certain thresholds (e.g., 10% chance of temperature exceeding 32°C).
4.  **Visualization:** Results should be supported not only with text but also with visual elements such as **charts, maps, or time series** that users can easily understand.
5.  **Data Download Option:** Users should be able to download raw data or analysis results from their queries in **CSV** or **JSON** format.

---

### 2. Project Requirements and Guidelines

Key rules and expectations for developing this project:

*   **NASA Data Usage Required:** The core of the project is utilizing NASA's Earth observation data. The provided resources (GES DISC, Giovanni, Earthdata Search, etc.) must be used to retrieve this data.
*   **Historical Data Focus:** The application must clearly state that it's not a "forecast" tool. Outputs are **statistical probabilities** based on historical data.
*   **User-Friendly Interface:** The interface should be straightforward, allowing users to easily select locations and dates and understand the results.
*   **Variable Selection:** Choose weather variables (temperature, precipitation, wind, etc.) carefully. Too many technical variables can be confusing. Focus on the most relevant ones for outdoor activities.
*   **Metadata Provision (Recommended):** Downloaded files should include metadata such as data units (e.g., Celsius, km/s) and the NASA source from which the data was obtained.

