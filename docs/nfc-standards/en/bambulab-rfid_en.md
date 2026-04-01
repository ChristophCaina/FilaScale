# BambuLab RFID Tag

## Overview

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| **NFC Standard**  | ISO 14443A (NFC Type A)                   |
| **Chip**          | MIFARE Classic 1K (FM11RF08S Clone)       |
| **Format**        | Proprietary / Binary (no NDEF)            |
| **Reader**        | PN532, RC522, PN5180 (reading possible with keys) |
| **Smartphone**    | Android (with specific app) / ❌ iOS      |
| **Open**          | ❌ Proprietary — RSA-2048 signed          |
| **Reverse-Engineering** | Community-documented              |

## Purpose

BambuLab uses proprietary RFID tags in their filament spools to supply the AMS (Automatic Material System) with material information. The tags are **RSA-2048 signed** — custom tags cannot be created.

## ⚠️ Important Limitations

> - **No custom writing possible**: RSA signature requires BambuLab's private key
> - **iOS not compatible**: MIFARE Classic is not supported by iPhones
> - **Proprietary format**: No official documentation available
> - **Reading is possible**: Community has fully reverse-engineered the format

## Tag Format (Binary, Reverse-Engineered)

The tag is divided into **16 sectors**. Each sector has 4 blocks of 16 bytes.

### Key Sectors

| Sector | Content                             |
|--------|-------------------------------------|
| 0      | UID + manufacturer data             |
| 1      | Filament type (ASCII string)        |
| 2      | RGBA color (4 bytes)                |
| 3      | Spool weight, filament diameter     |
| 4      | Temperatures (bed, hotend min/max)  |
| 5      | Drying temperature                  |
| 6      | Production date                     |
| 7      | Filament length                     |
| 8-9    | X-Cam info                          |
| 10-15  | **RSA-2048 digital signature**      |

### Data Format (Byte Level)

```
Sector 1: Filament type
  Bytes 0-15: ASCII string (null-terminated)
  Example: "PLA Matte\0\0\0\0\0\0\0"

Sector 2: Color
  Byte 0: R (Red)
  Byte 1: G (Green)
  Byte 2: B (Blue)
  Byte 3: A (Alpha, usually 0xFF)

Sector 3: Weight + Diameter
  Bytes 0-3:  Spool weight in grams (Little-Endian Float)
  Bytes 4-7:  Filament diameter in mm (Little-Endian Float)

Sector 4: Temperatures
  Bytes 0-1:  Bed temperature min (Little-Endian Int16)
  Bytes 2-3:  Bed temperature max (Little-Endian Int16)
  Bytes 4-5:  Hotend temperature min (Little-Endian Int16)
  Bytes 6-7:  Hotend temperature max (Little-Endian Int16)
```

> All integers are **Little-Endian**.

## Encryption

### CRYPTO1 (Sector Keys)

MIFARE Classic uses CRYPTO1 encryption. The keys for BambuLab tags are:

- **Derivation formula**: Known — keys are calculated from the tag UID
- **Key A / Key B**: Sector-specific, derived from UID
- Community tools (Proxmark3, Flipper Zero) can calculate keys

### RSA-2048 Signature (Sectors 10-15)

```
Sectors 10-15: 96 bytes signature
  → Covers all tag data
  → Private key is held by BambuLab
  → Printer checks signature on spool insertion
  → Invalid signature = tag is ignored
```

**Consequence:** It is **not possible** to create custom BambuLab-compatible tags. Only exact clones (including UID) on "Magic" MIFARE tags work.

## Reading with PN532

Reading is possible when the sector keys are known:

```python
# Pseudo-code
uid = pn532.read_uid()
key = calculate_bambu_key(uid)  # Community algorithm

for sector in range(0, 10):  # Sectors 10-15 = signature
    pn532.authenticate(sector, key)
    data = pn532.read_block(sector * 4)
    # Process data...
```

## Comparison with Other Formats

```
BambuLab    → proprietary, RSA-protected, no writing
OpenSpool   → open, no server, direct Bambu MQTT integration
FilaMan     → open, Spoolman integration
OpenPrintTag→ open, richest data, wrong standard for Bambu
```

## Alternative Approach: MQTT Instead of NFC

Since BambuLab tags cannot be written to, the more practical alternative is **direct MQTT communication** with the printer:

```
FilaScale / OpenSpool reads tag (any format)
  └── Sends filament data via MQTT to BambuLab printer
        topic: device/{serial}/request
        → Printer accepts data without NFC validation
        → AMS slot is set correctly
```

This bypasses NFC signature verification entirely.

## Limitations

| Problem | Description |
|---------|-------------|
| **No custom writing** | RSA signature not reproducible |
| **iOS not compatible** | MIFARE Classic not readable |
| **Proprietary format** | No official documentation |
| **No NDEF** | Standard NFC apps cannot read the tag |
| **Key calculation required** | Increased implementation effort |

## FilaScale Support

| Function | Status |
|----------|--------|
| Tag reading (data extraction) | ✅ v1 (with key calculation) |
| Tag writing | ❌ Not possible |
| MQTT alternative | 🔲 Planned v2 |

## Compatibility

| System        | Support                                     |
|---------------|---------------------------------------------|
| BambuLab AMS  | ✅ Native                                    |
| OpenSpool     | ✅ Reading (via Proxmark/Flipper)            |
| Spoolman      | ❌ No direct support                         |
| FilaMan       | ❌                                           |
| FilaScale v1  | ✅ Reading                                   |
| Proxmark3     | ✅ Full support                              |

---

*Reference: [Bambu Research Group](https://github.com/Bambu-Research-Group/RFID-Tag-Guide) · Community Reverse-Engineering*
