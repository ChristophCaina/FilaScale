# 📊 Web-Interface

[← Zurück zur Firmware-Dokumentation](./README.md)

FilaScale verfügt über ein eingebautes Web-Interface, das direkt über jeden Browser im lokalen Netzwerk erreichbar ist — ohne App, ohne Home Assistant.
Das Interface basiert auf dem **ESPHome Web Server v3** und unterstützt automatisch Light und Dark Mode basierend auf den Systemeinstellungen.

---

## 🔗 Zugriff auf das Interface

Browser öffnen und navigieren zu:

```
http://filascale.local
```

Oder direkt über die IP-Adresse:

```
http://192.168.x.x
```

> ℹ️ mDNS (`filascale.local`) erfordert ein kompatibles Betriebssystem. Windows 10+, macOS und Linux mit Avahi unterstützen dies standardmäßig.

---

## 🖼️ Interface-Übersicht

### Light Mode

![Web Interface — Light Mode](https://christophcaina.github.io/filament_scale/images/webinterface-light.png)
*Web-Interface im Light Mode mit Sensor- und Steuerbereich*

### Dark Mode

![Web Interface — Dark Mode](https://christophcaina.github.io/filament_scale/images/webinterface-dark.png)
*Web-Interface im Dark Mode mit Sensor- und Steuerbereich*

---

## 📡 Sensoren und Steuerung

![Sensor and Control Section](https://christophcaina.github.io/filament_scale/images/webinterface-sensors.png)

| Entität | Typ | Beschreibung |
| :--- | :--- | :--- |
| **Filament Remaining** | Sensor | Verbleibendes Filament in % |
| **Filament Weight** | Sensor | Aktuelles Gewicht in Gramm |
| **Material** | Sensor | Filament-Material |
| **Color** | Sensor | Filament Farbname des Herstellers |
| **Brand** | Sensor | Filament Hersteller |

---

## ⚙️ Konfiguration

![Configuration Section](https://christophcaina.github.io/filament_scale/images/webinterface-config.png)

| Entität | Typ | Beschreibung |
| :--- | :--- | :--- |
| **Calibration Factor** | Number (Slider) | Kalibrierungsfaktor der Waage — siehe [Kalibrierungsanleitung](calibration.md) |
| **Empty Spool Weight** | Number (Slider) | Leergewicht der Spule in Gramm |
| **Total Filament Weight** | Number (Slider) | Gesamtfilamentgewicht bei voller Spule in Gramm |
| **Backend IP** | Text | IP-Adresse und Port zu Spoolman, FilaMan*, FilaBridge |
| **Tare Scale** | Button | Waage mit leerer Plattform nullen |
| **Firmware Update** | Update | Zeigt Firmware-Status und löst OTA-Update aus |

> ℹ️ Alle Konfigurationswerte werden direkt auf dem Gerät gespeichert und überleben Neustarts. Kein erneutes Flashen erforderlich.

---

## 🔍 Diagnose

| Entität | Typ | Beschreibung |
| :--- | :--- | :--- |
| **Scale Raw** | Sensor | Rohwert des HX711 — wird für die Kalibrierung verwendet |
| **Color-Hex** | Sensor | Farbcode des Herstellers |
| **Tag-Type** | Sensor | Typ des gescannten Tags |
| **Backend Online** | Binär-Sensor | Zeigt an, ob ein Backend erreichbar ist |
| **NFC-Tag-ID** | Sensor | Eindeutige ID des NFC-Tags |
| **Connected SSDI** | Sensor | SSID des Wifi-Netzwerkes über welches FilaScale verbunden ist |
| **DNS Address** | Sensor | Die DNS Adresse des Netzwerks |
| **IP Address** | Sensor | Die IP Adresse von FilaScale |
| **Internal Temperature** | Sensor | ESP-Chip Temperatur |
| **Uptime** | Sensor | Uptime von FilaScale
| **Restart Device** | Button | Startet FilaScale neu |
| **Shutdown Device** | Button | Fährt FilaScale herunter |

---

## 🔄 OTA Update

Das Web-Interface bietet am unteren Ende der Seite eine manuelle OTA-Update-Option. Eine lokale `.bin`-Datei kann direkt ausgewählt und geflasht werden — ohne Home Assistant oder ESPHome Dashboard.

---

## ✨ Features

- ✅ Keine App oder Home Assistant erforderlich
- ✅ Light und Dark Mode (folgt Systemeinstellung)
- ✅ Slider für Number-Entitäten (Kalibrierungsfaktor, Spulengewichte)
- ✅ Sensor-Verlaufsgraphen (Klick auf einen Sensor zum Aufklappen)
- ✅ Manuelles OTA-Update per Datei-Upload
- ✅ Live Debug-Log
