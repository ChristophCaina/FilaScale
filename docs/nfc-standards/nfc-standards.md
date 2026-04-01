# NFC Tag Standards — Dokumentation

Dieser Ordner enthält die Dokumentation der verschiedenen NFC-Tag-Formate die im 3D-Druck-Ökosystem eingesetzt werden.

## Übersicht

| Standard | Datei | NFC | Chip | Offen |
|----------|-------|-----|------|-------|
| [FilaMan Spool Tag](./filaman-spool-tag_de.md) | `filaman-spool-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [FilaMan Hersteller-Tag](./filaman-manufacturer-tag_de.md) | `filaman-manufacturer-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [OpenSpool](./openspool_de.md) | `openspool.md` | ISO 14443A | NTAG215 | ✅ |
| [OpenPrintTag](./openprinttag_de.md) | `openprinttag.md` | ISO 15693 | ICODE SLIX2 | ✅ |
| [BambuLab RFID](./bambulab-rfid_de.md) | `bambulab-rfid.md` | ISO 14443A | MIFARE Classic | ❌ |

## Hardware-Kompatibilität

| Reader  | ISO 14443A | ISO 15693 | ESPHome |
|---------|-----------|-----------|---------|
| PN532   | ✅         | ❌         | ✅ Nativ |
| PN5180  | ✅         | ✅         | 🔲 Custom Component |
| RC522   | ✅         | ❌         | ✅ |

## FilaScale Unterstützung

| Standard | v1 Lesen | v1 Schreiben | v2 Lesen | v2 Schreiben |
|----------|----------|--------------|----------|--------------|
| FilaMan Spool Tag | ✅ | ✅ | ✅ | ✅ |
| FilaMan Hersteller-Tag | ✅ | ✅ | ✅ | ✅ |
| OpenSpool | ✅ | ✅ | ✅ | ✅ |
| OpenPrintTag | ❌ | ❌ | ✅ | ❌ |
| BambuLab RFID | ✅ Lesen | ❌ | ✅ Lesen | ❌ |
