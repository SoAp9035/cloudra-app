from flask_cors import CORS
from flask import Flask, request, jsonify
from nasa_client import NASAPowerAPI, POWER_PARAMETERS
from nasa_data_processor import calculate_temperature


# Flask ayarları
app = Flask(__name__)
CORS(app) # Flask ile React kullanabilmek için gerekli

# NASA POWER API'si
power_api = NASAPowerAPI()

# NASAPowerAPI için parametreler
DAY_RANGE = 3
YEARS_BACK = 2


@app.route("/")
def home():
    return "<h1>Welcome to Selcuk Space App!</h1>"


@app.route("/api/weather_probability", methods=["GET"])
def weather_probability():
    try:
        data = request.args
        lat = float(data["lat"])
        lon = float(data["lon"])
        month = int(data["month"])
        day = int(data["day"])

        # day_range = int(data["day_range"])
        # years_back = int(data["years_back"])
        # parameters = str(data["parameters"]).split(",")
        # format = str(data["format"])

        # Bazı parametreleri API isteğinden alıp almamakla kararsızım
        # Geçici
        day_range = DAY_RANGE
        years_back = YEARS_BACK
        parameters = POWER_PARAMETERS

        power_data = power_api.get_multi_year_data_for_day(
            lat=lat,
            lon=lon,
            month=month,
            day=day,
            day_range=day_range,
            years_back=years_back,
            parameters=parameters
        )

        if not power_api:
            return jsonify({"is_ok": False, "error": "No data available for the specified location and date."})

        ### İşlenmiş verileri bu fonksiyon içinde birleştirip JSON oluşturulabilir
        
        # TODO: ? Veri işleyecek ve anlamlı sonuçlar çıkarılacak fonksiyon
        # data = get_weather_probability(power_data)

        # Test için geçici
        temperature = calculate_temperature(power_data)
        
        return jsonify({"is_ok": True, "temperature": f"{temperature} °C"})
    except Exception as e:
        return jsonify({"is_ok": False, "error": f"Something went wrong with weather_probability API endpoint. Error: {e}"})


if __name__ == "__main__":
    app.run(debug=True)
