# 📡 NFC Tag Standards — Dokumentation

[← Zurück zur Dokumentation](../../de/README.md)

Dieser Ordner enthält die Dokumentation der verschiedenen NFC-Tag-Formate die im 3D-Druck-Ökosystem eingesetzt werden.

## 📋 Übersicht

| Standard | Datei | NFC | Chip | Offen |
|----------|-------|-----|------|-------|
| [FilaMan Spool Tag](./filaman-spool-tag_de.md) | `filaman-spool-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [FilaMan Hersteller-Tag](./filaman-manufacturer-tag_de.md) | `filaman-manufacturer-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [OpenSpool](./openspool_de.md) | `openspool.md` | ISO 14443A | NTAG215 | ✅ |
| [OpenPrintTag](./openprinttag_de.md) | `openprinttag.md` | ISO 15693 | ICODE SLIX2 | ✅ |
| [BambuLab RFID](./bambulab-rfid_de.md) | `bambulab-rfid.md` | ISO 14443A | MIFARE Classic | ❌ |

## 🔧 Hardware-Kompatibilität

| Reader  | ISO 14443A | ISO 15693 | ESPHome |
|---------|-----------|-----------|---------|
| PN532   | ✅         | ❌         | ✅ Nativ |
| PN5180  | ✅         | ✅         | 🔲 Custom Component |
| RC522   | ✅         | ❌         | ✅ |

## 🛠️ FilaScale Unterstützung

| Standard | v1 Lesen | v1 Schreiben | v2 Lesen | v2 Schreiben |
|----------|----------|--------------|----------|--------------|
| FilaMan Spool Tag | ✅ | ✅ | ✅ | ✅ |
| FilaMan Hersteller-Tag | ✅ | ✅ | ✅ | ✅ |
| OpenSpool | ✅ | ✅ | ✅ | ✅ |
| OpenPrintTag | ❌ | ❌ | ✅ | ❌ |
| BambuLab RFID | ✅ Lesen | ❌ | ✅ Lesen | ❌ |

# NFC Tag Standards — Dokumentation

Dieser Ordner enthält die Dokumentation der verschiedenen NFC-Tag-Formate
die im 3D-Druck-Ökosystem eingesetzt werden.

---

## Spulen-Identifikation via Tag-UID

FilaScale nutzt die **Hardware-UID des NFC-Chips** als primären Schlüssel zur
Verknüpfung einer physischen Spule mit einem Spoolman-Datensatz.

Die UID ist:
- **Unveränderlich** — vom Hersteller eingebrannt, nicht überschreibbar
- **Eindeutig** — weltweit unique pro Chip
- **Immer lesbar** — unabhängig vom Tag-Inhalt oder -Format
- **Format-agnostisch** — funktioniert mit leerem Tag, OpenSpool, FilaMan, BambuLab, ...

### Warum nicht sm_id auf den Tag schreiben?

| | sm_id auf Tag | UID-basiert |
|---|---|---|
| Tag beschreiben nötig | ✅ Ja | ❌ Nein |
| Read-only Tags | ❌ Nicht möglich | ✅ Funktioniert |
| Format-kompatibel | ❌ Eigenes Format | ✅ Alle Formate |
| Hersteller-Tags | ❌ Überschreiben | ✅ Unverändert |
| Refill-Spulen | ❌ Neu beschreiben | ✅ Neu zuordnen |

### Spoolman Extra-Feld einrichten

Einmalige Konfiguration in Spoolman:

```
Admin → Extra Fields → Spool → Add Field
  Key:            nfc_uid
  Display Label:  NFC Tag UID
  Type:           Text
```

FilaScale speichert die UID nach der ersten Zuordnung automatisch in diesem Feld.

### Erkennungs-Flow

```
Tag aufgelegt
  └── UID lesen: "74-10-37-94"
        └── GET /api/v1/spool?extra_field[nfc_uid]=74-10-37-94
              │
              ├── Gefunden → Spule #5
              │     └── Gewicht sync, Filament-Daten anzeigen ✅
              │
              └── Nicht gefunden → Neue Zuordnung nötig
                    │
                    ├── Hat Tag NDEF-Inhalt?
                    │     ├── FilaMan Manufacturer Tag → Spoolman-Suche nach Artikelnummer
                    │     ├── OpenSpool → Spoolman-Suche nach Brand+Material+Farbe
                    │     └── Leer / Unbekannt → Spoolman-Liste im Display
                    │
                    └── User wählt Spule im Display
                          └── PATCH /api/v1/spool/{id}
                                extra_fields: {"nfc_uid": "74-10-37-94"}
```

