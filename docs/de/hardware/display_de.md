# 🖥️ Display Varianten

[← Zurück zur Hardware-Dokumentation](./README.md)

FilaScale unterstützt zwei Display-Varianten. Die Variante wird über eine
Substitution in der Konfiguration gewählt.

## 📋 Verfügbare Varianten

| Variante | Display | Auflösung | Doku |
|----------|---------|-----------|------|
| `st7920` | ST7920 (Ender 3) | 128×64 Pixel | [display_st7920_de.md](./display_st7920_de.md) |
| `lcd1602` | LCD1602 (HD44780-kompatibel) | 16×2 Zeichen | [display_lcd1602_de.md](./display_lcd1602_de.md) |

## ⚙️ Auswahl der Variante

```yaml
# user-config.yaml
substitutions:
  display_type: "st7920"  # oder "st7789"
```

## ⚡ Kurzvergleich

| Feature | ST7920 | HD44780 16×2 |
|---------|--------|--------------|
| Volles Menü-Design | ✅ | ⚠️ Reduziert |
| Fortschrittsbalken | ✅ | ❌ |
| Ender 3 kompatibel | ✅ | ❌ |
| Kosten | ~5€ | ~2€ |
| Pins | SPI (3 Pins) | I2C (2 Pins) |
