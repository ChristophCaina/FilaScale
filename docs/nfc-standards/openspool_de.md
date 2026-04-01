# OpenSpool

## Übersicht

| Eigenschaft       | Wert                                      |
|-------------------|-------------------------------------------|
| **NFC-Standard**  | ISO 14443A (NFC Type 2)                   |
| **Chip**          | NTAG215 (empfohlen) / NTAG216             |
| **Format**        | NDEF MIME Record (application/json)       |
| **Reader**        | PN532, RC522, PN5180                      |
| **Smartphone**    | Android & iOS                             |
| **Offen**         | Ja (OSHWA-zertifiziert: US002704)         |
| **Projekt-URL**   | https://openspool.io / github.com/spuder/OpenSpool |

## Zweck

OpenSpool ist ein offener Standard für NFC-Tags an Filamentspulen, primär entwickelt für die **direkte Integration mit BambuLab-Druckern via MQTT**. Der Tag enthält alle relevanten Filamentdaten direkt — kein Server notwendig zum Lesen.

## Tag-Format

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

> **Hinweis:** Temperaturen werden als **Strings** gespeichert, nicht als Integer.

## Felder

| Feld        | Typ    | Pflicht | Beschreibung                                      |
|-------------|--------|---------|---------------------------------------------------|
| `protocol`  | String | Ja      | Immer `"openspool"` — zur Formaterkennung         |
| `version`   | String | Ja      | Formatversion, aktuell `"1.0"`                    |
| `type`      | String | Ja      | Materialtyp (PLA, PETG, ABS, TPU, ASA, ...)       |
| `color_hex` | String | Ja      | Farbe als 6-stelliger HEX-Code (ohne #)           |
| `brand`     | String | Nein    | Herstellername                                    |
| `min_temp`  | String | Nein    | Minimale Drucktemperatur in °C (als String)        |
| `max_temp`  | String | Nein    | Maximale Drucktemperatur in °C (als String)        |

### Optionale Erweiterungsfelder

| Feld                   | Typ    | Beschreibung                              |
|------------------------|--------|-------------------------------------------|
| `bed_min_temp`         | String | Minimale Betttemperatur in °C             |
| `bed_max_temp`         | String | Maximale Betttemperatur in °C             |
| `subtype`              | String | Untertyp (z.B. "Matte", "Silk", "CF")     |
| `additional_color_hexes` | Array | Weitere Farben für Multicolor-Filamente  |

## Erkennung

Ein Tag wird als OpenSpool-Tag erkannt wenn:
- Feld `protocol` vorhanden und gleich `"openspool"`

```
Hat JSON-Payload?
  └── Hat "protocol" == "openspool"?
        └── → OpenSpool Tag ✓
```

## NDEF Record Struktur

OpenSpool verwendet einen **MIME-Type NDEF Record** statt eines Text Records:

```
NDEF Message
  └── Record
        ├── TNF: 0x02 (MIME Media)
        ├── Type: "application/json"
        └── Payload: {"protocol":"openspool","version":"1.0",...}
```

> **Wichtig:** Der MIME-Type `application/json` unterscheidet OpenSpool von FilaMan,  
> das einen Text Record (`TNF: 0x01`, Type `"T"`) verwendet.

## Tag-Beschriften

OpenSpool-Tags werden primär **manuell per Smartphone-App** beschrieben. Es gibt keine offizielle Desktop- oder ESP32-basierte Schreib-App.

Workflow:
1. NFC-App auf Smartphone öffnen (z.B. NFC Tools)
2. MIME-Record mit `application/json` erstellen
3. JSON-Payload eintippen
4. Tag beschreiben

**Limitierung:** Kein automatischer Bezug zu Spoolman — Daten müssen manuell eingegeben werden.

## Refill-Spulen Problem

OpenSpool hat **keinen eindeutigen Identifier** pro Spule. Bei Refill-Spulen (wiederverwendbare Spulenkörper mit neuem Filament) muss der Tag bei jeder Neubefüllung manuell neu beschrieben werden.

```
Refill-Szenario:
  Tag beschrieben mit: type=PLA, color=Red, brand=Generic
  Spule wird geleert und neu befüllt mit PETG Blau
  Tag zeigt immer noch: type=PLA, color=Red ← FALSCH!
  → Tag muss manuell neu beschrieben werden
```

## BambuLab Integration

Die primäre Zielanwendung von OpenSpool ist die direkte MQTT-Kommunikation mit BambuLab-Druckern:

```
OpenSpool liest Tag
  └── Sendet via MQTT an Bambu-Drucker:
        topic: device/{serial}/request
        payload: {
          "filament_type": "PLA",
          "color": "FFAABB",
          ...
        }
```

Unterstützte Modelle: X1C, X1, P1P, P1S, A1, A1 Mini

## Spoolman-Integration

OpenSpool hat **keine native Spoolman-Integration**. Ein Matching ist nur über Fuzzy-Matching möglich:

```
Tag lesen: brand=Prusament, type=PLA, color_hex=808080
  └── Spoolman suchen:
        GET /api/v1/spool?filament.vendor.name=Prusament
                         &filament.material=PLA
                         &filament.color_hex=808080
              ├── Genau 1 Treffer → zuordnen
              ├── Mehrere Treffer → Benutzerauswahl nötig
              └── Kein Treffer → unbekannte Spule
```

## ⚠️ Limitierungen

| Problem | Beschreibung |
|---------|-------------|
| **Kein eindeutiger Identifier** | Keine Spulen-ID, kein Spoolman-Bezug |
| **Manuelles Beschreiben** | Kein automatischer Workflow |
| **Refill-Problem** | Tag muss bei Neubefüllung neu beschrieben werden |
| **Kein Spoolman-Bezug** | Matching nur über Produktdaten möglich |
| **Temperatures als String** | Ungewöhnliches Format, erhöht Parsing-Aufwand |

## Kompatibilität

| System      | Unterstützung                        |
|-------------|--------------------------------------|
| BambuLab    | ✅ Nativ (via MQTT)                   |
| Spoolman    | ❌ Kein direkter Support              |
| FilaMan     | ❌                                    |
| FilaScale   | ✅ Lesen + Matching via Spoolman      |
| OpenSpoolMan| ✅ Inoffiziell via Spoolman           |

---

*Referenz: [OpenSpool GitHub](https://github.com/spuder/OpenSpool) · [openspool.io](https://openspool.io)*
