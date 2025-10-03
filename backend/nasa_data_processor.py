# NASA verilerini işlemek için kullanılacak ortam

import pandas as pd
from io import StringIO
from datetime import datetime


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


def get_thresholds_by_climate_zone(climate_zone: str) -> dict[str, dict[str, any]]:
    """
    İklim bölgesine göre eşik değerleri döndürür.
    """
    thresholds = {
        "polar": {
            "comfort_temp_max": {"value": 10, "unit": "°C"},
            "very_hot": {"value": 18, "unit": "°C"},
            "very_cold": {"value": -25, "unit": "°C"},
            "heavy_precipitation": {"value": 10, "unit": "mm/day"},
            "very_windy": {"value": 14, "unit": "m/s"},
        },
        "subarctic": {
            "comfort_temp_max": {"value": 20, "unit": "°C"},
            "very_hot": {"value": 25, "unit": "°C"},
            "very_cold": {"value": -20, "unit": "°C"},
            "heavy_precipitation": {"value": 8, "unit": "mm/day"},
            "very_windy": {"value": 12, "unit": "m/s"},
        },
        "temperate": {
            "comfort_temp_max": {"value": 25, "unit": "°C"},
            "very_hot": {"value": 32, "unit": "°C"},
            "very_cold": {"value": -5, "unit": "°C"},
            "heavy_precipitation": {"value": 10, "unit": "mm/day"},
            "very_windy": {"value": 10, "unit": "m/s"},
        },
        "subtropical": {
            "comfort_temp_max": {"value": 30, "unit": "°C"},
            "very_hot": {"value": 38, "unit": "°C"},
            "very_cold": {"value": 5, "unit": "°C"},
            "heavy_precipitation": {"value": 15, "unit": "mm/day"},
            "very_windy": {"value": 12, "unit": "m/s"},
        },
        "tropical": {
            "comfort_temp_max": {"value": 32, "unit": "°C"},
            "very_hot": {"value": 40, "unit": "°C"},
            "very_cold": {"value": 15, "unit": "°C"},
            "heavy_precipitation": {"value": 30, "unit": "mm/day"},
            "very_windy": {"value": 14, "unit": "m/s"},
        },
    }

    return thresholds.get(climate_zone, thresholds["temperate"])


### Veri normalizasyonu
def choose_mean_or_median(valid_data: pd.Series) -> str:
    if len(valid_data) == 0:
        return "mean"

    Q1 = valid_data.quantile(0.25)
    Q3 = valid_data.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    
    outliers = valid_data[(valid_data < lower) | (valid_data > upper)]
    outlier_ratio = len(outliers) / len(valid_data)
    
    return "mean" if outlier_ratio < 0.1 else "median"

def replace_neg999(df: pd.DataFrame) -> pd.DataFrame:
    cols_to_drop = []

    for col in df.columns:
        if df[col].dtype in ["float64", "int64"]:
            valid_data = df.loc[df[col] != -999.0, col]

            if valid_data.empty:
                cols_to_drop.append(col)
                continue
            else:
                if choose_mean_or_median(valid_data) == "mean":
                    val = float(valid_data.mean())
                else:
                    val = float(valid_data.median())
            df.loc[df[col] == -999.0, col] = val

    df = df.drop(columns=cols_to_drop)
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

def avg_temperature_range(df: pd.DataFrame) -> dict[str, float] | None:
    """
    Sıcaklık aralığı
    """
    if "T2M_MAX" not in df.columns or "T2M_MIN" not in df.columns:
        return None
    
    max_value = float(round(df.T2M_MAX.mean(), 1))
    min_value = float(round(df.T2M_MIN.mean(), 1))
    if max_value < min_value:
        min_value, max_value = max_value, min_value
    return {"min": min_value, "max": max_value}

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
        return float(round(df.WS10M.mean() * 3.6, 1))
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
    
def avg_fog_status(df: pd.DataFrame) -> dict[str, int | str] | None:
    """
    Ortalama sis durumu
    """
    if "T2M" not in df.columns or "T2MDEW" not in df.columns or "RH2M" not in df.columns:
        return None

    temp_diff = (df.T2M - df.T2MDEW).mean()
    humidity = df.RH2M.mean()

    if temp_diff <= 1 and humidity >= 80:
        return {"scale": 3, "status": "Heavy fog"}
    elif temp_diff <= 2 and humidity >= 70:
        return {"scale": 2, "status": "Moderate fog"}
    elif temp_diff <= 3 and humidity >= 60:
        return {"scale": 1, "status": "Light fog"}
    else:
        return {"scale": 0, "status": "No fog"}


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

def very_uncomfortable_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok rahatsız edici gün olma olasılığı
    """
    if "T2MDEW" not in df.columns:
        return None
    
    percent = (df["T2MDEW"] >= thresholds["comfort_temp_max"]["value"]).mean() * 100
    return int(round(percent))

def very_hot_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok sıcak gün olma olasılığı
    """
    if "T2M_MAX" not in df.columns:
        return None
    
    percent = (df["T2M_MAX"] >= thresholds["very_hot"]["value"]).mean() * 100
    return int(round(percent))

