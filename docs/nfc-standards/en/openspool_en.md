# OpenSpool

## Overview

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| **NFC Standard**  | ISO 14443A (NFC Type 2)                   |
| **Chip**          | NTAG215 (recommended) / NTAG216           |
| **Format**        | NDEF MIME Record (application/json)       |
| **Reader**        | PN532, RC522, PN5180                      |
| **Smartphone**    | Android & iOS                             |
| **Open**          | Yes (OSHWA certified: US002704)           |
| **Project URL**   | https://openspool.io / github.com/spuder/OpenSpool |

## Purpose

OpenSpool is an open standard for NFC tags on filament spools, primarily developed for **direct integration with BambuLab printers via MQTT**. The tag contains all relevant filament data directly — no server required for reading.

## Tag Format

```json
{
  "protocol": "openspool",
  "version":  "1.0",
  "type":     "PLA",
  "color_hex":"FFAABB",
  "brand":    "Generic",
  "min_temp": "220",
  "max_temp": "240"
}
```

> **Note:** Temperatures are stored as **strings**, not as integers.

## Fields

| Field       | Type   | Required | Description                                       |
|-------------|--------|----------|---------------------------------------------------|
| `protocol`  | String | Yes      | Always `"openspool"` — for format detection       |
| `version`   | String | Yes      | Format version, currently `"1.0"`                 |
| `type`      | String | Yes      | Material type (PLA, PETG, ABS, TPU, ASA, ...)     |
| `color_hex` | String | Yes      | Color as 6-digit HEX code (without #)             |
| `brand`     | String | No       | Manufacturer name                                 |
| `min_temp`  | String | No       | Minimum printing temperature in °C (as string)    |
| `max_temp`  | String | No       | Maximum printing temperature in °C (as string)    |

### Optional Extension Fields

| Field                    | Type   | Description                              |
|--------------------------|--------|------------------------------------------|
| `bed_min_temp`           | String | Minimum bed temperature in °C            |
| `bed_max_temp`           | String | Maximum bed temperature in °C            |
| `subtype`                | String | Subtype (e.g. "Matte", "Silk", "CF")     |
| `additional_color_hexes` | Array  | Additional colors for multicolor filaments |

## Detection

A tag is recognized as an OpenSpool tag when:
- Field `protocol` is present and equals `"openspool"`

```
Has JSON payload?
  └── Has "protocol" == "openspool"?
        └── → OpenSpool Tag ✓
```

## NDEF Record Structure

OpenSpool uses a **MIME type NDEF record** instead of a text record:

```
NDEF Message
  └── Record
        ├── TNF: 0x02 (MIME Media)
        ├── Type: "application/json"
        └── Payload: {"protocol":"openspool","version":"1.0",...}
```

> **Important:** The MIME type `application/json` distinguishes OpenSpool from FilaMan,  
> which uses a text record (`TNF: 0x01`, type `"T"`).

## Writing Tags

OpenSpool tags are primarily written **manually via a smartphone app**. There is no official desktop or ESP32-based writing app.

Workflow:
1. Open an NFC app on a smartphone (e.g. NFC Tools)
2. Create a MIME record with `application/json`
3. Type in the JSON payload
4. Write the tag

**Limitation:** No automatic link to Spoolman — data must be entered manually.

## Refill Spool Problem

OpenSpool has **no unique identifier per spool**. With refill spools (reusable spool bodies with new filament), the tag must be manually rewritten with each refill.

```
Refill scenario:
  Tag written with: type=PLA, color=Red, brand=Generic
  Spool is emptied and refilled with PETG Blue
  Tag still shows: type=PLA, color=Red ← WRONG!
  → Tag must be manually rewritten
```

## BambuLab Integration

The primary target application of OpenSpool is direct MQTT communication with BambuLab printers:

```
OpenSpool reads tag
  └── Sends via MQTT to Bambu printer:
        topic: device/{serial}/request
        payload: {
          "filament_type": "PLA",
          "color": "FFAABB",
          ...
        }
```

Supported models: X1C, X1, P1P, P1S, A1, A1 Mini

## Spoolman Integration

OpenSpool has **no native Spoolman integration**. Matching is only possible via fuzzy matching:

```
Read tag: brand=Prusament, type=PLA, color_hex=808080
  └── Search Spoolman:
        GET /api/v1/spool?filament.vendor.name=Prusament
                         &filament.material=PLA
                         &filament.color_hex=808080
              ├── Exactly 1 match → assign
              ├── Multiple matches → user selection required
              └── No match → unknown spool
```

## ⚠️ Limitations

| Problem | Description |
|---------|-------------|
| **No unique identifier** | No spool ID, no Spoolman reference |
| **Manual writing** | No automated workflow |
| **Refill problem** | Tag must be rewritten on refill |
| **No Spoolman reference** | Matching only via product data |
| **Temperatures as string** | Unusual format, increases parsing effort |

## Compatibility

| System      | Support                              |
|-------------|--------------------------------------|
| BambuLab    | ✅ Native (via MQTT)                  |
| Spoolman    | ❌ No direct support                  |
| FilaMan     | ❌                                    |
| FilaScale   | ✅ Reading + matching via Spoolman    |
| OpenSpoolMan| ✅ Unofficial via Spoolman            |

---

*Reference: [OpenSpool GitHub](https://github.com/spuder/OpenSpool) · [openspool.io](https://openspool.io)*
