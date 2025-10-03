# **"Will It Rain On My Parade?" - Proje Sunumu**

## 🎯 **1. GİRİŞ (Problem)**

**"Hiç önemli bir açık hava etkinliği planlarken havanın nasıl olacağını merak ettiniz mi?"**

Düğün, konser, piknik, açık hava festivali veya tarımsal faaliyetler planlıyorsunuz. Ancak etkinliğiniz 6 ay sonra. Klasik hava tahmin uygulamaları sadece 7-14 gün sonrasını gösteriyor. **Peki 6 ay sonra seçtiğiniz tarihteki hava nasıl olacak?**

- Yağmur yağacak mı?
- Aşırı sıcak olacak mı?
- Rüzgarlı bir gün mü olacak?

**İşte tam da burada "Will It Rain On My Parade?" devreye giriyor!**

---

## 💡 **2. ÇÖZÜM: Projemiz Nasıl Bir Çözüm Getiriyor?**

Bu proje, **hava tahmini yapmaz** - bundan daha akıllı bir şey yapar: **İstatistiksel olasılıklar sunar!**

### **Ana Özellikler:**

✅ **Geçmiş Verilere Dayalı Analiz**: NASA'nın son 10-30 yıllık meteoroloji verilerini kullanarak, belirli bir tarih ve konumdaki hava koşullarının **olasılığını** hesaplar.

✅ **Detaylı Olasılık Raporları**:
- 🌡️ Çok sıcak olma olasılığı: %65
- 💨 Çok rüzgarlı olma olasılığı: %12
- 🌧️ Yağmur yağma olasılığı: %15
- ❄️ Kar örtüsü olasılığı: %2

✅ **İklim Bölgesine Özel Eşik Değerleri**: Kutup bölgelerinde 15°C "çok sıcak" sayılırken, tropik bölgelerde 40°C eşik değeri kullanılır.

✅ **İki Analiz Modu**:
- **Hızlı Analiz**: Son 10 yılın verisi
- **Detaylı Analiz**: Son 30 yılın verisi

---

## 🖥️ **3. NASIL ÇALIŞIR? (Kullanıcı Deneyimi)**

### **Adım 1: Konum Seçimi** 📍
- Kullanıcı harita üzerinde **herhangi bir noktaya tıklayarak** konum seçer
- Veya arama kutusuna **şehir/adres yazarak** arama yapabilir
- Konum otomatik olarak tersine coğrafi kodlama ile adrese dönüşür

### **Adım 2: Tarih Seçimi** 📅
- Yılın belirli bir gününü seçer (örnek: 2 Ağustos)
- Sistem o tarihe ait geçmiş yıllardaki verileri toplar

### **Adım 3: Analiz Modunu Seçme** ⚙️
- **Quick Analysis**: Hızlı sonuç için 10 yıllık veri
- **Detailed Analysis**: Daha kapsamlı sonuç için 30 yıllık veri

### **Adım 4: Sonuçları Görüntüleme** 📊
Kullanıcı şunları görür:
- Ortalama sıcaklık, nem, rüzgar hızı
- Yağmur, kar, sis olasılıkları
- Aşırı hava olayları olasılıkları (çok sıcak, çok soğuk, çok rüzgarlı)
- İklim bölgesi bilgisi ve kullanılan eşik değerleri

### **Adım 5: Veri İndirme** 💾
- Sonuçları CSV veya JSON formatında indirebilir
- Kendi analizleri için ham verilere erişebilir

---

## 🔬 **4. KULLANILAN TEKNOLOJİ**

### **🛰️ NASA POWER MERRA-2 Veri Seti**
- **MERRA-2 (Modern-Era Retrospective analysis for Research and Applications)**: NASA'nın en kapsamlı iklim yeniden analiz veri setidir
- **43 yıllık veri** (1980-2023) içerir
- Parametreler:
  - Sıcaklık (T2M, T2M_MAX, T2M_MIN)
  - Nem (RH2M)
  - Yağış (PRECTOTCORR)
  - Kar (PRECSNOLAND, SNODP)
  - Rüzgar (WS10M, WS10M_MAX)
  - Bulutluluk (CLOUD_AMT)
  - Çiğ Noktası (T2MDEW)

### **🔧 Backend Teknolojileri:**
- **Python 3.13** - Ana programlama dili
- **Flask** - RESTful API framework
- **Pandas** - Veri işleme ve analiz
- **UV** - Modern Python paket yöneticisi
- **CORS desteği** - Frontend-backend iletişimi

### **🎨 Frontend Teknolojileri:**
- **React 19** - Modern kullanıcı arayüzü
- **Leaflet & React-Leaflet** - Interaktif harita sistemi
- **Vite** - Hızlı geliştirme ortamı
- **TailwindCSS** - Modern ve responsive tasarım
- **OpenStreetMap Nominatim API** - Coğrafi kodlama

