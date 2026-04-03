# 📡 OpenPrintTag
[← NFC Standards](./README.md)


## 📋 Overview

| Property          | Value                                         |
|-------------------|-----------------------------------------------|
| **NFC Standard**  | ISO 15693 (NFC-V / "Vicinity")                |
| **Chip**          | NXP ICODE SLIX2 (SL2S2602, primary)           |
|                   | NXP ICODE SLIX (Compact mode)                 |
| **Format**        | NDEF MIME Record (CBOR)                       |
| **MIME Type**     | `application/vnd.openprinttag`                |
| **ESP32 Reader**  | PN5180 (PN532 **not** compatible!)            |
| **Smartphone**    | Android & iOS (NFC-V natively supported)      |
| **Open**          | Yes (MIT License)                             |
| **Specification** | https://specs.openprinttag.org                |
| **Project URL**   | https://openprinttag.org                      |

## 🎯 Purpose

OpenPrintTag is Prusa Research's open NFC standard for smart filament spools. It was developed to provide the richest dataset of all formats — including complete printing parameters, material composition, and dynamic consumption data. Prusament spools have been shipped with embedded ICODE SLIX2 tags since **October 2025**.

## ⚠️ Hardware Requirement

> **Critical:** OpenPrintTag uses **ISO 15693**, not ISO 14443A.  
> The widely used **PN532 CANNOT read these tags**.  
> For ESP32-based projects, a **PN5180** is required.

| Reader     | Can Read | Note                             |
|------------|----------|----------------------------------|
| PN532      | ❌        | ISO 14443A only                  |
| RC522      | ❌        | ISO 14443A only                  |
| PN5180     | ✅        | ISO 14443A + ISO 15693           |
| ACR1552U   | ✅        | USB reader for desktop           |
| Smartphone | ✅        | Android & iOS natively           |

## 📄 Tag Format

OpenPrintTag uses **CBOR** (Concise Binary Object Representation) instead of JSON. The format is compact and structured in three sections:

### Meta Section (Offset Information)

Contains byte offsets of the other sections in memory.

### Main Section (Static Material Data)

Written once by the manufacturer.

```
Example fields (CBOR decoded):
{
  "brand":       "Prusament",
  "name":        "PLA Galaxy Grey",
  "material":    "PLA",
  "color":       [{"hex": "808080", "name": "Galaxy Grey"}],
  "diameter":    1.75,
  "weight":      1000,
  "density":     1.24,
  "nozzle_temp": {"min": 210, "max": 230},
  "bed_temp":    {"min": 50,  "max": 60},
  "gtin":        "1234567890123",
  "mfg_date":    "2025-10",
  ...
}
```

### Auxiliary Section (Dynamic Consumption Data)

Updated after each print.

```
{
  "consumed_weight": 125.5,
  "workgroup_id":    "printer-001"
}
```

## 📊 Complete Field List (Main Section, Selection)

| Field              | Type   | Description                               |
|--------------------|--------|-------------------------------------------|
| `brand`            | String | Manufacturer name                         |
| `name`             | String | Product name                              |
| `material`         | String | Material type (PLA, PETG, ABS, ...)       |
| `color`            | Array  | Up to 5 RGB color values with names       |
| `diameter`         | Float  | Filament diameter in mm                   |
| `weight`           | Int    | Net weight in grams                       |
| `density`          | Float  | Material density in g/cm³                 |
| `nozzle_temp.min`  | Int    | Minimum printing temperature °C           |
| `nozzle_temp.max`  | Int    | Maximum printing temperature °C           |
| `bed_temp.min`     | Int    | Minimum bed temperature °C                |
| `bed_temp.max`     | Int    | Maximum bed temperature °C                |
| `chamber_temp`     | Int    | Recommended chamber temperature °C        |
| `gtin`             | String | Global Trade Item Number (barcode ID)     |
| `mfg_date`         | String | Production date (YYYY-MM)                 |
| `exp_date`         | String | Expiration date                           |
| `tags`             | Array  | Material properties (carbon_fiber, etc.)  |

### Material Tags (Property Flags)

Over 68 boolean flags for material properties:

```
carbon_fiber, silk, glow_in_dark, color_changing, matte,
wood_fill, metal_fill, flexible, high_temp, water_soluble,
uv_resistant, food_safe, ...
```

## ⚡ Advantage Over Other Formats

```
Format          | Fields | Offline | Unique | Consumption
----------------|--------|---------|--------|------------
FilaMan sm_id   |   1    |   ❌   |   ✅   |    ❌
FilaMan Mfr.    |   8    |   ✅   |   ❌   |    ❌
OpenSpool       |   7    |   ✅   |   ❌   |    ❌
OpenPrintTag    |  68+   |   ✅   |   ✅   |    ✅
```

## 🔗 Spoolman Integration

Currently there is **no official Spoolman integration** for OpenPrintTag. Data must be mapped manually:

```
CBOR fields → Spoolman API
  brand      → vendor.name
  material   → filament.material
  color[0]   → filament.color_hex
  name       → filament.name
  weight     → spool.initial_weight
  consumed   → spool.used_weight (from Auxiliary)
```

## 🛠️ FilaScale v2 Support

> **FilaScale v1** does **not** support OpenPrintTag (PN532 hardware).  
> **FilaScale v2** plans PN5180 support as a custom ESPHome component.

```
FilaScale v2 (PN5180):
  ✅ OpenPrintTag reading (ISO 15693)
  ✅ CBOR decoding
  ✅ Spoolman mapping
  ❌ OpenPrintTag writing (manufacturer-side, read-only)
```

## ⚠️ Limitations

| Problem | Description |
|---------|-------------|
| **PN5180 required** | No support with widely used PN532 |
| **CBOR instead of JSON** | More complex parsing, no human-readable representation |
| **No Spoolman standard** | No official mapping defined |
| **Read-only for 3rd party** | Main section writable only by the manufacturer |
| **No native ESPHome support** | Custom component for PN5180 required |

## 🔌 Compatibility

| System        | Support                                |
|---------------|----------------------------------------|
| Prusament     | ✅ Native tags from October 2025        |
| SimplyPrint   | ✅                                      |
| Flipper Zero  | ✅ Via FlipperPrintTag app              |
| Spoolman      | ❌ No official support                  |
| FilaMan       | ❌ No ISO 15693 support                 |
| FilaScale v1  | ❌ No PN5180                            |
| FilaScale v2  | 🔲 Planned                             |

---

*Reference: [OpenPrintTag.org](https://openprinttag.org) · [specs.openprinttag.org](https://specs.openprinttag.org) · [Prusa Blog](https://blog.prusa3d.com/the-openprinttag-is-here)*
