# Verilerin Analizi

Parametre bilgileri:

```python
POWER_PARAMETERS = {
    # Sıcaklık
    "T2M": "2 m Ortalama Sıcaklık (°C)",
    "T2M_MAX": "2 m Maksimum Sıcaklık (°C)",
    "T2M_MIN": "2 m Minimum Sıcaklık (°C)",
    "T2M_RANGE": "2 m Günlük Sıcaklık Aralığı (°C)", # Sıcaklığın gün içinde çok değiştiği hk.
    "T2MDEW": "2 m Çiğ Noktası (°C)", # Havanın nem bakımından rahatsız ediciliği için

    # Nem / Basınç
    "RH2M": "2 m Bağıl Nem (%)",
    "PS": "Yüzey Basıncı (kPa)",

    # Yağış
    "PRECTOTCORR": "Düzeltilmiş Toplam Yağış (mm/gün)",
    "PRECSNOLAND": "Kar Yağışı (mm/gün)",

    # Rüzgar
    "WS10M": "10 m Rüzgar Hızı (m/s)",
    "WS2M": "2 m Rüzgar Hızı (m/s)",

    # Bulutluluk
    "CLOUD_AMT": "Toplam Bulut Örtüsü (%)",

    # Güneşlilik
    "PSH": "Güneş Işığı Yoğunluğu (MJ/m^2/day)",

    # UV
    "ALLSKY_SFC_UV_INDEX": "Günlük Ortalama UV İndeksi",
}
```

---

## Ortalama Değerler

Bu bölüm, kullanıcının o gün için "normal" olarak ne beklemesi gerektiğini anlamasına yardımcı olur.

- **Ortalama Sıcaklık (°C)**
    - **Formül**: (Tüm Sıcaklık Değerlerinin Toplamı) / (Toplam Veri Sayısı)

- **Sıcaklık Aralığı (°C)**
    - Maksimum ve minimum değerler.

- **Ortalama Rüzgar Hızı (m/s)**
    - **Formül**: (Tüm Rüzgar Hızı Değerlerinin Toplamı) / (Toplam Veri Sayısı)

- **Ortalama Nem (%)**
    - **Formül**: (Tüm Nem Değerlerinin Toplamı) / (Toplam Veri Sayısı)

---

## Olasılık Sonuçları

Kullanıcının belirli hava koşullarıyla karşılaşma ihtimalini yüzde olarak gösterir. Verilen iklime özel eşik değer bilgileri ile hesaplanacak.

- **Çok Rahatsız Edici (very_uncomfortable)**
    - **Kullanılacak parametreler**: T2MDEW (°C)
    - **Formül**: T2MDEW > 24 olan günlerin sayısı / Toplam gün sayısı × 100
    - > Not: Bu, sıcak ve nemli koşullarda rahatsızlık hissini ifade eder. Farklı parametreler ve eşik değerler kullanılabilir.

- **Çok Sıcak (very_hot)**
    - **Kullanılacak parametre**: T2M (°C)
    - **Formül**: T2M > 40 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Soğuk (very_cold)**
    - **Kullanılacak parametre**: T2M (°C)
    - **Formül**: T2M < -10 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Yağışlı (heavy_rain)**
    - **Kullanılacak parametreler**: PRECTOTCORR (mm/gün)
    - **Formül**: PRECTOTCORR > 20 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Kar Yağışlı (heavy_snowfall)**
    - **Kullanılacak parametreler**: PRECSNOLAND (mm/gün)
    - **Formül**: PRECSNOLAND > 10 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Rüzgarlı (very_windy)**
    - **Kullanılacak parametreler**: WS10M (m/s)
    - **Formül**: (WS10M > 15 olan günlerin sayısı) / (Toplam gün sayısı) × 100

- **Çok Bulutlu (very_cloudy)**
    - **Kullanılacak parametreler**: CLOUD_AMT (%)
    - **Formül**: (CLOUD_AMT > 80 olan günlerin sayısı) / (Toplam gün sayısı) × 100
