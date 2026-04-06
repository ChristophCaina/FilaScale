# 📋 Entities

[← Zurück zur Firmware-Dokumentation](./README.md)

Übersicht aller Home Assistant Entities die FilaScale bereitstellt.

## 📡 Sensoren

| Entity ID | Name | Einheit | Gruppe | Beschreibung |
|-----------|------|---------|--------|--------------|
| `sensor.filascale_weight` | Weight | g | Waage | Aktuelles Gewicht auf der Waage (tariert) |
| `sensor.filascale_filament_remaining_pct` | Filament Remaining | % | Waage | Restmenge in Prozent (berechnet) |
| `sensor.filascale_active_spool_id` | Active Spool ID | | NFC | Spoolman-ID der aktuell erkannten Spule |
| `sensor.filascale_scale_raw` | Scale Raw | | Diagnose | Rohwert HX711 (für Kalibrierung) |
| `sensor.filascale_wifi_ssid` | Connected SSID | | Diagnose | SSID des verbundenen WLAN-Netzwerks |
| `sensor.filascale_ip_address` | IP Address | | Diagnose | IP-Adresse von FilaScale |
| `sensor.filascale_uptime` | Uptime | | Diagnose | Laufzeit seit letztem Neustart |
| `sensor.filascale_internal_temperature` | Chip-Temperatur | ° C | Diagnose |ESP32 Chip-Temperatur |


## 🔤 Text Sensoren

| Entity ID | Name | Gruppe | Beschreibung |
|-----------|------|--------|--------------|
| `sensor.filascale_nfc_tag_type` | Tag Type | NFC | Erkanntes Tag-Format (siehe unten) |
| `sensor.filascale_filament_brand` | Brand | Filament | Hersteller |
| `sensor.filascale_filament_material` | Material | Filament | Materialtyp (PLA, PETG, ...) |
| `sensor.filascale_filament_color` | Color | Filament | Farbname |
| `sensor.filascale_filament_color_hex` | Color Hex | Diagnose | Farbcode (z.B. `#808080`) |
| `sensor.filascale_filament_article_nr` | Article Nr | Diagnose | Artikelnummer aus Hersteller-Tag |
| `sensor.filascale_nfc_tag_uid` | Tag UID | Diagnose | UID des zuletzt gelesenen Tags |

### Tag Type — Mögliche Werte

| Wert | Beschreibung |
|------|-------------|
| `FilaMan Spool Tag` | Enthält `sm_id` → direkte Spoolman-Verknüpfung |
| `FilaMan Manufacturer Tag` | Enthält `b` + `an` → Hersteller-Tag |
| `FilaMan Manufacturer Tag (linked)` | Hersteller-Tag mit ergänzter `sm_id` |
| `OpenSpool` | Enthält `protocol: openspool` |
| `BambuLab RFID` | MIFARE Classic, proprietäres Format |
| `Unknown` | NDEF vorhanden, Format nicht erkannt |
| `Empty` | Tag erkannt, kein NDEF-Inhalt |
| `` (leer) | Kein Tag auf dem Reader |

> **Hinweis:** Die primäre Verknüpfung zu Spoolman erfolgt immer über die **Tag-UID** (`nfc_uid` Extra-Feld),
> unabhängig vom Tag-Format. `sm_id` auf dem Tag ist optional.

## 🔘 Binary Sensoren

| Entity ID | Name | Gruppe | Beschreibung |
|-----------|------|--------|--------------|
| `binary_sensor.filascale_nfc_tag_present` | Tag Present | NFC | Tag liegt auf dem Reader |
| `binary_sensor.filascale_backend_online` | Backend Online | Diagnose | Spoolman/FilaMan erreichbar |

## 🔲 Buttons

| Entity ID | Name | Gruppe | Beschreibung |
|-----------|------|--------|--------------|
| `button.filascale_tare` | Tare Scale | Waage | Waage mit leerer Plattform nullen |
| `button.filascale_sync` | Sync | Waage | Gewicht manuell zu Spoolman pushen |
| `button.filascale_restart` | Restart Device | Diagnose | FilaScale neu starten |

## 🔢 Numbers

| Entity ID | Name | Min | Max | Step | Gruppe | Beschreibung |
|-----------|------|-----|-----|------|--------|--------------|
| `number.filascale_calibration_factor` | Calibration Factor | 0 | 100000 | 1 | Konfiguration | HX711 Kalibrierfaktor |
| `number.filascale_empty_spool_weight` | Empty Spool Weight | 0 | 500 | 1 | Konfiguration | Leergewicht der Spule in Gramm |
| `number.filascale_total_filament_weight` | Total Filament Weight | 0 | 3000 | 1 | Konfiguration | Gesamtgewicht des Filaments (neu) in Gramm |

## ⌨️ Text (Konfiguration)

| Entity ID | Name | Gruppe | Beschreibung |
|-----------|------|--------|--------------|
| `text.filascale_backend_url` | Backend URL | Konfiguration | URL des Backends (z.B. `http://192.168.1.100:7912`) |

## 🌐 Web Server Gruppierung (v3)

```yaml
web_server:
  version: 3
  sorting_groups:
    - id: group_scale
      name: "Waage"
      sorting_weight: 10
    - id: group_filament
      name: "Filament"
      sorting_weight: 20
    - id: group_nfc
      name: "NFC"
      sorting_weight: 30
    - id: group_config
      name: "Konfiguration"
      sorting_weight: 40
    - id: group_diagnostic
      name: "Diagnose"
      sorting_weight: 99
```

| Gruppe | Entities |
|--------|----------|
| **Waage** | Weight, Filament Remaining, Tare Scale, Sync |
| **Filament** | Brand, Material, Color |
| **NFC** | Tag Present, Tag Type, Active Spool ID |
| **Konfiguration** | Backend URL, Calibration Factor, Empty Spool Weight, Total Filament Weight |
| **Diagnose** | Backend Online, Scale Raw, Color Hex, Article Nr, Tag UID, SSID, IP Address, Uptime, Restart |

## 🔒 Interne Entities (nicht in HA sichtbar)

| ID | Beschreibung |
|----|-------------|
| `scale_tare_offset` | Tara-Offset (gespeichert im Flash) |
| `spoolman_spool_id` | Aktuelle Spool-ID (intern, wird via `active_spool_id` exposed) |
| `nfc_last_tag_uid` | Letzte Tag-UID (intern, wird via `nfc_tag_uid` exposed) |

## 🗓️ Geplant

| Entity | Beschreibung | Version |
|--------|-------------|---------|
| `number.filascale_sync_threshold` | Minimale Gewichtsdifferenz für Abgleich-Prompt (g) | v1.x |
