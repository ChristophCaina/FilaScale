# FilaMan Spool Tag

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

Der FilaMan Spool Tag ist ein einfacher **Zeiger auf eine Spoolman-Spule**. Er enthält keine Filamentdaten direkt, sondern ausschließlich die interne ID der Spule in Spoolman. Die eigentlichen Daten (Hersteller, Material, Farbe, Restgewicht) werden zur Laufzeit aus der Spoolman-API abgerufen.

## Tag-Format

```json
{
  "sm_id": "42"
}
```

> **Hinweis:** `sm_id` kann als String `"42"` oder als Integer `42` vorliegen.  
> Beide Varianten kommen in der Praxis vor und müssen beim Lesen berücksichtigt werden.

## Felder

| Feld     | Typ             | Pflicht | Beschreibung                          |
|----------|-----------------|---------|---------------------------------------|
| `sm_id`  | String oder Int | Ja      | Spoolman Spool-ID (interne Datenbank-ID) |

## Besonderheiten

- **Minimaler Speicherbedarf**: Der Tag enthält nur das Nötigste — ideal für NTAG213 (144 Bytes nutzbar)
- **Server-abhängig**: Ohne erreichbares Spoolman/FilaMan-Backend keine Offline-Nutzung möglich
- **Nicht selbstbeschreibend**: Ein fremdes Gerät ohne Spoolman-Zugang kann den Tag nicht interpretieren
- **Eindeutig**: Da `sm_id` eine Datenbankid ist, ist jede Spule eindeutig identifizierbar

## NDEF Record Struktur

```
NDEF Message
  └── Record
        ├── TNF: 0x01 (Well Known)
        ├── Type: "T" (Text)
        ├── Language: "en"
        └── Payload: {"sm_id":"42"}
```

## Beispiel (ESPHome Lesen)

```yaml
on_tag:
  then:
    - lambda: |-
        auto records = tag.get_ndef_message()->get_records();
        for (auto &record : records) {
          std::string payload = record->get_payload();
          // Fast-Path: sm_id als String
          auto pos = payload.find("\"sm_id\":\"");
          if (pos != std::string::npos) {
            auto start = pos + 9;
            auto end = payload.find("\"", start);
            int sm_id = atoi(payload.substr(start, end - start).c_str());
          }
          // Alternativ: sm_id als Integer
          auto pos2 = payload.find("\"sm_id\":");
          if (pos2 != std::string::npos) {
            int sm_id = atoi(payload.c_str() + pos2 + 8);
          }
        }
```

## Beispiel (ESPHome Schreiben)

```yaml
- nfc.mifare_ultralight.write_ndef_message:
    id: nfc_reader
    ndef_message:
      - id: "1"
        type: "T"
        payload: "{\"sm_id\":\"42\"}"
```

## Verknüpfung mit Spoolman

```
Tag gelesen: sm_id = 42
  └── GET http://{spoolman}/api/v1/spool/42
        └── Response: {
              "id": 42,
              "remaining_weight": 243.5,
              "filament": {
                "name": "Galaxy Grey",
                "material": "PLA",
                "vendor": { "name": "Prusament" },
                "color_hex": "808080"
              }
            }
```

## Limitierungen

| Problem | Beschreibung |
|---------|-------------|
| **Server-abhängig** | Ohne Backend keine Dateneinsicht |
| **Keine Offline-Lesbarkeit** | Tag allein verrät nichts über das Filament |
| **Keine Hersteller-Infos** | Muss separat aus Spoolman abgerufen werden |

## Kompatibilität

| System      | Unterstützung |
|-------------|---------------|
| FilaMan     | ✅ Nativ       |
| Spoolman    | ✅ Via API     |
| OpenSpool   | ❌             |
| FilaScale   | ✅ Primärformat|
| nfc2klipper | ✅             |

---

*Referenz: [FilaMan GitHub](https://github.com/Fire-Devils/filaman-system)*
