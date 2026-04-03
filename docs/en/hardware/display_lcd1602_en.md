# FilaScale — Display Design (LCD1602 16×2)

The display is a **16×2 character LCD** (LCD1602, HD44780-compatible), a widely used
and affordable alternative to the ST7920 Ender display.

This variant provides **reduced output** — only the essential information
fits within 16 characters × 2 lines.

---

## Hardware

| Property | Value |
|----------|-------|
| **Resolution** | 16 characters × 2 lines |
| **Interface** | I2C (via PCF8574 backpack) or 4-bit parallel |
| **ESPHome** | `platform: lcd_pcf8574` (I2C) or `platform: lcd_gpio` |
| **Typical size** | 80×36mm |

---

## Design Principles

- **Maximum 16 characters per line** — no borders, no dividing lines
- **Line 1**: Primary information (what is it?)
- **Line 2**: Secondary information (value / action)
- **No footer**: Navigation is indicated by cursor blinking
- **Scrolling**: Long texts automatically scroll on line 1

---

## Character Budget

```
1234567890123456   ← 16 characters
Prusament PLA      ← 13 characters ✓
243.5g      68%    ← 15 characters ✓
> 1.Tare           ← 8 characters ✓
```

---

## Screen Overview

### Home — no tag

```
No Tag          
0.0g     Ready  
```

### Home — tag detected

```
Prusament PLA   
243.5g    68%   
```

> For long manufacturer names, line 1 scrolls:
> ```
> Recyclingfabrik  →→→  PETG Blue
> ```

### Home — no backend

```
Prusament PLA   
243.5g  No Sync 
```

### Menu

Always 2 entries visible, `>` indicates current position:

```
> 1.Tare        
  2.Spool       
```

```
  2.Spool       
> 3.Sync        
```

```
> 4.Info        
  5.Back        
```

### Tare

```
Tare Scale      
> Confirm?      
```

After tare:
```
Tare Scale      
✓ Done!         
```

### Select Spool

```
> Prusament PLA 
  #5   243g     
```

Scrolling to next entry:
```
> Generic PETG  
  #7   180g     
```

### Write Tag

```
Write Tag       
Prusament #5    
```

While writing:
```
Writing Tag...  
Please wait     
```

Success:
```
Write Tag       
✓ OK!           
```

### Sync

```
Spoolman Sync   
243.5g → #5 ?  
```

After sync:
```
Spoolman Sync   
✓ Sent!         
```

### Weight Reconciliation

```
Reconcile?      
865→868g  +3g   
```

### Info / System

Automatically scrolls through multiple lines:

```
IP:192.168.1.95 
```
```
WiFi: -65 dBm   
```
```
filascale.local 
```
```
v2026.4.0       
```

---

## Comparison with ST7920

| Feature | ST7920 (128×64) | HD44780 (16×2) |
|---------|----------------|----------------|
| Borders & lines | ✅ | ❌ |
| Progress bar | ✅ | ❌ |
| Filament color (hex) | ✅ | ❌ |
| Multi-line menus | ✅ (4 visible) | ⚠️ (2 visible) |
| Article number | ✅ | ❌ (too long) |
| Scrolling text | ❌ | ✅ (automatic) |
| Cost | ~5€ | ~2€ |
| Compatibility | Ender 3 | Universal |

---

## ESPHome Configuration

```yaml
# I2C variant (recommended — only 2 pins)
lcd_pcf8574:
  - id: lcd
    address: 0x27    # or 0x3F
    dimensions: 16x2
    update_interval: 500ms
    lambda: |-
      int page = id(menu_page);
      if (page == 0) {
        // Line 1: Brand + material
        it.print(0, 0, id(filament_brand).state + " " +
                       id(filament_material).state);
        // Line 2: Weight + percentage
        char buf[17];
        snprintf(buf, sizeof(buf), "%.1fg    %.0f%%",
                 id(scale_weight).state,
                 id(filament_remaining_pct).state);
        it.print(0, 1, buf);
      }
      // further pages...
```

---

## Notes

- **I2C backpack** (PCF8574) recommended — saves 6 GPIO pins compared to 4-bit parallel
- **Address**: Usually `0x27` or `0x3F` — check with I2C scanner
- **Brightness**: Adjustable via trimmer on the backpack
- **Special characters**: HD44780 supports `✓` and similar characters only via custom characters
