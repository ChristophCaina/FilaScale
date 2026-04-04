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

**Problem:** Die Artikelnummer identifiziert ein Produkt — nicht eine individuelle Spule.

```
Spoolman enthält:
  Spule #3: Recyclingfabrik PETG Ozeanblau — 200g  ← an: RF-PETG-OB-1000
  Spule #7: Recyclingfabrik PETG Ozeanblau — 980g  ← an: RF-PETG-OB-1000
  Spule #9: Recyclingfabrik PETG Ozeanblau — 1000g ← an: RF-PETG-OB-1000

Tag gescannt → an: "RF-PETG-OB-1000"
  → Welche der drei Spulen ist gemeint? 🤷
```

**FilaScale-Lösung:** Primäre Verknüpfung über die **Hardware-UID** des NFC-Chips:

```
Erster Scan (UID unbekannt):
  1. Metadaten aus Tag lesen (b, t, cn, an...)
  2. Spoolman-Suche nach nfc_uid = "74-10-37-94" → kein Treffer
  3. Suche nach Artikelnummer: an = "RF-PETG-OB-1000" → 3 Treffer
  4. Display zeigt Auswahl nach Restgewicht:
       > Recyclingfabrik PETG 1000g #9
         Recyclingfabrik PETG  980g #7
         Recyclingfabrik PETG  200g #3
  5. User wählt #9
  6. Spoolman: PATCH /spool/9 → extra_field nfc_uid = "74-10-37-94"
  7. Alle Folge-Scans: UID → direkt Spule #9 ✓ (kein Schreiben auf Tag nötig!)
```

> **Vorteil gegenüber sm_id:** Der Tag muss **nie beschrieben** werden.
> Die UID ist unveränderlich und funktioniert mit jedem Tag-Format —
> auch mit Read-only Tags oder Tags die aus anderen Systemen stammen.

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