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

# Örnek fonksiyon
def calculate_temperature(data: StringIO) -> float:
    """
    Tahmin edilen hava sıcaklığı
    """
    df = pd.read_csv(data)
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
    return {}


if __name__ == "__main__":
    pass
