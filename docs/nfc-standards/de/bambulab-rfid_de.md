# 📡 BambuLab RFID Tag
[← NFC Standards](./README.md)


## 📋 Übersicht

| Eigenschaft       | Wert                                      |
|-------------------|-------------------------------------------|
| **NFC-Standard**  | ISO 14443A (NFC Type A)                   |
| **Chip**          | MIFARE Classic 1K (FM11RF08S Clone)       |
| **Format**        | Proprietär / Binär (kein NDEF)            |
| **Reader**        | PN532, RC522, PN5180 (Lesen mit Schlüsseln möglich) |
| **Smartphone**    | Android (mit spez. App) / ❌ iOS          |
| **Offen**         | ❌ Proprietär — RSA-2048 signiert         |
| **Reverse-Engineering** | Community-dokumentiert              |

## 🎯 Zweck

BambuLab verwendet proprietäre RFID-Tags in ihren Filamentspulen, um das AMS (Automatic Material System) mit Materialinformationen zu versorgen. Die Tags sind **RSA-2048 signiert** — eigene Tags können nicht erstellt werden.

## ⚠️ Wichtige Einschränkungen

> - **Kein eigenes Schreiben möglich**: RSA-Signatur erfordert BambuLabs privaten Schlüssel
> - **iOS nicht kompatibel**: MIFARE Classic wird von iPhones nicht unterstützt
> - **Proprietäres Format**: Keine offizielle Dokumentation vorhanden
> - **Lesen ist möglich**: Community hat Format vollständig reverse-engineered

## 🔍 Tag-Format (Binär, Reverse-Engineered)

Der Tag ist in **16 Sektoren** aufgeteilt. Jeder Sektor hat 4 Blöcke à 16 Bytes.

### Wichtige Sektoren

| Sektor | Inhalt                              |
|--------|-------------------------------------|
| 0      | UID + Herstellerdaten               |
| 1      | Filamenttyp (ASCII String)          |
| 2      | RGBA-Farbe (4 Bytes)                |
| 3      | Spulengewicht, Filamentdurchmesser  |
| 4      | Temperaturen (Bed, Hotend min/max)  |
| 5      | Trockungstemperatur                 |
| 6      | Produktionsdatum                    |
| 7      | Filamentlänge                       |
| 8-9    | X-Cam Info                          |
| 10-15  | **RSA-2048 Digitalsignatur**        |

### Datenformat (Byte-Ebene)

```
Sektor 1: Filamenttyp
  Bytes 0-15: ASCII-String (null-terminiert)
  Beispiel: "PLA Matte\0\0\0\0\0\0\0"

Sektor 2: Farbe
  Byte 0: R (Red)
  Byte 1: G (Green)
  Byte 2: B (Blue)
  Byte 3: A (Alpha, meist 0xFF)

Sektor 3: Gewicht + Durchmesser
  Bytes 0-3:  Spulengewicht in Gramm (Little-Endian Float)
  Bytes 4-7:  Filamentdurchmesser in mm (Little-Endian Float)

Sektor 4: Temperaturen
  Bytes 0-1:  Betttemperatur min (Little-Endian Int16)
  Bytes 2-3:  Betttemperatur max (Little-Endian Int16)
  Bytes 4-5:  Hotend-Temperatur min (Little-Endian Int16)
  Bytes 6-7:  Hotend-Temperatur max (Little-Endian Int16)
```

> Alle Ganzzahlen sind **Little-Endian**.

## 🔐 Verschlüsselung

### CRYPTO1 (Sektor-Schlüssel)

MIFARE Classic verwendet CRYPTO1-Verschlüsselung. Die Schlüssel für BambuLab-Tags sind:

- **Ableitungsformel**: Bekannt — Schlüssel werden aus der Tag-UID berechnet
- **Key A / Key B**: Sektorspezifisch, aus UID abgeleitet
- Community-Tools (Proxmark3, Flipper Zero) können Keys berechnen

### RSA-2048 Signatur (Sektoren 10-15)

```
Sektoren 10-15: 96 Bytes Signatur
  → Deckt alle Tag-Daten ab
  → Privater Schlüssel liegt bei BambuLab
  → Drucker prüft Signatur beim Einlegen
  → Ungültige Signatur = Tag wird ignoriert
```

**Konsequenz:** Es ist **nicht möglich** eigene BambuLab-kompatible Tags zu erstellen. Nur exakte Klone (inklusive UID) auf "Magic" MIFARE-Tags funktionieren.

## 💻 Lesen mit PN532

Das Lesen ist möglich wenn die Sektor-Schlüssel bekannt sind:

```python
# Pseudo-Code
uid = pn532.read_uid()
key = calculate_bambu_key(uid)  # Community-Algorithmus

for sector in range(0, 10):  # Sektoren 10-15 = Signatur
    pn532.authenticate(sector, key)
    data = pn532.read_block(sector * 4)
    # Daten verarbeiten...
```

## ⚖️ Vergleich mit anderen Formaten

```
BambuLab    → proprietär, RSA-geschützt, kein Schreiben
OpenSpool   → offen, kein Server, direkte Bambu-MQTT-Integration
FilaMan     → offen, Spoolman-Integration
OpenPrintTag→ offen, reichhaltigste Daten, falscher Standard für Bambu
```

## 📶 Alternativer Ansatz: MQTT statt NFC

Da BambuLab-Tags nicht selbst beschrieben werden können, ist die sinnvollere Alternative die **direkte MQTT-Kommunikation** mit dem Drucker:

```
FilaScale / OpenSpool liest Tag (beliebiges Format)
  └── Sendet Filamentdaten via MQTT an BambuLab-Drucker
        topic: device/{serial}/request
        → Drucker akzeptiert Daten ohne NFC-Validierung
        → AMS-Slot wird korrekt gesetzt
```

Dies umgeht die NFC-Signaturprüfung vollständig.

## ⚠️ Limitierungen

| Problem | Beschreibung |
|---------|-------------|
| **Kein eigenes Schreiben** | RSA-Signatur nicht reproduzierbar |
| **iOS nicht kompatibel** | MIFARE Classic nicht lesbar |
| **Proprietäres Format** | Keine offizielle Dokumentation |
| **Kein NDEF** | Standard-NFC-Apps können Tag nicht lesen |
| **Key-Berechnung nötig** | Erhöhter Implementierungsaufwand |

## 🛠️ FilaScale Support

| Funktion | Status |
|----------|--------|
| Tag lesen (Daten extrahieren) | ✅ v1 (mit Key-Berechnung) |
| Tag schreiben | ❌ Nicht möglich |
| MQTT-Alternative | 🔲 Geplant v2 |

## 🔌 Kompatibilität

| System        | Unterstützung                               |
|---------------|---------------------------------------------|
| BambuLab AMS  | ✅ Nativ                                     |
| OpenSpool     | ✅ Lesen (via Proxmark/Flipper)              |
| Spoolman      | ❌ Kein direkter Support                     |
| FilaMan       | ❌                                           |
| FilaScale v1  | ✅ Lesen                                     |
| Proxmark3     | ✅ Vollständig                               |

---

*Referenz: [Bambu Research Group](https://github.com/Bambu-Research-Group/RFID-Tag-Guide) · Community Reverse-Engineering*
