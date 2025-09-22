# NASA verilerini işlemek için kullanılacak ortam

import pandas as pd
from io import StringIO


# Kullanılabilir parametreler
POWER_PARAMETERS = {
    # Sıcaklık
    "T2M": "2 m Ortalama Sıcaklık (°C)",
    "T2M_MAX": "2 m Maksimum Sıcaklık (°C)",
    "T2M_MIN": "2 m Minimum Sıcaklık (°C)",
    "T2M_RANGE": "2 m Günlük Sıcaklık Aralığı (°C)",
    "T2MDEW": "2 m Çiğ Noktası (°C)",

    # Nem / Basınç
    "RH2M": "2 m Bağıl Nem (%)",
    "QV2M": "2 m Spesifik Nem (g/kg)",
    "PS": "Yüzey Basıncı (kPa)",

    # Yağış
    "PRECTOTCORR": "Düzeltilmiş Toplam Yağış (mm/gün)",
    "PRECSNOLAND": "Kar Yağışı (mm/gün)",

    # Rüzgar
    "WS10M_MAX": "10 m Maksimum Rüzgar Hızı (m/s)",
    "WS10M": "10 m Rüzgar Hızı (m/s)",
    "WS2M": "2 m Rüzgar Hızı (m/s)",

    # Bulutluluk
    "CLOUD_AMT": "Toplam Bulut Örtüsü (%)",

    # Radyasyon / UV (rahatsızlık ve ısı stresi endeksleri için)
    "ALLSKY_SFC_SW_DWN": "Tüm-Gökyüzü Yüzeye İnen Kısa Dalga Radyasyon (kWh/m²/gün)",
    "CLRSKY_SFC_SW_DWN": "Açık-Gökyüzü Yüzeye İnen Kısa Dalga Radyasyon (kWh/m²/gün)",
    "ALLSKY_SFC_LW_DWN": "Tüm-Gökyüzü Yüzeye İnen Uzun Dalga Radyasyon",
    "ALLSKY_SFC_UV_INDEX": "Günlük Ortalama UV İndeksi",
}


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
            "very_hot": 15,
            "very_cold": -25,
            "heavy_rain": 5,
            "very_windy": 20,
            "very_cloudy": 80,
            # "very_uncomfortable": 28
        },
        "subarctic": {
            "very_hot": 25,
            "very_cold": -20,
            "heavy_rain": 8,
            "very_windy": 18,
            "very_cloudy": 80,
            # "very_uncomfortable": 30
        },
        "temperate": {
            "very_hot": 32,
            "very_cold": -5,
            "heavy_rain": 10,
            "very_windy": 15,
            "very_cloudy": 85,
            # "very_uncomfortable": 32
        },
        "subtropical": {
            "very_hot": 38,
            "very_cold": 5,
            "heavy_rain": 15,
            "very_windy": 20,
            "very_cloudy": 85,
            # "very_uncomfortable": 38
        },
        "tropical": {
            "very_hot": 40,
            "very_cold": 15,
            "heavy_rain": 20,
            "very_windy": 25,
            "very_cloudy": 90,
            # "very_uncomfortable": 40
        }
    }

    return thresholds.get(climate_zone, thresholds["temperate"])


# Örnek fonksiyon
def calculate_temperature(data: StringIO) -> float:
    """
    Tahmin edilen hava sıcaklığı
    """
    df = pd.read_json(data)
    return round(df.T2M.mean(), 2)


# Analiz sonuçlarının hesaplanıp gönderileceği fonksiyon
def get_weather_probability(data: StringIO) -> dict:
    """
    Bilgi Sunumu:
        Seçilen konum ve tarih için aşağıdaki gibi bilgileri sunmalıdır:
    Olasılıklar:
        "Çok sıcak", "çok soğuk", "çok rüzgarlı", "çok yağışlı" veya "çok rahatsız edici" gibi koşulların yüzde olarak olasılığı.
    Ortalama Değerler:
        O gün için ortalama sıcaklık, rüzgar hızı gibi istatistiksel veriler.
    Aşırı Hava Olayları:
        Belirli eşik değerlerini aşma olasılığı (örneğin, sıcaklığın 32°C'yi geçme ihtimali %10 gibi).
    """

    ### Kodlar buraya! ###

    return {
        "query": {
            "location": {
                "latitude": 0,
                "longitude": 0
            },
            "date": {
                "month": 0,
                "day": 0
            },
        },
        "analysis_summary": {
            "title": "Weather Probabilities for X/X",
            "data_source": "NASA POWER MERRA-2 Dataset"
        },
        "weather_probabilities": {

        },
        "thresholds_info": {
            "climate_zone": "X",
            "thresholds_data": get_thresholds_by_climate_zone(get_climate_zone(0, 0))
        }
    }


if __name__ == "__main__":
    pass
