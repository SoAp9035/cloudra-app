### Projenin Özeti ve Amacı

Kısacası, bu projenin amacı, kullanıcıların gelecekteki bir tarih (örneğin 6 ay sonrası) ve belirli bir konum için hava durumunun nasıl olabileceğine dair **olasılıkları** sunan bir web uygulaması geliştirmektir. Bu bir **hava durumu tahmini değildir**, aksine NASA'nın on yıllara yayılan geçmiş verilerine dayanarak o gün ve konum için hava koşullarının istatistiksel bir analizidir.

**Örnek Senaryo:** Bir kullanıcı, Haziran ayının ilk haftasında İstanbul'da bir açık hava partisi planlıyor. Uygulamanıza girerek konumu ve tarihi seçiyor. Uygulamanız da NASA verilerini analiz ederek o tarihte İstanbul'da yağmur yağma olasılığının %40, ortalama sıcaklığın 26°C ve aşırı sıcak bir hava dalgası yaşanma ihtimalinin %10 olduğunu söylüyor. Bu bilgi, kullanıcının önlem almasına (örneğin bir şemsiye veya yedek bir kapalı mekan ayarlamasına) yardımcı olur.

---

### 1. Projede İstenilen Çıktı Nedir?

Yarışma sizden aşağıdakileri içeren, tamamen işlevsel bir web uygulaması (veya mobil uygulama) bekliyor:

1.  **Kişiselleştirilmiş Bir Arayüz (Dashboard):** Kullanıcının kolayca etkileşim kurabileceği bir arayüz.
2.  **Kullanıcı Girdileri:**
    *   **Konum Seçimi:** Kullanıcı haritadan bir nokta işaretleyerek, bir yerin adını yazarak veya harita üzerinde bir alan çizerek konum belirleyebilmelidir.
    *   **Tarih Seçimi:** Kullanıcı, yılın belirli bir gününü (örneğin, 15 Temmuz) seçebilmelidir.
