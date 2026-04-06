# 🏷️ FilaMan Spool Tag
[← NFC Standards](./README.md)


## 📋 Overview

| Property          | Value                             |
|-------------------|-----------------------------------|
| **NFC Standard**  | ISO 14443A (NFC Type 2)           |
| **Chip**          | NTAG213 / NTAG215 / NTAG216       |
| **Format**        | NDEF Text Record (JSON)           |
| **Reader**        | PN532, RC522, PN5180              |
| **Smartphone**    | Android & iOS                     |
| **Open**          | Yes (MIT License)                 |

## 🎯 Purpose

The FilaMan Spool Tag is a simple **pointer to a Spoolman spool**. It contains no filament data directly, but exclusively the internal ID of the spool in Spoolman. The actual data (manufacturer, material, color, remaining weight) is retrieved at runtime from the Spoolman API.

## 📄 Tag Format

```json
{
  "sm_id": "42"
}
```

> **Note:** `sm_id` can be present as a string `"42"` or as an integer `42`.  
> Both variants occur in practice and must be handled when reading.

## 📊 Fields

| Field    | Type            | Required | Description                              |
|----------|-----------------|----------|------------------------------------------|
| `sm_id`  | String or Int   | Yes      | Spoolman spool ID (internal database ID) |

## ✨ Special Characteristics

- **Minimal storage requirement**: The tag contains only the essentials — ideal for NTAG213 (144 bytes usable)
- **Server-dependent**: Without a reachable Spoolman/FilaMan backend, offline use is not possible
- **Not self-describing**: An external device without Spoolman access cannot interpret the tag
- **Unique**: Since `sm_id` is a database ID, each spool is uniquely identifiable

## 🗂️ NDEF Record Structure

```
NDEF Message
  └── Record
        ├── TNF: 0x01 (Well Known)
        ├── Type: "T" (Text)
        ├── Language: "en"
        └── Payload: {"sm_id":"42"}
```

## 💻 Example (ESPHome Reading)

```yaml
on_tag:
  then:
    - lambda: |-
        auto records = tag.get_ndef_message()->get_records();
        for (auto &record : records) {
          std::string payload = record->get_payload();
          // Fast-path: sm_id as string
          auto pos = payload.find("\"sm_id\":\"");
          if (pos != std::string::npos) {
            auto start = pos + 9;
            auto end = payload.find("\"", start);
            int sm_id = atoi(payload.substr(start, end - start).c_str());
          }
          // Alternative: sm_id as integer
          auto pos2 = payload.find("\"sm_id\":");
          if (pos2 != std::string::npos) {
            int sm_id = atoi(payload.c_str() + pos2 + 8);
          }
        }
```

## 💻 Example (ESPHome Writing)

```yaml
- nfc.mifare_ultralight.write_ndef_message:
    id: nfc_reader
    ndef_message:
      - id: "1"
        type: "T"
        payload: "{\"sm_id\":\"42\"}"
```

## 🔗 Linking with Spoolman

```
Tag read: sm_id = 42
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

## ⚠️ Limitations

| Problem | Description |
|---------|-------------|
| **Server-dependent** | No data access without backend |
| **No offline readability** | The tag alone reveals nothing about the filament |
| **No manufacturer info** | Must be retrieved separately from Spoolman |

## 🔌 Compatibility

| System      | Support        |
|-------------|----------------|
| FilaMan     | ✅ Native       |
| Spoolman    | ✅ Via API      |
| OpenSpool   | ❌              |
| FilaScale   | ✅ Primary format |
| nfc2klipper | ✅              |

---

*Reference: [FilaMan GitHub](https://github.com/Fire-Devils/filaman-system)*
