# FilaMan Hersteller-Tag (Manufacturer Tag)

## Übersicht

| Eigenschaft       | Wert                              |
|-------------------|-----------------------------------|
| **NFC-Standard**  | ISO 14443A (NFC Type 2)           |
| **Chip**          | NTAG213 / NTAG215 / NTAG216       |
| **Format**        | NDEF Text Record (JSON)           |
| **Reader**        | PN532, RC522, PN5180              |
| **Smartphone**    | Android & iOS                     |
| **Offen**         | Ja (MIT Lizenz)                   |

## Zweck

Der FilaMan Hersteller-Tag ist für **vorbestückte Spulen von Filamentherstellern** gedacht. Er enthält alle relevanten Produktdaten direkt auf dem Tag, sodass FilaMan (oder kompatible Systeme) automatisch Hersteller, Filament und Spule in Spoolman anlegen können — ohne manuelle Eingabe.

**Erster kommerzieller Anwender:** [Recyclingfabrik](https://www.recyclingfabrik.com) — wird in Kürze Spulen mit diesem Tag-Format liefern.

## Tag-Format

```json
{
  "b":  "Recyclingfabrik",
  "t":  "PETG",
  "cn": "Ozeanblau",
  "c":  "#1A6BC4",
  "an": "RF-PETG-OB-1000",
  "sw": 188,
  "et": 230,
  "bt": 70
}
```

## Felder

| Feld  | Name              | Typ    | Pflicht | Beschreibung                              |
|-------|-------------------|--------|---------|-------------------------------------------|
| `b`   | Brand             | String | Ja      | Herstellername                            |
| `t`   | Type              | String | Ja      | Materialtyp (PLA, PETG, ABS, TPU, ...)    |
| `cn`  | Color Name        | String | Nein    | Farbbezeichnung (z.B. "Galaxy Grey")      |
| `c`   | Color Hex         | String | Nein    | Farbe als HEX-Code (z.B. "#808080")       |
| `an`  | Article Number    | String | Ja      | Artikelnummer des Herstellers             |
| `sw`  | Spool Weight      | Int    | Nein    | Leergewicht der Spule in Gramm            |
| `et`  | Extruder Temp     | Int    | Nein    | Empfohlene Drucktemperatur in °C          |
| `bt`  | Bed Temp          | Int    | Nein    | Empfohlene Betttemperatur in °C           |

> **Hinweis:** Es können weitere Felder vorhanden sein — unbekannte Felder sollten ignoriert werden.

## Erkennung

Ein Tag wird als FilaMan Hersteller-Tag erkannt wenn:
- Feld `b` (Brand) **und** `an` (Article Number) vorhanden sind
- **kein** `sm_id` Feld vorhanden ist (sonst: FilaMan Spool Tag)
- **kein** `protocol: openspool` Feld vorhanden ist (sonst: OpenSpool)

```
Hat JSON-Payload?
  └── Hat "b" UND "an"?
        └── Hat KEIN "sm_id"?
              └── → FilaMan Hersteller-Tag ✓
```

## Verknüpfung mit Spoolman

FilaMan nutzt die **Artikelnummer (`an`)** als Verknüpfungsschlüssel zu Spoolman. Dafür muss in Spoolman ein Extra-Feld `nfc_id` für Spulen konfiguriert sein.

```
Tag gelesen: an = "RF-PETG-OB-1000"
  └── GET /api/v1/spool?extra_field[nfc_id]=RF-PETG-OB-1000
        ├── Gefunden → Spule zuordnen
        └── Nicht gefunden:
              ├── POST /api/v1/vendor   (Hersteller anlegen, falls neu)
              ├── POST /api/v1/filament (Filament anlegen, falls neu)
              └── POST /api/v1/spool   (Spule anlegen)
                    └── nfc_id = "RF-PETG-OB-1000" setzen
```

## ⚠️ Bekannte Limitierung: Mehrere gleiche Spulen

**Problem:** Die Artikelnummer ist kein eindeutiger Identifier für eine einzelne Spule — sie identifiziert nur das Produkt.

```
Spoolman enthält:
  Spule #3: Recyclingfabrik PETG Ozeanblau — 200g remaining  ← an: RF-PETG-OB-1000
  Spule #7: Recyclingfabrik PETG Ozeanblau — 980g remaining  ← an: RF-PETG-OB-1000
  Spule #9: Recyclingfabrik PETG Ozeanblau — 1000g remaining ← an: RF-PETG-OB-1000

Tag gescannt → an: "RF-PETG-OB-1000"
  → Welche der drei Spulen ist gemeint? 🤷
```

**FilaScale-Lösung:** Beim ersten Scan einer neuen Spule wird `sm_id` ergänzt:

```
Erster Scan (kein sm_id):
  1. Spoolman-Suche nach nfc_id = "RF-PETG-OB-1000"
  2. Mehrere Treffer? → Display zeigt Auswahl nach Restgewicht
  3. User wählt korrekte Spule
  4. Tag wird neu beschrieben: {"b":"Recyclingfabrik",...,"sm_id":9}
  5. Alle Folge-Scans: direkter Treffer via sm_id ✓
```

## NDEF Record Struktur

```
NDEF Message
  └── Record
        ├── TNF: 0x01 (Well Known)
        ├── Type: "T" (Text)
        ├── Language: "en"
        └── Payload: {"b":"Recyclingfabrik","t":"PETG",...}
```

## Beispiel (ESPHome Lesen)

```yaml
on_tag:
  then:
    - lambda: |-
        auto payload = /* NDEF payload */;
        bool has_brand = payload.find("\"b\"") != std::string::npos;
        bool has_artnr = payload.find("\"an\"") != std::string::npos;
        bool has_sm_id = payload.find("\"sm_id\"") != std::string::npos;

        if (has_brand && has_artnr && !has_sm_id) {
          // FilaMan Hersteller-Tag ohne sm_id
          // → Spoolman-Suche + ggf. sm_id ergänzen
        } else if (has_brand && has_artnr && has_sm_id) {
          // FilaMan Hersteller-Tag mit sm_id (bereits verknüpft)
          // → Direktzugriff via sm_id
        }
```

## Kompatibilität

| System      | Unterstützung                        |
|-------------|--------------------------------------|
| FilaMan     | ✅ Nativ (Auto-Import in Spoolman)    |
| FilaScale   | ✅ Lesen + sm_id ergänzen             |
| Spoolman    | ✅ Via Extra-Feld `nfc_id`            |
| OpenSpool   | ❌                                    |
| nfc2klipper | ✅ Via Extra-Feld `nfc_id`            |

---

*Referenz: [FilaMan GitHub Releases](https://github.com/ManuelW77/Filaman/releases) — ab Version 1.5.x*
