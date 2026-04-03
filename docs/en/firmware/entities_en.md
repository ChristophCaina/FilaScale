# 📋 Entities

[← Back to Firmware Documentation](./README.md)

Overview of all Home Assistant entities provided by FilaScale.

## 📡 Sensors

| Entity ID | Name | Unit | Group | Description |
|-----------|------|------|-------|-------------|
| `sensor.filascale_weight` | Weight | g | Scale | Current weight on the scale (tared) |
| `sensor.filascale_filament_remaining_pct` | Filament Remaining | % | Scale | Remaining amount in percent (calculated) |
| `sensor.filascale_active_spool_id` | Active Spool ID | | NFC | Spoolman ID of the currently detected spool |
| `sensor.filascale_scale_raw` | Scale Raw | | Diagnostics | Raw HX711 value (for calibration) |
| `sensor.filascale_wifi_ssid` | Connected SSID | | Diagnostics | SSID of the connected Wi-Fi network |
| `sensor.filascale_ip_address` | IP Address | | Diagnostics | IP address of FilaScale |
| `sensor.filascale_uptime` | Uptime | | Diagnostics | Runtime since last reboot |
| `sensor.filascale_internal_temperature` | Chip Temperature | °C | Diagnostics | ESP32 chip temperature |


## 🔤 Text Sensors

| Entity ID | Name | Group | Description |
|-----------|------|-------|-------------|
| `sensor.filascale_nfc_tag_type` | Tag Type | NFC | Detected tag format (see below) |
| `sensor.filascale_filament_brand` | Brand | Filament | Manufacturer |
| `sensor.filascale_filament_material` | Material | Filament | Material type (PLA, PETG, ...) |
| `sensor.filascale_filament_color` | Color | Filament | Color name |
| `sensor.filascale_filament_color_hex` | Color Hex | Diagnostics | Color code (e.g. `#808080`) |
| `sensor.filascale_filament_article_nr` | Article Nr | Diagnostics | Article number from manufacturer tag |
| `sensor.filascale_nfc_tag_uid` | Tag UID | Diagnostics | UID of the last read tag |

### Tag Type — Possible Values

| Value | Description |
|-------|-------------|
| `FilaMan Spool Tag` | Contains `sm_id` → direct Spoolman link |
| `FilaMan Manufacturer Tag` | Contains `b` + `an`, no `sm_id` → manufacturer tag |
| `FilaMan Manufacturer Tag (linked)` | Manufacturer tag with added `sm_id` |
| `OpenSpool` | Contains `protocol: openspool` |
| `BambuLab RFID` | MIFARE Classic, proprietary format |
| `Unknown` | NDEF present, format not recognized |
| `Empty` | Tag detected, no NDEF content |
| `` (empty) | No tag on the reader |

## 🔘 Binary Sensors

| Entity ID | Name | Group | Description |
|-----------|------|-------|-------------|
| `binary_sensor.filascale_nfc_tag_present` | Tag Present | NFC | Tag is placed on the reader |
| `binary_sensor.filascale_backend_online` | Backend Online | Diagnostics | Spoolman/FilaMan reachable |

## 🔲 Buttons

| Entity ID | Name | Group | Description |
|-----------|------|-------|-------------|
| `button.filascale_tare` | Tare Scale | Scale | Zero the scale with empty platform |
| `button.filascale_sync` | Sync | Scale | Manually push weight to Spoolman |
| `button.filascale_restart` | Restart Device | Diagnostics | Restart FilaScale |

## 🔢 Numbers

| Entity ID | Name | Min | Max | Step | Group | Description |
|-----------|------|-----|-----|------|-------|-------------|
| `number.filascale_calibration_factor` | Calibration Factor | 0 | 100000 | 1 | Configuration | HX711 calibration factor |
| `number.filascale_empty_spool_weight` | Empty Spool Weight | 0 | 500 | 1 | Configuration | Empty spool weight in grams |
| `number.filascale_total_filament_weight` | Total Filament Weight | 0 | 3000 | 1 | Configuration | Total filament weight (new) in grams |

## ⌨️ Text (Configuration)

| Entity ID | Name | Group | Description |
|-----------|------|-------|-------------|
| `text.filascale_backend_url` | Backend URL | Configuration | URL of the backend (e.g. `http://192.168.1.100:7912`) |

## 🌐 Web Server Grouping (v3)

```yaml
web_server:
  version: 3
  sorting_groups:
    - id: group_scale
      name: "Scale"
      sorting_weight: 10
    - id: group_filament
      name: "Filament"
      sorting_weight: 20
    - id: group_nfc
      name: "NFC"
      sorting_weight: 30
    - id: group_config
      name: "Configuration"
      sorting_weight: 40
    - id: group_diagnostic
      name: "Diagnostics"
      sorting_weight: 99
```

| Group | Entities |
|-------|----------|
| **Scale** | Weight, Filament Remaining, Tare Scale, Sync |
| **Filament** | Brand, Material, Color |
| **NFC** | Tag Present, Tag Type, Active Spool ID |
| **Configuration** | Backend URL, Calibration Factor, Empty Spool Weight, Total Filament Weight |
| **Diagnostics** | Backend Online, Scale Raw, Color Hex, Article Nr, Tag UID, SSID, IP Address, Uptime, Restart |

## 🔒 Internal Entities (not visible in HA)

| ID | Description |
|----|-------------|
| `scale_tare_offset` | Tare offset (stored in flash) |
| `spoolman_spool_id` | Current spool ID (internal, exposed via `active_spool_id`) |
| `nfc_last_tag_uid` | Last tag UID (internal, exposed via `nfc_tag_uid`) |

## 🗓️ Planned

| Entity | Description | Version |
|--------|-------------|---------|
| `number.filascale_sync_threshold` | Minimum weight difference for sync prompt (g) | v1.x |