### Erster Scan — Zuordnung im Display

Unbekannte UID → vollständige Spoolman-Liste:

```
┌────────────────────┐
│ Spule wählen       │
├────────────────────┤
│ > Prusament PLA    │
│   1000g      #5    │
│   Generic PETG     │
│    980g      #7    │
├────────────────────┤
│ ↕ Scroll  ● OK     │
└────────────────────┘
```

Hersteller-Tag erkannt → vorgefilterte Liste:

```
┌────────────────────┐
│ Spule wählen       │
├────────────────────┤
│ Recyclingfabrik    │
│ PETG Ozeanblau     │
│ > 1000g      #9    │
│    980g      #7    │
├────────────────────┤
│ ↕ Scroll  ● OK     │
└────────────────────┘
```

### Refill-Spulen

```
Spule mit UID "74-10-37-94" war Prusament PLA #5 — jetzt leer, neu befüllt mit PETG

Nächster Scan:
  └── UID → findet Spule #5 (fast leer)
        └── Display: "Spule neu zuordnen?"
              └── User wählt neue Spule #12
                    └── PATCH /spool/12: nfc_uid = "74-10-37-94"
                    └── PATCH /spool/5:  nfc_uid = ""
```

### Kompatibilität mit FilaMan

FilaMan nutzt dasselbe Prinzip mit dem `nfc_id` Extra-Feld:

| System | Extra-Feld | Wert |
|--------|-----------|------|
| FilaMan | `nfc_id` | Artikelnummer (`an`) oder UID |
| FilaScale | `nfc_uid` | Hardware-UID des Chips |

> **Empfehlung:** Beide Extra-Felder in Spoolman anlegen —
> dann funktionieren FilaMan und FilaScale parallel mit derselben Datenbank.

### UID Format

```
NTAG215:        7 Byte  →  "74-10-37-94-AB-CD-EF"
MIFARE Classic: 4 Byte  →  "74-10-37-94"
ICODE SLIX2:    8 Byte  →  "E0-04-01-74-10-37-94-AB"
```

ESPHome liefert die UID direkt im `on_tag` Trigger:

```yaml
pn532_i2c:
  on_tag:
    then:
      - lambda: |-
          std::string uid = x;  // "74-10-37-94"
```

---

## Tag-Formate Übersicht

| Standard | Datei | NFC | Chip | Offen |
|----------|-------|-----|------|-------|
| [FilaMan Spool Tag](./filaman-spool-tag.md) | `filaman-spool-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [FilaMan Hersteller-Tag](./filaman-manufacturer-tag.md) | `filaman-manufacturer-tag.md` | ISO 14443A | NTAG21x | ✅ |
| [OpenSpool](./openspool.md) | `openspool.md` | ISO 14443A | NTAG215 | ✅ |
| [OpenPrintTag](./openprinttag.md) | `openprinttag.md` | ISO 15693 | ICODE SLIX2 | ✅ |
| [BambuLab RFID](./bambulab-rfid.md) | `bambulab-rfid.md` | ISO 14443A | MIFARE Classic | ❌ |

---

## Hardware-Kompatibilität

| Reader | ISO 14443A | ISO 15693 | ESPHome |
|--------|-----------|-----------|---------|
| PN532  | ✅ | ❌ | ✅ Nativ |
| PN5180 | ✅ | ✅ | 🔲 Custom Component |
| RC522  | ✅ | ❌ | ✅ |

---

## FilaScale Unterstützung

| Standard | v1 Lesen | v1 Schreiben | v2 Lesen | v2 Schreiben |
|----------|----------|--------------|----------|--------------|
| FilaMan Spool Tag | ✅ | Optional | ✅ | Optional |
| FilaMan Hersteller-Tag | ✅ | Optional | ✅ | Optional |
| OpenSpool | ✅ | Optional | ✅ | Optional |
| OpenPrintTag | ❌ | ❌ | ✅ | ❌ |
| BambuLab RFID | ✅ Lesen | ❌ | ✅ Lesen | ❌ |

> **Hinweis:** "Optional" bedeutet: Tag-Schreiben ist möglich aber nicht erforderlich —
> die Verknüpfung erfolgt primär über die Tag-UID.