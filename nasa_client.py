# DO NOT CHANGE ANYTHING HERE! INFORM AHMET!!!

import time
import requests
import pandas as pd
from io import StringIO
from datetime import datetime, timedelta


# Genel parametreler
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

    # Güneşlilik
    "PSH": "Güneş Işığı Yoğunluğu (MJ/m^2/day)",

    # Radyasyon / UV (rahatsızlık ve ısı stresi endeksleri için)
    "ALLSKY_SFC_SW_DWN": "Tüm-Gökyüzü Yüzeye İnen Kısa Dalga Radyasyon (kWh/m²/gün)",
    "CLRSKY_SFC_SW_DWN": "Açık-Gökyüzü Yüzeye İnen Kısa Dalga Radyasyon (kWh/m²/gün)",
    "ALLSKY_SFC_LW_DWN": "Tüm-Gökyüzü Yüzeye İnen Uzun Dalga Radyasyon",
    "ALLSKY_SFC_UV_INDEX": "Günlük Ortalama UV İndeksi",
}


class NASAPowerAPI:
    # POWER MERRA-2 API URL
    # https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN,T2M,RH2M,WS10M,PRECTOTCORR&community=AG&longitude=32.499100&latitude=37.853170&start=20250901&end=20250915&format=JSON
    BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

    def get_historical_data(
        self,
        lat: float,
        lon: float,
        start_date: str,
        end_date: str,
        parameters: list[str] | dict,
        format: str = "JSON",
    ) -> dict | str:
        """
        NASA POWER API'den tarihi veri çeker.

        Tarih formatı: 20250918
        """
        params = {
            "parameters": ",".join(parameters),
            "community": "AG",
            "latitude": lat,
            "longitude": lon,
            "start": start_date,
            "end": end_date,
            "format": format,
        }

        response = requests.get(self.BASE_URL, params=params)
        return response.json() if format == "JSON" else response.text

    def get_multi_year_data_for_day(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        day_range: int,
        years_back: int,
        parameters: list[str] | dict = POWER_PARAMETERS,
        format: str = "JSON",
    ) -> StringIO | None:
        """
        Belirli bir gün için son X yılın verilerini çeker.

        Returns:
            Pandas tarafından okunabilir StringIO.
        """
        all_data = []
        current_year = datetime.now().year
        
        for year in range(current_year - years_back, current_year):
            try:
                date = datetime(year, month, day)
                start = date - timedelta(days=day_range)
                end = date + timedelta(days=day_range)
                
                data = self.get_historical_data(
                    lat=lat,
                    lon=lon,
                    start_date=start.strftime("%Y%m%d"),
                    end_date=end.strftime("%Y%m%d"),
                    parameters=parameters,
                    format="JSON"
                )
                all_data.append(data["properties"]["parameter"])
            except Exception as e:
                print(f"Something went wrong with NASAPowerAPI/get_multi_year_data_for_day. Error: {e}")
                continue

            time.sleep(.1) # API'den banlanmamak için gecikme

        if not all_data:
            print("get_multi_year_data_for_day: No data returned by API.")
            return None

        try: 
            df = pd.concat([pd.DataFrame(item) for item in all_data])

            df.index = pd.to_datetime(df.index)
            df.sort_index(inplace=True)
            df.index.name = "DATE"

            if format == "JSON":
                df_copy = df.copy()
                df_copy.index = df_copy.index.strftime("%Y-%m-%d")
                return StringIO(df_copy.to_json())
            else:
                return StringIO(df.to_csv())

            # Eski yöntem: str olarak döndürür
            # return df.to_json() if format == "JSON" else df.to_csv()
        except Exception as e:
            print(f"Something went wrong with Pandas/get_multi_year_data_for_day. Error: {e}")
            return None
