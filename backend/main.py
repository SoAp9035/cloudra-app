import time
from flask_cors import CORS
from flask import Flask, request, jsonify
from nasa_client import NASAPowerAPI, POWER_PARAMETERS
from nasa_data_processor import analyze_weather_probability, check_day_and_suggest


# Flask ayarları
app = Flask(__name__)
app.secret_key = "cloudra"

# CORS configuration to allow frontend access
# Allow both localhost (for development) and Netlify domain (for production)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "https://*.netlify.app",
            "https://cloudra-app.onrender.com"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": False
    }
})

# Health check endpoint for Render
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "cloudra-api"}), 200

# Root endpoint
@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "service": "Cloudra Weather API",
        "version": "1.0",
        "endpoints": {
            "/api/weather_probability": "Get weather probabilities for a specific date",
            "/api/find_optimal_days": "Find optimal days near a target date",
            "/health": "Health check endpoint"
        }
    }), 200

# NASA POWER API'si
power_api = NASAPowerAPI()


@app.route("/api/weather_probability", methods=["GET"])
def weather_probability():
    try:
        data = request.args
        lat = float(data["lat"])
        lon = float(data["lon"])
        month = int(data["month"])
        day = int(data["day"])
        analysis_mode = str(data["analysis_mode"])

        day_range = 0
        parameters = POWER_PARAMETERS

        # Validations
        if abs(lat) > 90 or abs(lon) > 180:
            return jsonify({
                "error": "Invalid coordinates: latitude must be between -90 and 90, longitude must be between -180 and 180."
            })
        
        if (month < 1 or month > 12) or (day < 1 or day > 31):
            return jsonify({
                "error": "Invalid date: month must be between 1 and 12, day must be valid for the given month."
            })

        if day_range < 0 or day_range > 182:
            return jsonify({
                "error": "Invalid day range: must be between 0 and 182."
            })

        if analysis_mode == "detailed_analysis":
            years_back = 30
        else:
            years_back = 10

        start_time = time.time()

        power_data = power_api.get_multi_year_data_for_day(
            lat=lat,
            lon=lon,
            month=month,
            day=day,
            day_range=day_range,
            years_back=years_back,
            parameters=parameters
        )

        if power_data is None:
            return jsonify({"error": "No data available for the specified location and date."})
        
        analysis = analyze_weather_probability(power_data, lat, lon)

        end_time = time.time()
        time_taken = end_time - start_time

        response = {
            "query": {
                "location": {"latitude": lat, "longitude": lon},
                "date": {"month": f"{month:02d}", "day": f"{day:02d}"},
                "analysis_mode": analysis_mode if analysis_mode == "detailed_analysis" else "quick_analysis",
            },
            "analysis_summary": {
                "title": f"Weather Probabilities for {month:02d}/{day:02d}",
                "analysis_mode": analysis_mode if analysis_mode == "detailed_analysis" else "quick_analysis",
                "data_source": "NASA POWER MERRA-2 Dataset",
                "data_points": analysis["data_points"],
                "time_taken": round(time_taken, 1)
            },
            "weather_probabilities": {
                "statistics": analysis["statistics"],
                "probabilities": analysis["probabilities"],
            },
            "visualizations": analysis["visualizations"],
            "thresholds_info": {
                "climate_zone": analysis["climate_zone"],
                "thresholds_used": analysis["thresholds_used"],
            },
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"Something went wrong with weather_probability API endpoint. Error: {e}"})


@app.route("/api/find_optimal_days", methods=["GET"])
def find_optimal_days():
    try:
        data = request.args
        lat = float(data["lat"])
        lon = float(data["lon"])
        month = int(data["month"])
        day = int(data["day"])
        analysis_mode = str(data["analysis_mode"])

        day_range = 7
        parameters = POWER_PARAMETERS

        # Validations
        if abs(lat) > 90 or abs(lon) > 180:
            return jsonify({
                "error": "Invalid coordinates: latitude must be between -90 and 90, longitude must be between -180 and 180."
            })
        
        if (month < 1 or month > 12) or (day < 1 or day > 31):
            return jsonify({
                "error": "Invalid date: month must be between 1 and 12, day must be valid for the given month."
            })

        if day_range < 0 or day_range > 182:
            return jsonify({
                "error": "Invalid day range: must be between 0 and 182."
            })

        if analysis_mode == "detailed_analysis":
            years_back = 30
        else:
            years_back = 10

        power_data = power_api.get_multi_year_data_for_day(
            lat=lat,
            lon=lon,
            month=month,
            day=day,
            day_range=day_range,
            years_back=years_back,
            parameters=parameters
        )

        if power_data is None:
            return jsonify({"error": "No data available for the specified location and date."})
        
        optimal_days = check_day_and_suggest(power_data, lat, lon)

        response = {
            "query": {
                "location": {"latitude": lat, "longitude": lon},
                "date": {"month": f"{month:02d}", "day": f"{day:02d}"},
                "analysis_mode": analysis_mode if analysis_mode == "detailed_analysis" else "quick_analysis",
            },
            "optimal_days": optimal_days
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"Something went wrong with find_optimal_days API endpoint. Error: {e}"})


if __name__ == "__main__":
    # For local development only
    app.run(debug=True, host='0.0.0.0', port=5001)
