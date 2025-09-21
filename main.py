from flask_cors import CORS
from flask import Flask, request, jsonify
from nasa_client import NASAPowerAPI, POWER_PARAMETERS
# from nasa_data_processor import *


# Flask ayarları
app = Flask(__name__)
CORS(app) # Flask ile React kullanabilmek için gerekli

# NASA POWER API'si
power_api = NASAPowerAPI()


@app.route("/")
def home():
    return "<h1>Welcome to Selcuk Space App!</h1>"


@app.route("/api/docs")
def docs():
    return "<h1>Welcome to Selcuk Space App DOCS!</h1><hr><h2>Endpoints</h2><h3>/api/weather_probability</h3>"


@app.route("/api/weather_probability", methods=["GET", "POST"])
def weather_probability():
    try:
        data = request.args
        lon = float(data["lon"])
        lat = float(data["lat"])
        month = int(data["month"])
        day = int(data["day"])
        day_range = int(data["day_range"])
        years_back = int(data["years_back"])
        parameters = list(data["parameters"])
        format = str(data["format"])

        power_data = power_api.get_multi_year_data_for_day(
            lon=lon,
            lat=lat,
            month=month,
            day=day,
            day_range=day_range,
            years_back=years_back,
            parameters=parameters,
            format=format
        )

        # TODO: Veri işleyecek ve anlamlı sonuçlar çıkarılacak fonksiyon 
        # data = get_weather_probability(power_data)

        # return jsonify(data)

        # Test için geçici
        return jsonify({"is_ok": True})
    except Exception as e:
        return jsonify({"error": f"Something went wrong with weather_probability API. Error: {e}"})


if __name__ == "__main__":
    app.run(debug=True)
