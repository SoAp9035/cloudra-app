# NASA verilerini işlemek için kullanılacak ortam

import pandas as pd
from io import StringIO


# Aşağıdaki iki fonksiyon her iklim bölgeleri için ayrı eşik değeri döndürmek için yazıldı
def get_climate_zone(lat: float, lon: float):
    """
    Konumun iklim bölgesini döndürür.
    """
    # Kutup bölgeleri
    if abs(lat) > 66.5:
        return "polar"

    # Subarktik
    elif abs(lat) > 55:
        return "subarctic"

    # Ilıman bölgeler
    elif abs(lat) > 35:
        return "temperate"

    # Subtropikal
    elif abs(lat) > 23.5:
        return "subtropical"

    # Tropikal
    else:
        return "tropical"


def get_thresholds_by_climate_zone(climate_zone: str) -> dict[str, int]:
    """
    İklim bölgesine göre eşik değerleri döndürür.
    """
    thresholds = {
        "polar": {
            "comfortable_max": 10,
            "very_hot": 15,
            "very_cold": -25,
            "heavy_rain": 5,
            "very_windy": 20,
            "very_cloudy": 75,
        },
        "subarctic": {
            "comfortable_max": 20,
            "very_hot": 25,
            "very_cold": -20,
            "heavy_rain": 8,
            "very_windy": 16,
            "very_cloudy": 75,
        },
        "temperate": {
            "comfortable_max": 25,
            "very_hot": 32,
            "very_cold": -5,
            "heavy_rain": 10,
            "very_windy": 14,
            "very_cloudy": 80,
        },
        "subtropical": {
            "comfortable_max": 30,
            "very_hot": 38,
            "very_cold": 5,
            "heavy_rain": 15,
            "very_windy": 18,
            "very_cloudy": 80,
        },
        "tropical": {
            "comfortable_max": 32,
            "very_hot": 40,
            "very_cold": 15,
            "heavy_rain": 20,
            "very_windy": 24,
            "very_cloudy": 85,
        },
    }

    return thresholds.get(climate_zone, thresholds["temperate"])
 

### Kullanıcıya gösterilecek ortalama veriler
# TODO: Ortalama değerlerin hepsi test edilip doğru formüller ile değiştirilecek

def avg_temperature(df: pd.DataFrame) -> float | None:
    """
    Ortalama sıcaklık
    """
    if "T2M" in df.columns:
        return float(round(df.T2M.mean(), 1))
    else:
        return None

def avg_temperature_range(df: pd.DataFrame) -> float | None:
    """
    Sıcaklık aralığı
    """
    max_value = float(round(df.T2M_MAX.mean(), 1))
    min_value = float(round(df.T2M_MIN.mean(), 1))

    if "T2M_MAX" in df.columns and "T2M_MIN" in df.columns:
        return [max_value, min_value]
    else:
        return None

def avg_precipitation(df: pd.DataFrame) -> float | None:
    """
    Ortalama yağış
    """
    if "PRECTOTCORR" in df.columns:
        return float(round(df.PRECTOTCORR.mean(), 1))
    else:
        return None

def avg_wind_speed(df: pd.DataFrame) -> float | None:
    """
    Ortalama rüzgar hızı
    """
    if "WS10M" in df.columns:
        return float(round(df.WS10M.mean(), 1))
    else:
        return None

def avg_humidity(df: pd.DataFrame) -> float | None:
    """
    Ortalama nem
    """
    if "RH2M" in df.columns:
        return float(round(df.RH2M.mean(), 1))
    else:
        return None


# Analiz sonuçlarının hesaplanıp gönderileceği fonksiyon
def analyze_weather_probability(data: StringIO, lat: float, lon: float) -> dict:
    """
    Tarihsel verileri analiz ederek hava durumu olasılıklarını hesaplar.
    """
    # Veriyi data frame olarak al
    df = pd.read_json(data)

    # Bulunan konumun iklim bölgesini ve eşik değerlerini al
    climate_zone = get_climate_zone(lat, lon)
    thresholds = get_thresholds_by_climate_zone(climate_zone)

    ### HESAPLAMALAR ###
    # TODO: Boş olan değerler fonksiyonlar ile doldurulacak

    # Temel istatistikler
    stats = {
        "temperature": {
            "unit": "Celcius",
            "average": avg_temperature(df),
            "average_range": avg_temperature_range(df)
        },
        "precipitation": {
            "unit": "mm/day",
            "average": avg_precipitation(df)
        },
        "wind": {
            "unit": "m/s",
            "average_speed": avg_wind_speed(df)
        },
        "humidity": {
            "unit": "%",
            "average": avg_humidity(df)
        }
    }

    # Olasılık hesaplamaları
    probabilities = {}

    probabilities["very_hot_percent"] = ""
    probabilities["very_cold_percent"] = ""
    probabilities["heavy_rain_percent"] = ""
    probabilities["very_windy_percent"] = ""
    probabilities["very_cloudy_percent"] = ""
    probabilities["uncomfortable_percent"] = ""

    ### HESAPLANAN VERİLERİN GÖNDERİLMESİ ###

    analysis = {
        "climate_zone": climate_zone,
        "thresholds_used": thresholds,
        "statistics": stats,
        "probabilities": probabilities,
        "data_points": len(df)
    }

    return analysis


if __name__ == "__main__":
    import time
    from nasa_client import NASAPowerAPI, POWER_PARAMETERS

    power_api = NASAPowerAPI()
    
    # Konum, ay/gün
    lat = 37.874641
    lon = 32.493156
    month=9
    day=25

    start_time = time.time()

    power_data = power_api.get_multi_year_data_for_day(
        lat=lat,
        lon=lon,
        month=9,
        day=23,
        day_range=0,
        years_back=30,
        parameters=POWER_PARAMETERS
    )

    analyse = analyze_weather_probability(power_data, lat, lon)

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Anaylze took: {execution_time:.2f} seconds.")

    print(analyse)
