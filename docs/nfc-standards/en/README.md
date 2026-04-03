# NFC Tag Standards — Documentation

This folder contains documentation of the various NFC tag formats used in the 3D printing ecosystem.

## Overview

| Standard | File | NFC | Chip | Open |
|----------|------|-----|------|------|
| [FilaMan Spool Tag](./filaman-spool-tag_en.md) | `filaman-spool-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [FilaMan Manufacturer Tag](./filaman-manufacturer-tag_en.md) | `filaman-manufacturer-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [OpenSpool](./openspool_en.md) | `openspool.md` | ISO 14443A | NTAG215 | ✅ |
| [OpenPrintTag](./openprinttag_en.md) | `openprinttag.md` | ISO 15693 | ICODE SLIX2 | ✅ |
| [BambuLab RFID](./bambulab-rfid_en.md) | `bambulab-rfid.md` | ISO 14443A | MIFARE Classic | ❌ |

## Hardware Compatibility

| Reader  | ISO 14443A | ISO 15693 | ESPHome |
|---------|-----------|-----------|---------|
| PN532   | ✅         | ❌         | ✅ Native |
| PN5180  | ✅         | ✅         | 🔲 Custom Component |
| RC522   | ✅         | ❌         | ✅ |

## FilaScale Support

| Standard | v1 Read | v1 Write | v2 Read | v2 Write |
|----------|---------|----------|---------|----------|
| FilaMan Spool Tag | ✅ | ✅ | ✅ | ✅ |
| FilaMan Manufacturer Tag | ✅ | ✅ | ✅ | ✅ |
| OpenSpool | ✅ | ✅ | ✅ | ✅ |
| OpenPrintTag | ❌ | ❌ | ✅ | ❌ |
| BambuLab RFID | ✅ Read | ❌ | ✅ Read | ❌ |