def very_cold_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok soğuk gün olma olasılığı
    """
    if "T2M_MIN" not in df.columns:
        return None
    
    percent = (df["T2M_MIN"] <= thresholds["very_cold"]["value"]).mean() * 100
    return int(round(percent))

def heavy_precipitation_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok yağışlı gün olma olasılığı
    """
    if "PRECTOTCORR" not in df.columns:
        return None
    
    percent = (df["PRECTOTCORR"] >= thresholds["heavy_precipitation"]["value"]).mean() * 100
    return int(round(percent))

def heavy_snowfall_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok kar yağışlı gün olma olasılığı
    """
    if "PRECSNOLAND" not in df.columns:
        return None
    
    percent = (df["PRECSNOLAND"] >= thresholds["heavy_precipitation"]["value"]).mean() * 100
    return int(round(percent))

def very_windy_percent(df: pd.DataFrame, thresholds: dict[str, int]) -> int:
    """
    Çok kar yağışlı gün olma olasılığı
    """
    if "WS10M_MAX" not in df.columns:
        return None
    
    percent = (df["WS10M_MAX"] >= thresholds["very_windy"]["value"]).mean() * 100
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

    # Temel istatistikler
    stats = {
        "temperature": {
            "unit": "°C",
            "average": avg_temperature(df),
            "average_range": avg_temperature_range(df) or {"min": 0, "max": 0}
        },
        "humidity": {
            "unit": "%",
            "average": avg_humidity(df)
        },
        "wind": {
            "unit": "km/h",
            "average_speed": avg_wind_speed(df)
        },
        "cloud": {
            "unit": "%",
            "average": avg_cloud(df)
        },
        "fog": {
            "unit": "0-3 scale",
            **(avg_fog_status(df) or {"scale": 0, "status": "No fog"})
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

    probabilities["uncomfortable_percent"] = very_uncomfortable_percent(df, thresholds)
    probabilities["very_hot_percent"] = very_hot_percent(df, thresholds)
    probabilities["very_cold_percent"] = very_cold_percent(df, thresholds)
    probabilities["heavy_precipitation_percent"] = heavy_precipitation_percent(df, thresholds)
    probabilities["heavy_snowfall_percent"] = heavy_snowfall_percent(df, thresholds)
    probabilities["very_windy_percent"] = very_windy_percent(df, thresholds)

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


### Öneri Sistemi

def calculate_daily_avg(df: pd.DataFrame) -> pd.DataFrame | None:
    """
    Calculates the daily average for each column
    """
    try:
        df["DATE"] = pd.to_datetime(df["DATE"])
        df["Month"] = df["DATE"].dt.month
        df["Day"] = df["DATE"].dt.day

        # Create aggregation dictionary dynamically
        agg_dict = {}
        for col in ["T2M", "T2M_MAX", "T2M_MIN", "T2MDEW", "RH2M", "PRECTOTCORR", 
               "PRECSNOLAND", "SNODP", "WS10M", "WS10M_MAX", "CLOUD_AMT"]:
            method = choose_mean_or_median(df[col])
            agg_dict[col] = method
        
        df_grouped = df.groupby(["Month", "Day"]).agg(agg_dict).reset_index()

        df_grouped["DATE"] = pd.to_datetime(df_grouped[["Month", "Day"]].assign(Year=datetime.now().year))

        df_grouped = df_grouped[["DATE", "T2M", "T2M_MAX", "T2M_MIN", "T2MDEW", "RH2M", 
                                 "PRECTOTCORR", "PRECSNOLAND", "SNODP", "WS10M", "WS10M_MAX", "CLOUD_AMT"]]

        return df_grouped
    except Exception as e:
        print(e)
        return None

def find_suitable_days(df: pd.DataFrame, thresholds: dict[str, int]) -> list | None:
    """
    Hava durumu normal düzeyde olan günleri seçer
    """
    df = calculate_daily_avg(df)
    if df is None or df.empty:
        return None
    
    comfort_ok = df["T2MDEW"] <= thresholds["comfort_temp_max"]["value"]
    temp_hot_ok = df["T2M_MAX"] <= thresholds["very_hot"]["value"]
    temp_cold_ok = df["T2M_MIN"] >= thresholds["very_cold"]["value"]
    precipitation_ok = df["PRECTOTCORR"] <= thresholds["heavy_precipitation"]["value"]
    wind_ok = df["WS10M_MAX"] <= thresholds["very_windy"]["value"]
    cloud_ok = df["CLOUD_AMT"] <= 80

    suitable = df[comfort_ok & temp_hot_ok & temp_cold_ok & precipitation_ok & wind_ok & cloud_ok]
    if suitable.empty:
        return None

    return suitable["DATE"].dt.strftime("%Y-%m-%d").tolist()

def check_day_and_suggest(
    data: StringIO,
    lat: float,
    lon: float
) -> list:
    """
    Hava durumu normal düzeyde olan günleri seçer
    """
    thresholds = get_thresholds_by_climate_zone(get_climate_zone(lat, lon))

    df = pd.read_json(data)

    df = data_normalization(df)
    df['DATE'] = df.index

    suitable_days = find_suitable_days(df, thresholds)

    if suitable_days is None:
        return []
    
    return suitable_days