### **📡 API Mimarisi:**
```
Frontend (React) 
    ↓ HTTP GET Request
Backend (Flask API)
    ↓ NASA POWER API çağrısı
NASA POWER MERRA-2 Veri Seti
    ↓ JSON Response
Backend (Veri İşleme & Analiz)
    ↓ İstatistiksel Hesaplamalar
Frontend (Sonuçların Görselleştirilmesi)
```

### **🧮 İstatistiksel Analiz:**
- **Veri Normalizasyonu**: Eksik verilerin (-999) ortalama/medyan ile doldurulması
- **Outlier Tespiti**: IQR yöntemi ile aykırı değerlerin belirlenmesi
- **İklim Bölgesi Sınıflandırması**: 5 farklı iklim bölgesi (kutup, subarktik, ılıman, subtropikal, tropikal)
- **Olasılık Hesaplamaları**: Eşik değerlerini aşan günlerin yüzdesi

---

## 🎬 **5. ÖRNEK SENARYO**

### **Kullanıcı Profili:**
**Ayşe**, İstanbul'da Haziran ayının 15'inde açık hava düğünü planlıyor. Etkinlik 6 ay sonra ve bahçe düğünü yapıp yapmayacağına karar verememiş.

### **Uygulama Kullanımı:**

**1. Konum Seçimi:**
- Ayşe harita üzerinde İstanbul'daki düğün bahçesinin konumunu işaretler
- Koordinatlar: 41.0082°N, 28.9784°E

**2. Tarih ve Mod Seçimi:**
- Tarih: 15 Haziran
- Mod: Detailed Analysis (30 yıllık veri için)

**3. Analiz Butonu:**
- "Analyze" butonuna tıklar
- Backend NASA verilerini çeker ve işler

**4. Sonuçlar:**
```
📊 Hava Olasılıkları (15 Haziran, İstanbul)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌡️ Ortalama Sıcaklık: 26°C (22-30°C arası)
💧 Ortalama Nem: %65
💨 Ortalama Rüzgar: 10.2 km/s
☁️ Bulutluluk: %45

📈 Olasılıklar:
🌧️ Yağmur: %18
❄️ Kar: %0

❔ Aşırı Hava Olayları:
🔥 Çok Sıcak (>32°C): %12
🌊 Rahatsız Edici Nem: %35
💨 Çok Rüzgarlı: %8

🌍 İklim Bölgesi: Temperate
📦 Analiz Edilen Veri: 30 yıl
```

**5. Karar:**
Ayşe, yağmur olasılığının düşük (%18) ve hava koşullarının genel olarak uygun olduğunu görür. Ancak %18'lik yağmur riski için:
- ✅ Bahçe düğünü planı yapıyor
- ✅ Plan B olarak kapalı salon rezervasyonu da tutuyor
- ✅ Misafirler için şemsiye hazırlığı yapıyor

---

## 🌟 **6. KAPANIŞ: Projenin Önemi ve Potansiyeli**

### **Neden Bu Proje Önemli?**

✅ **Öngörülebilirlik Sağlar**: İnsanların uzun vadeli planlar yaparken bilinçli kararlar almasına yardımcı olur

✅ **Bilime Dayalıdır**: 30-40 yıllık NASA verileri ile desteklenen güvenilir istatistikler

✅ **Gerçekçi Beklentiler**: "Tahmin" değil "olasılık" sunarak kullanıcıları yanıltmaz

✅ **Evrensel Kullanım**: Dünyanın her noktası için çalışır

### **Kullanım Alanları:**

🎉 **Etkinlik Planlama**: Düğün, konser, festival organizasyonları

🌾 **Tarım**: Ekim, hasat, sulama zamanlaması

✈️ **Turizm**: Tatil planlaması, seyahat danışmanlığı

🏗️ **İnşaat**: Açık alan çalışmaları için planlama

📸 **Fotoğrafçılık**: Doğa ve açık hava çekimleri için ideal günleri bulma

### **Gelecek Potansiyeli:**

🚀 **Mobil Uygulama**: iOS ve Android versiyonları

📧 **Bildirim Sistemi**: Seçilen tarihe yaklaşıldığında e-posta/SMS

🤖 **AI Entegrasyonu**: Makine öğrenmesi ile daha gelişmiş tahminler

📊 **İş Analitiği Dashboard**: Kurumsal müşteriler için gelişmiş raporlama

🌐 **Çoklu Dil Desteği**: Global kullanıcılar için yerelleştirme

---

### **Son Söz:**

**"Will It Rain On My Parade?"** sadece bir hava durumu uygulaması değil - uzun vadeli planlama yapan herkes için **bilime dayalı bir karar destek sistemi**dir. NASA'nın on yıllarca biriktirdiği verileri, sıradan insanların günlük hayatlarına değer katan bir araç haline getiriyoruz.

**Çünkü bazen bilmek, tahmin etmekten daha iyidir! 🌤️**