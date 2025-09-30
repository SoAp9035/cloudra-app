# Verilerin Analizi

Parametre bilgileri:

```python
POWER_PARAMETERS = {
    # Sıcaklık
    "T2M": "2 m Ortalama Sıcaklık (°C)",
    "T2M_MAX": "2 m Maksimum Sıcaklık (°C)",
    "T2M_MIN": "2 m Minimum Sıcaklık (°C)",
    "T2MDEW": "2 m Çiğ Noktası (°C)", # Havanın nem bakımından rahatsız ediciliği için

    # Nem
    "RH2M": "2 m Bağıl Nem (%)",

    # Yağış
    "PRECTOTCORR": "Düzeltilmiş Toplam Yağış (mm/gün)",
    "PRECSNOLAND": "Kar Yağışı (mm/gün)",
    "SNODP": "Kar Örtüsü (cm)",

    # Rüzgar
    "WS10M": "10 m Rüzgar Hızı (m/s)",
    "WS10M_MAX": "10 m Maksimum Rüzgar Hızı (m/s)",

    # Bulutluluk
    "CLOUD_AMT": "Toplam Bulut Örtüsü (%)",
}
```

---

## Ortalama Değerler

Bu bölüm, kullanıcının o gün için "normal" olarak ne beklemesi gerektiğini anlamasına yardımcı olur.

- **Ortalama Sıcaklık (°C)**
    - **Formül**: (Tüm Sıcaklık Değerlerinin Toplamı) / (Toplam Veri Sayısı)

- **Sıcaklık Aralığı (°C)**
    - Maksimum ve minimum değerler.

- **Ortalama Nem (%)**
    - **Formül**: (Tüm Nem Değerlerinin Toplamı) / (Toplam Veri Sayısı)

- **Ortalama Rüzgar Hızı (m/s)**
    - **Formül**: (Tüm Rüzgar Hızı Değerlerinin Toplamı) / (Toplam Veri Sayısı)

- **Ortalama Bulutluluk (%)**
    - **Formül**: (Tüm Bulutluluk Değerlerinin Toplamı) / (Toplam Veri Sayısı)

- **Sis Durumu (0-3 scale)**
    - **Formül**: (T2MDEW - T2M) / (Toplam Veri Sayısı)
    - > Not: Sisli gün, T2MDEW ile T2M arasındaki farkın 2°C'den az olduğu günler olarak tanımlanır.

- **Yağmur Olasılığı (%)**
    - **Formül**: (Yağışlı Gün Sayısı) / (Toplam Gün Sayısı) × 100
    - > Not: Yağışlı gün, PRECTOTCORR > 0.1 mm/gün olarak tanımlanır.

- **Kar Örtüsü Olasılığı (%)**
    - **Formül**: (Kar Örtülü Gün Sayısı) / (Toplam Gün Sayısı) × 100
    - > Not: Kar örtülü gün, SNODP > 0 cm olarak tanımlanır.

---

## Olasılık Sonuçları

Kullanıcının belirli hava koşullarıyla karşılaşma ihtimalini yüzde olarak gösterir. Verilen iklime özel eşik değer bilgileri ile hesaplanacak.

- **Çok Rahatsız Edici (very_uncomfortable)**
    - **Kullanılacak parametreler**: T2MDEW (°C)
    - **Formül**: T2MDEW > 24 olan günlerin sayısı / Toplam gün sayısı × 100
    - > Not: Bu, sıcak ve nemli koşullarda rahatsızlık hissini ifade eder. Farklı parametreler ve eşik değerler kullanılabilir.

- **Çok Sıcak (very_hot)**
    - **Kullanılacak parametre**: T2M_MAX (°C)
    - **Formül**: T2M_MAX > 40 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Soğuk (very_cold)**
    - **Kullanılacak parametre**: T2M_MIN (°C)
    - **Formül**: T2M_MIN < -10 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Yağışlı (heavy_rain)**
    - **Kullanılacak parametreler**: PRECTOTCORR (mm/gün)
    - **Formül**: PRECTOTCORR > 20 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Kar Yağışlı (heavy_snowfall)**
    - **Kullanılacak parametreler**: PRECSNOLAND (mm/gün)
    - **Formül**: PRECSNOLAND > 10 olan günlerin sayısı / Toplam gün sayısı × 100

- **Çok Rüzgarlı (very_windy)**
    - **Kullanılacak parametreler**: WS10M_MAX (m/s)
    - **Formül**: (WS10M_MAX > 15 olan günlerin sayısı) / (Toplam gün sayısı) × 100

> Not: Eşik değerler, iklime ve bölgeye göre ayarlanacak. Örneğin, tropikal bölgelerde "çok sıcak" eşiği 35°C olarak belirlenecektir.
