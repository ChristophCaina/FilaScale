# OpenPrintTag

## Übersicht

| Eigenschaft       | Wert                                          |
|-------------------|-----------------------------------------------|
| **NFC-Standard**  | ISO 15693 (NFC-V / "Vicinity")                |
| **Chip**          | NXP ICODE SLIX2 (SL2S2602, primär)           |
|                   | NXP ICODE SLIX (Compact-Modus)                |
| **Format**        | NDEF MIME Record (CBOR)                       |
| **MIME-Type**     | `application/vnd.openprinttag`                |
| **Reader ESP32**  | PN5180 (PN532 **nicht** kompatibel!)          |
| **Smartphone**    | Android & iOS (NFC-V nativ unterstützt)       |
| **Offen**         | Ja (MIT Lizenz)                               |
| **Spezifikation** | https://specs.openprinttag.org                |
| **Projekt-URL**   | https://openprinttag.org                      |

## Zweck

OpenPrintTag ist Prusa Researchs offener NFC-Standard für Smart-Filamentspulen. Er wurde entwickelt um den reichhaltigsten Datensatz aller Formate bereitzustellen — inklusive vollständiger Druckparameter, Materialzusammensetzung und dynamischer Verbrauchsdaten. Prusament-Spulen werden seit **Oktober 2025** mit eingebetteten ICODE SLIX2-Tags geliefert.

## ⚠️ Hardware-Anforderung

> **Kritisch:** OpenPrintTag verwendet **ISO 15693**, nicht ISO 14443A.  
> Der weit verbreitete **PN532 kann diese Tags NICHT lesen**.  
> Für ESP32-basierte Projekte ist ein **PN5180** erforderlich.

| Reader  | Kann lesen | Hinweis                          |
|---------|------------|----------------------------------|
| PN532   | ❌          | Nur ISO 14443A                   |
| RC522   | ❌          | Nur ISO 14443A                   |
| PN5180  | ✅          | ISO 14443A + ISO 15693           |
| ACR1552U| ✅          | USB-Lesegerät für Desktop        |
| Smartphone | ✅       | Android & iOS nativ              |

## Tag-Format

OpenPrintTag verwendet **CBOR** (Concise Binary Object Representation) statt JSON. Das Format ist kompakt und strukturiert in drei Sektionen:

### Meta-Sektion (Offset-Informationen)

Enthält Byte-Offsets der anderen Sektionen im Speicher.

### Main-Sektion (Statische Materialdaten)

Wird einmalig vom Hersteller geschrieben.

```
Beispielfelder (CBOR-dekodiert):
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

### Auxiliary-Sektion (Dynamische Verbrauchsdaten)

Wird nach jedem Druck aktualisiert.

```
{
  "consumed_weight": 125.5,
  "workgroup_id":    "printer-001"
}
```

## Vollständige Feldliste (Main-Sektion, Auswahl)

| Feld               | Typ    | Beschreibung                              |
|--------------------|--------|-------------------------------------------|
| `brand`            | String | Herstellername                            |
| `name`             | String | Produktname                               |
| `material`         | String | Materialtyp (PLA, PETG, ABS, ...)         |
| `color`            | Array  | Bis zu 5 RGB-Farbwerte mit Namen          |
| `diameter`         | Float  | Filamentdurchmesser in mm                 |
| `weight`           | Int    | Nettogewicht in Gramm                     |
| `density`          | Float  | Materialdichte in g/cm³                   |
| `nozzle_temp.min`  | Int    | Minimale Drucktemperatur °C               |
| `nozzle_temp.max`  | Int    | Maximale Drucktemperatur °C               |
| `bed_temp.min`     | Int    | Minimale Betttemperatur °C                |
| `bed_temp.max`     | Int    | Maximale Betttemperatur °C                |
| `chamber_temp`     | Int    | Empfohlene Kammertemperatur °C            |
| `gtin`             | String | Global Trade Item Number (Barcode-ID)     |
| `mfg_date`         | String | Produktionsdatum (YYYY-MM)                |
| `exp_date`         | String | Mindesthaltbarkeitsdatum                  |
| `tags`             | Array  | Materialeigenschaften (carbon_fiber, etc.)|

### Material-Tags (Eigenschaftsflags)

Über 68 boolesche Flags für Materialeigenschaften:

```
carbon_fiber, silk, glow_in_dark, color_changing, matte,
wood_fill, metal_fill, flexible, high_temp, water_soluble,
uv_resistant, food_safe, ...
```

## Vorteil gegenüber anderen Formaten

```
Format          | Felder | Offline | Eindeutig | Verbrauch
----------------|--------|---------|-----------|----------
FilaMan sm_id   |   1    |   ❌   |    ✅    |    ❌
FilaMan Mfr.    |   8    |   ✅   |    ❌    |    ❌
OpenSpool       |   7    |   ✅   |    ❌    |    ❌
OpenPrintTag    |  68+   |   ✅   |    ✅    |    ✅
```

## Spoolman-Integration

Aktuell gibt es **keine offizielle Spoolman-Integration** für OpenPrintTag. Die Daten müssen manuell gemappt werden:

```
CBOR-Felder → Spoolman-API
  brand      → vendor.name
  material   → filament.material
  color[0]   → filament.color_hex
  name       → filament.name
  weight     → spool.initial_weight
  consumed   → spool.used_weight (aus Auxiliary)
```

## 🛠️ FilaScale v2 Support

> **FilaScale v1** unterstützt OpenPrintTag **nicht** (PN532-Hardware).  
> **FilaScale v2** plant PN5180-Support als Custom ESPHome Component.

```
FilaScale v2 (PN5180):
  ✅ OpenPrintTag lesen (ISO 15693)
  ✅ CBOR dekodieren
  ✅ Spoolman-Mapping
  ❌ OpenPrintTag schreiben (Hersteller-seitig, read-only)
```

## Limitierungen

| Problem | Beschreibung |
|---------|-------------|
| **PN5180 erforderlich** | Kein Support mit weit verbreitetem PN532 |
| **CBOR statt JSON** | Komplexeres Parsing, keine menschenlesbare Darstellung |
| **Kein Spoolman-Standard** | Kein offizielles Mapping definiert |
| **Read-only für 3rd Party** | Main-Sektion nur vom Hersteller beschreibbar |
| **ESPHome kein nativer Support** | Custom Component für PN5180 notwendig |

## Kompatibilität

| System        | Unterstützung                          |
|---------------|----------------------------------------|
| Prusament     | ✅ Native Tags ab Oktober 2025          |
| SimplyPrint   | ✅                                      |
| Flipper Zero  | ✅ Via FlipperPrintTag App              |
| Spoolman      | ❌ Kein offizieller Support             |
| FilaMan       | ❌ Kein ISO 15693 Support               |
| FilaScale v1  | ❌ Kein PN5180                          |
| FilaScale v2  | 🔲 Geplant                             |

---

*Referenz: [OpenPrintTag.org](https://openprinttag.org) · [specs.openprinttag.org](https://specs.openprinttag.org) · [Prusa Blog](https://blog.prusa3d.com/the-openprinttag-is-here)*