3.  **Bilgi Sunumu:** Seçilen konum ve tarih için aşağıdaki gibi bilgileri sunmalıdır:
    *   **Olasılıklar:** "Çok sıcak", "çok soğuk", "çok rüzgarlı", "çok yağışlı" veya "çok rahatsız edici" gibi koşulların yüzde olarak olasılığı.
    *   **Ortalama Değerler:** O gün için ortalama sıcaklık, rüzgar hızı gibi istatistiksel veriler.
    *   **Aşırı Hava Olayları:** Belirli eşik değerlerini aşma olasılığı (örneğin, sıcaklığın 32°C'yi geçme ihtimali %10 gibi).
4.  **Görselleştirme:** Sonuçlar sadece metin olarak değil, aynı zamanda kullanıcıların kolayca anlayabileceği **grafikler, haritalar veya zaman serileri** gibi görsel elementlerle desteklenmelidir.
5.  **Veri İndirme Seçeneği:** Kullanıcıların yaptıkları sorguya ait ham verileri veya analiz sonuçlarını **CSV** veya **JSON** formatında indirebilmelerine olanak tanımalıdır.

---

### 2. Kurallar ve Gereksinimler Nelerdir?

Projenizi geliştirirken uymanız gereken temel kurallar ve beklentiler şunlardır:

*   **NASA Verilerini Kullanma Zorunluluğu:** Projenin kalbi, NASA'nın Dünya gözlem verilerini kullanmaktır. Size verilen kaynaklar (GES DISC, Giovanni, Earthdata Search vb.) bu verileri çekmek için kullanılmalıdır.
*   **Tarihsel Veri Odaklı Olma:** Uygulamanızın bir "tahmin" uygulaması olmadığını açıkça belirtmelisiniz. Çıktıların, geçmiş verilere dayanan **istatistiksel olasılıklar** olduğu vurgulanmalıdır.
*   **Kullanıcı Dostu Arayüz:** Arayüzün karmaşık olmaması, kullanıcıların kolayca konum ve tarih seçip sonuçları anlayabilmesi beklenir.
*   **Değişken Seçimi:** Kullanıcıya sunulacak hava durumu değişkenlerini (sıcaklık, yağış, rüzgar vb.) dikkatli seçmelisiniz. Çok fazla teknik değişken sunmak kafa karıştırıcı olabilir. Açık hava etkinlikleri için en alakalı olanlara odaklanılmalıdır.
*   **Metadata (Üst Veri) Sağlama (Önerilen):** İndirilen dosyalarda, verinin birimi (örn: Celsius, km/s), hangi NASA kaynağından alındığı gibi bilgilerin (metadata) bulunması tavsiye edilir.

---

### 3. Backend'in Frontend'e Vermesi Gereken Çıktı Nedir?

Bu, projenizin teknik mimarisi için en kritik sorudur. Backend, NASA'nın karmaşık veri setlerinden anlamlı bilgiler çıkarıp bunu frontend'in kolayca işleyebileceği bir formatta sunmalıdır. Genellikle bu, **JSON formatında bir API yanıtı** olur.

Frontend'den backend'e muhtemelen şöyle bir istek gelecektir:
`GET /api/weather-probability?lat=41.0082&lon=28.9784&day=15&month=7`

Backend'in bu isteğe yanıt olarak frontend'e göndermesi gereken JSON çıktısı örneği aşağıda verilmiştir. Bu yapı, projenizin tüm gereksinimlerini karşılayacak şekilde tasarlanmıştır:

```json
{
  "query": {
    "location": {
      "name": "Istanbul, Turkey",
      "latitude": 41.0082,
      "longitude": 28.9784
    },
    "date": {
      "day": 15,
      "month": 7
    }
  },
  "analysis_summary": {
    "title": "Weather Probabilities for July 15 in Istanbul",
    "summary_text": "Based on historical data from 1980-2022, there is a 15% chance of rain. The average temperature is 28°C. There is a high probability of a 'very hot' day.",
    "data_source": "NASA GES DISC / MERRA-2 Dataset"
  },
  "weather_probabilities": {
    "temperature": {
      "unit": "Celsius",
      "average": 28,
      "probability_very_hot_percent": 65,  // Threshold: > 32°C
      "probability_very_cold_percent": 1    // Threshold: < 15°C
    },
    "precipitation": {
      "unit": "mm/day",
      "average": 0.5,
      "probability_of_rain_percent": 15,
      "probability_of_heavy_rain_percent": 2
    },
    "wind": {
      "unit": "kph",
      "average_speed": 18,
      "probability_very_windy_percent": 12
    },
    "comfort": {
      "probability_uncomfortable_percent": 70 // (e.g., based on heat index)
    }
  },
  "visualizations": {
    "temperature_history_timeseries": {
      "years": [1980, 1981, ..., 2022],
      "temperatures": [27, 29, ..., 31]
    },
    "precipitation_distribution": {
      "labels": ["No Rain", "Light Rain", "Heavy Rain"],
      "percentages": [85, 13, 2]
    }
  },
  "download_links": {
    "csv": "/api/download?format=csv&lat=41.0082&lon=28.9784&day=15&month=7",
    "json": "/api/download?format=json&lat=41.0082&lon=28.9784&day=15&month=7"
  }
}
```

#### Bu JSON Yapısının Açıklaması:

*   **`query`**: Frontend'in gönderdiği isteği teyit eder.
*   **`analysis_summary`**: Frontend'in doğrudan kullanıcıya gösterebileceği özet metin, başlık ve veri kaynağı gibi bilgileri içerir.
*   **`weather_probabilities`**: Projenin ana çıktısıdır. Her bir hava durumu kategorisi (sıcaklık, yağış vb.) için hesaplanmış olasılık ve ortalama değerleri içerir. Frontend bu verileri alıp gösterge panellerinde, kartlarda veya metin olarak gösterebilir.
*   **`visualizations`**: Frontend'in grafik çizmek için kullanabileceği, hazır hale getirilmiş veri setlerini içerir. Örneğin, `temperature_history_timeseries` verisi ile geçmiş yıllardaki sıcaklık değişimini gösteren bir çizgi grafiği kolayca oluşturulabilir.
*   **`download_links`**: Kullanıcının verileri CSV veya JSON olarak indirmesini sağlayacak API endpoint'lerini içerir.