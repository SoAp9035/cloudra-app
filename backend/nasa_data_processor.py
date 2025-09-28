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
        },
        "subarctic": {
            "comfortable_max": 20,
            "very_hot": 25,
            "very_cold": -20,
            "heavy_rain": 8,
            "very_windy": 16,
        },
        "temperate": {
            "comfortable_max": 25,
            "very_hot": 32,
            "very_cold": -5,
            "heavy_rain": 10,
            "very_windy": 14,
        },
        "subtropical": {
            "comfortable_max": 30,
            "very_hot": 38,
            "very_cold": 5,
            "heavy_rain": 15,
            "very_windy": 18,
        },
        "tropical": {
            "comfortable_max": 32,
            "very_hot": 40,
            "very_cold": 15,
            "heavy_rain": 20,
            "very_windy": 24,
        },
    }

    return thresholds.get(climate_zone, thresholds["temperate"])


### Veri normalizasyonu
def choose_mean_or_median(df: pd.DataFrame, col: str):
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    
    outliers = df[(df[col] < lower) | (df[col] > upper)]
    outlier_ratio = len(outliers) / len(df)
    
    if outlier_ratio < 0.1:
        return "mean"
    else:
        return "median"

def replace_neg999(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.columns:
        if df[col].dtype in ["float64", "int64"]:
            if choose_mean_or_median(df, col) == "mean":
                val = float(df[df[col] != -999.0][col].mean())
            else:
                val = float(df[df[col] != -999.0][col].median())
            df.loc[df[col] == -999.0, col] = val

    return df

def round_values(df: pd.DataFrame, decimals: int = 2) -> pd.DataFrame:
    """
    Tüm değerleri verilen basamak değerine yuvarlar
    """
    for col in df.columns:
        if df[col].dtype in ["float64", "int64"]:
            df[col] = df[col].round(decimals)

    return df

def data_normalization(df: pd.DataFrame) -> pd.DataFrame:
    """
    Veri normalizasyonu
    """
    try:
        return round_values(replace_neg999(df), 2)
    except:
        return df


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

def avg_temperature_range(df: pd.DataFrame) -> list[float] | None:
    """
    Sıcaklık aralığı
    """
    if "T2M_MAX" not in df.columns or "T2M_MIN" not in df.columns:
        return None
    
    max_value = float(round(df.T2M_MAX.mean(), 1))
    min_value = float(round(df.T2M_MIN.mean(), 1))
    return [min_value, max_value]

def avg_humidity(df: pd.DataFrame) -> float | None:
    """
    Ortalama nem
    """
    if "RH2M" in df.columns:
        return float(round(df.RH2M.mean(), 1))
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

def avg_cloud(df: pd.DataFrame) -> float | None:
    """
    Ortalama bulutluluk
    """
    if "CLOUD_AMT" in df.columns:
        return float(round(df.CLOUD_AMT.mean(), 1))
    else:
        return None

def rain_prob(df: pd.DataFrame) -> float | None:
    """
    Yağmur yağma olasılığı
    """
    if "PRECTOTCORR" not in df.columns:
        return None
    
    percent = (df.PRECTOTCORR > 0.1).mean() * 100
    return float(round(percent, 1))

def snow_cover_prob(df: pd.DataFrame) -> float | None:
    """
    Kar örtüsü olma olasılığı
    """
    if "SNODP" not in df.columns:
        return None
    
    percent = (df.SNODP > 0).mean() * 100
    return float(round(percent, 1))


### Olasılık hesaplamaları

def very_hot_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok sıcak olma olasılığı
    """
    if "T2M_MAX" not in df.columns:
        return 0
    
    percent = (df["T2M_MAX"] >= thresholds["very_hot"]).mean() * 100
    return int(round(percent))


# Analiz sonuçlarının hesaplanıp gönderileceği fonksiyon
def analyze_weather_probability(data: StringIO, lat: float, lon: float) -> dict:
    """
    Tarihsel verileri analiz ederek hava durumu olasılıklarını hesaplar.
    """
    # Bulunan konumun iklim bölgesini ve eşik değerlerini al
    climate_zone = get_climate_zone(lat, lon)
    thresholds = get_thresholds_by_climate_zone(climate_zone)
    
    # Veriyi data frame olarak al
    df = pd.read_json(data)

    # Veri normalizasyonu
    df = data_normalization(df)

    ### HESAPLAMALAR ###
    # TODO: Boş olan değerler fonksiyonlar ile doldurulacak

    # Temel istatistikler
    temp_range = avg_temperature_range(df)

    stats = {
        "temperature": {
            "unit": "Celcius",
            "average": avg_temperature(df),
            "average_range": {"min": temp_range[0], "max": temp_range[1]}
        },
        "humidity": {
            "unit": "%",
            "average": avg_humidity(df)
        },
        "wind": {
            "unit": "m/s",
            "average_speed": avg_wind_speed(df)
        },
        "cloud": {
            "unit": "%",
            "average": avg_cloud(df)
        },
        "rain": {
            "unit": "%",
            "probability": rain_prob(df)
        },
        "snow_cover": {
            "unit": "%",
            "probability": snow_cover_prob(df)
        },
    }

    # Olasılık hesaplamaları
    probabilities = {}

    probabilities["uncomfortable_percent"] = ""
    probabilities["very_hot_percent"] = very_hot_percent(df, thresholds)
    probabilities["very_cold_percent"] = ""
    probabilities["heavy_rain_percent"] = ""
    probabilities["very_windy_percent"] = ""

    ### GÖRSELLEŞTİRME İÇİN VERİLERİN HAZIRLANMASI ###
    # TODO: TARİH - VERİ ikilileri oluşturulacak

    ### VERİLERİN GÖNDERİLMESİ ###

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
        day=28,
        day_range=0,
        years_back=10,
        parameters=POWER_PARAMETERS
    )

    analyse = analyze_weather_probability(power_data, lat, lon)

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Anaylze took: {execution_time:.2f} seconds.")

    print(analyse)
