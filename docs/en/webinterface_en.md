# 📊 Web Interface

FilaScale features a built-in web interface accessible directly via any browser on the local network — no app, no Home Assistant required.
The interface is based on the **ESPHome Web Server v3** and automatically supports light and dark mode based on system settings.

---

## Accessing the Interface

Open a browser and navigate to:

```
http://filascale.local
```

Or directly via IP address:

```
http://192.168.x.x
```

> ℹ️ mDNS (`filascale.local`) requires a compatible operating system. Windows 10+, macOS, and Linux with Avahi support this by default.

---

## Interface Overview

### Light Mode

![Web Interface — Light Mode](https://christophcaina.github.io/filament_scale/images/webinterface-light.png)
*Web interface in light mode with sensor and control area*

### Dark Mode

![Web Interface — Dark Mode](https://christophcaina.github.io/filament_scale/images/webinterface-dark.png)
*Web interface in dark mode with sensor and control area*

---

## Sensors and Controls

![Sensor and Control Section](https://christophcaina.github.io/filament_scale/images/webinterface-sensors.png)

| Entity | Type | Description |
| :--- | :--- | :--- |
| **Filament Remaining** | Sensor | Remaining filament in % |
| **Filament Weight** | Sensor | Current weight in grams |
| **Material** | Sensor | Filament material |
| **Color** | Sensor | Filament color name from the manufacturer |
| **Brand** | Sensor | Filament manufacturer |

---

## Configuration

![Configuration Section](https://christophcaina.github.io/filament_scale/images/webinterface-config.png)

| Entity | Type | Description |
| :--- | :--- | :--- |
| **Calibration Factor** | Number (Slider) | Scale calibration factor — see [Calibration Guide](calibration.md) |
| **Empty Spool Weight** | Number (Slider) | Empty spool weight in grams |
| **Total Filament Weight** | Number (Slider) | Total filament weight for a full spool in grams |
| **Backend IP** | Text | IP address and port for Spoolman, FilaMan*, FilaBridge |
| **Tare Scale** | Button | Zero the scale with empty platform |
| **Firmware Update** | Update | Shows firmware status and triggers OTA update |

> ℹ️ All configuration values are stored directly on the device and survive restarts. No reflashing required.

---

## Diagnostics

| Entity | Type | Description |
| :--- | :--- | :--- |
| **Scale Raw** | Sensor | Raw HX711 value — used for calibration |
| **Color-Hex** | Sensor | Manufacturer color code |
| **Tag-Type** | Sensor | Type of the scanned tag |
| **Backend Online** | Binary Sensor | Indicates whether a backend is reachable |
| **NFC-Tag-ID** | Sensor | Unique ID of the NFC tag |
| **Connected SSID** | Sensor | SSID of the Wi-Fi network FilaScale is connected to |
| **DNS Address** | Sensor | DNS address of the network |
| **IP Address** | Sensor | IP address of FilaScale |
| **Internal Temperature** | Sensor | ESP chip temperature |
| **Uptime** | Sensor | Uptime of FilaScale |
| **Restart Device** | Button | Restarts FilaScale |
| **Shutdown Device** | Button | Shuts down FilaScale |

---

## OTA Update

The web interface offers a manual OTA update option at the bottom of the page. A local `.bin` file can be selected and flashed directly — without Home Assistant or ESPHome Dashboard.

---

## Features

- ✅ No app or Home Assistant required
- ✅ Light and dark mode (follows system setting)
- ✅ Sliders for number entities (calibration factor, spool weights)
- ✅ Sensor history graphs (click on a sensor to expand)
- ✅ Manual OTA update via file upload
- ✅ Live debug log
