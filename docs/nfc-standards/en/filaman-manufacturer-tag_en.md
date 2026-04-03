# 🏷️ FilaMan Manufacturer Tag
[← NFC Standards](./README.md)


## 📋 Overview

| Property          | Value                             |
|-------------------|-----------------------------------|
| **NFC Standard**  | ISO 14443A (NFC Type 2)           |
| **Chip**          | NTAG213 / NTAG215 / NTAG216       |
| **Format**        | NDEF Text Record (JSON)           |
| **Reader**        | PN532, RC522, PN5180              |
| **Smartphone**    | Android & iOS                     |
| **Open**          | Yes (MIT License)                 |

## 🎯 Purpose

The FilaMan Manufacturer Tag is intended for **pre-loaded spools from filament manufacturers**. It contains all relevant product data directly on the tag, allowing FilaMan (or compatible systems) to automatically create the manufacturer, filament, and spool in Spoolman — without manual input.

**First commercial adopter:** [Recyclingfabrik](https://www.recyclingfabrik.com) — will soon ship spools with this tag format.

## 📄 Tag Format

```json
{
  "b":  "Recyclingfabrik",
  "t":  "PETG",
  "cn": "Ocean Blue",
  "c":  "#1A6BC4",
  "an": "RF-PETG-OB-1000",
  "sw": 188,
  "et": 230,
  "bt": 70
}
```

## 📊 Fields

| Field | Name           | Type   | Required | Description                               |
|-------|----------------|--------|----------|-------------------------------------------|
| `b`   | Brand          | String | Yes      | Manufacturer name                         |
| `t`   | Type           | String | Yes      | Material type (PLA, PETG, ABS, TPU, ...) |
| `cn`  | Color Name     | String | No       | Color designation (e.g. "Galaxy Grey")    |
| `c`   | Color Hex      | String | No       | Color as HEX code (e.g. "#808080")        |
| `an`  | Article Number | String | Yes      | Manufacturer's article number             |
| `sw`  | Spool Weight   | Int    | No       | Empty spool weight in grams               |
| `et`  | Extruder Temp  | Int    | No       | Recommended printing temperature in °C   |
| `bt`  | Bed Temp       | Int    | No       | Recommended bed temperature in °C        |

> **Note:** Additional fields may be present — unknown fields should be ignored.

## 🔍 Detection

A tag is recognized as a FilaMan Manufacturer Tag when:
- Field `b` (Brand) **and** `an` (Article Number) are present
- **No** `sm_id` field is present (otherwise: FilaMan Spool Tag)
- **No** `protocol: openspool` field is present (otherwise: OpenSpool)

```
Has JSON payload?
  └── Has "b" AND "an"?
        └── Has NO "sm_id"?
              └── → FilaMan Manufacturer Tag ✓
```

## 🔗 Linking with Spoolman

FilaMan uses the **article number (`an`)** as the linking key to Spoolman. For this, an extra field `nfc_id` must be configured in Spoolman for spools.

```
Tag read: an = "RF-PETG-OB-1000"
  └── GET /api/v1/spool?extra_field[nfc_id]=RF-PETG-OB-1000
        ├── Found → assign spool
        └── Not found:
              ├── POST /api/v1/vendor   (create manufacturer if new)
              ├── POST /api/v1/filament (create filament if new)
              └── POST /api/v1/spool   (create spool)
                    └── nfc_id = "RF-PETG-OB-1000" set
```

## ⚠️ Known Limitation: Multiple Identical Spools

**Problem:** The article number is not a unique identifier for an individual spool — it only identifies the product.

```
Spoolman contains:
  Spool #3: Recyclingfabrik PETG Ocean Blue — 200g remaining  ← an: RF-PETG-OB-1000
  Spool #7: Recyclingfabrik PETG Ocean Blue — 980g remaining  ← an: RF-PETG-OB-1000
  Spool #9: Recyclingfabrik PETG Ocean Blue — 1000g remaining ← an: RF-PETG-OB-1000

Tag scanned → an: "RF-PETG-OB-1000"
  → Which of the three spools is meant? 🤷
```

**FilaScale solution:** On the first scan of a new spool, `sm_id` is added:

```
First scan (no sm_id):
  1. Spoolman search by nfc_id = "RF-PETG-OB-1000"
  2. Multiple matches? → Display shows selection by remaining weight
  3. User selects correct spool
  4. Tag is rewritten: {"b":"Recyclingfabrik",...,"sm_id":9}
  5. All subsequent scans: direct match via sm_id ✓
```

## 🗂️ NDEF Record Structure

```
NDEF Message
  └── Record
        ├── TNF: 0x01 (Well Known)
        ├── Type: "T" (Text)
        ├── Language: "en"
        └── Payload: {"b":"Recyclingfabrik","t":"PETG",...}
```

## 💻 Example (ESPHome Reading)

```yaml
on_tag:
  then:
    - lambda: |-
        auto payload = /* NDEF payload */;
        bool has_brand = payload.find("\"b\"") != std::string::npos;
        bool has_artnr = payload.find("\"an\"") != std::string::npos;
        bool has_sm_id = payload.find("\"sm_id\"") != std::string::npos;

        if (has_brand && has_artnr && !has_sm_id) {
          // FilaMan Manufacturer Tag without sm_id
          // → Spoolman search + optionally add sm_id
        } else if (has_brand && has_artnr && has_sm_id) {
          // FilaMan Manufacturer Tag with sm_id (already linked)
          // → Direct access via sm_id
        }
```

## 🔌 Compatibility

| System      | Support                              |
|-------------|--------------------------------------|
| FilaMan     | ✅ Native (auto-import into Spoolman) |
| FilaScale   | ✅ Reading + adding sm_id             |
| Spoolman    | ✅ Via extra field `nfc_id`           |
| OpenSpool   | ❌                                    |
| nfc2klipper | ✅ Via extra field `nfc_id`           |

---

*Reference: [FilaMan GitHub Releases](https://github.com/ManuelW77/Filaman/releases) — from version 1.5.x*
