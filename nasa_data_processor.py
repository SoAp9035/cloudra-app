import pandas as pd


# NASA verilerini işlemek için kullanılacak ortam

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
    "ALLSKY_SFC_UV_INDEX": "Günlük Maksimum UV İndeksi",
}

# Projede hesaplanacak endeksler
DERIVED_INDICES = {
    # "Çok sıcak / rahatsız"
    "HEAT_INDEX":        {"label": "Isı İndeksi (HI)", "requires": ["T2M", "RH2M"]},
    "APPARENT_TEMP":     {"label": "Hissedilen Sıcaklık (AT)", "requires": ["T2M", "RH2M", "WS10M", "ALLSKY_SFC_SW_DWN"]},
    "HUMIDEX":           {"label": "Humidex", "requires": ["T2M", "T2MDEW"]},
    "WET_BULB_TEMP":     {"label": "Islak Termometre Sıcaklığı", "requires": ["T2M", "RH2M", "PS"]},
    "WBGT_APPROX":       {"label": "WBGT (yaklaşık)", "requires": ["T2M", "RH2M", "WS10M", "ALLSKY_SFC_SW_DWN"]},

    # "Çok soğuk"
    "WIND_CHILL":        {"label": "Rüzgar Soğuğu", "requires": ["T2M", "WS10M"]},

    # Nem konfor metrikleri
    "VPD":               {"label": "Buhar Basıncı Açığı (VPD)", "requires": ["T2M", "RH2M"]},

    # Olasılık / eşik tabanlı göstergeler (tarihsel seriden hesaplanır)
    "HOT_DAY_PROB":      {"label": "Sıcak Gün Olasılığı (Tmax > eşik)", "requires": ["T2M_MAX"]},
    "COLD_DAY_PROB":     {"label": "Soğuk Gün Olasılığı (Tmin < eşik)", "requires": ["T2M_MIN"]},
    "WINDY_DAY_PROB":    {"label": "Rüzgarlı Gün Olasılığı (WS10M > eşik)", "requires": ["WS10M"]},
    "RAIN_DAY_PROB":     {"label": "Yağışlı Gün Olasılığı (P > eşik)", "requires": ["PRECTOTCORR"]},
    "HEAVY_RAIN_PROB":   {"label": "Kuvvetli Yağış Olasılığı (P > yüksek eşik)", "requires": ["PRECTOTCORR"]},
    "CONSEC_WET_DAYS":   {"label": "Art Arda Islak Günler (CWD)", "requires": ["PRECTOTCORR"]},
    "DRY_SPELL":         {"label": "Kuru Periyot Uzunluğu (CDD)", "requires": ["PRECTOTCORR"]},
}
