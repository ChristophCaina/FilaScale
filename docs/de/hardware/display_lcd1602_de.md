# 🖥️ Display Design (LCD1602 16×2)

[← Zurück zur Hardware-Dokumentation](./README.md)

Das Display ist ein **16×2 Zeichen LCD** (LCD1602 (HD44780-kompatibel), eine weit verbreitete
und günstige Alternative zum ST7920 Ender-Display.

Diese Variante bietet **reduzierte Darstellung** — nur die wesentlichen Informationen
passen auf 16 Zeichen × 2 Zeilen.

---

## 🔩 Hardware

| Eigenschaft | Wert |
|-------------|------|
| **Auflösung** | 16 Zeichen × 2 Zeilen |
| **Interface** | I2C (via PCF8574 Backpack) oder 4-bit parallel |
| **ESPHome** | `platform: lcd_pcf8574` (I2C) oder `platform: lcd_gpio` |
| **Typische Größe** | 80×36mm |

---

## 🎨 Design-Prinzipien

- **Maximal 16 Zeichen pro Zeile** — kein Rahmen, keine Trennlinien
- **Zeile 1**: Primäre Information (was ist es?)
- **Zeile 2**: Sekundäre Information (Wert / Aktion)
- **Kein Footer**: Navigation wird durch Cursor-Blinken signalisiert
- **Scrollen**: Bei langen Texten scrollt Zeile 1 automatisch

---

## 📐 Zeichen-Budget

```
1234567890123456   ← 16 Zeichen
Prusament PLA      ← 13 Zeichen ✓
243.5g      68%    ← 15 Zeichen ✓
> 1.Tarieren       ← 12 Zeichen ✓
```

---

## 🗂️ Screen-Übersicht

### Home — kein Tag

```
Kein Tag        
0.0g    Bereit  
```

### Home — Tag erkannt

```
Prusament PLA   
243.5g    68%   
```

> Bei langem Herstellernamen scrollt Zeile 1:
> ```
> Recyclingfabrik  →→→  PETG Blau
> ```

### Home — kein Backend

```
Prusament PLA   
243.5g  No Sync 
```

### Menü

Immer 2 Einträge sichtbar, `>` zeigt aktuelle Position:

```
> 1.Tarieren    
  2.Spule       
```

```
  2.Spule       
> 3.Sync        
```

```
> 4.Info        
  5.Zurück      
```

### Tarieren

```
Tarieren        
> Bestätigen?   
```

Nach Tare:
```
Tarieren        
✓ Erledigt!     
```

### Spule wählen

```
> Prusament PLA 
  #5   243g     
```

Scrollen zum nächsten Eintrag:
```
> Generic PETG  
  #7   180g     
```

### Tag schreiben

```
Tag schreiben   
Prusament #5    
```

Während des Schreibens:
```
Schreibe Tag... 
Bitte warten    
```

Erfolg:
```
Tag schreiben   
✓ OK!           
```

### Sync

```
Spoolman Sync   
243.5g → #5 ?  
```

Nach Sync:
```
Spoolman Sync   
✓ Gesendet!     
```

### Gewichts-Abgleich

```
Abgleichen?     
865→868g  +3g   
```

### Info / System

Scrollt automatisch durch mehrere Zeilen:

```
IP:192.168.1.95 
```
```
WLAN: -65 dBm   
```
```
filascale.local 
```
```
v2026.4.0       
```

---

## ⚖️ Vergleich mit ST7920

| Feature | ST7920 (128×64) | HD44780 (16×2) |
|---------|----------------|----------------|
| Rahmen & Linien | ✅ | ❌ |
| Fortschrittsbalken | ✅ | ❌ |
| Filamentfarbe (Hex) | ✅ | ❌ |
| Mehrzeilige Menüs | ✅ (4 sichtbar) | ⚠️ (2 sichtbar) |
| Artikelnummer | ✅ | ❌ (zu lang) |
| Scrollender Text | ❌ | ✅ (automatisch) |
| Kosten | ~5€ | ~2€ |
| Kompatibilität | Ender 3 | Universal |

---

## ⚙️ ESPHome Konfiguration

```yaml
# I2C Variante (empfohlen — nur 2 Pins)
lcd_pcf8574:
  - id: lcd
    address: 0x27    # oder 0x3F
    dimensions: 16x2
    update_interval: 500ms
    lambda: |-
      int page = id(menu_page);
      if (page == 0) {
        // Zeile 1: Hersteller + Material
        it.print(0, 0, id(filament_brand).state + " " +
                       id(filament_material).state);
        // Zeile 2: Gewicht + Prozent
        char buf[17];
        snprintf(buf, sizeof(buf), "%.1fg    %.0f%%",
                 id(scale_weight).state,
                 id(filament_remaining_pct).state);
        it.print(0, 1, buf);
      }
      // weitere Pages...
```

---

## 💡 Hinweise

- **I2C Backpack** (PCF8574) empfohlen — spart 6 GPIO-Pins gegenüber 4-bit parallel
- **Adresse**: Meist `0x27` oder `0x3F` — per I2C-Scanner prüfen
- **Helligkeit**: Über Trimmer auf dem Backpack einstellbar
- **Sonderzeichen**: HD44780 unterstützt `✓` und ähnliche Zeichen nur mit Custom Characters
