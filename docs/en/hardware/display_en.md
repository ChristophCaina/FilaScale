# 🖥️ Display Variants

[← Back to Hardware Documentation](./README.md)

FilaScale supports two display variants. The variant is selected via a
substitution in the configuration.

## 📋 Available Variants

| Variant | Display | Resolution | Docs |
|---------|---------|------------|------|
| `st7920` | ST7920 (Ender 3) | 128×64 pixels | [display_st7920_en.md](./display_st7920_en.md) |
| `lcd1602` | LCD1602 (HD44780-compatible) | 16×2 characters | [display_lcd1602_en.md](./display_lcd1602_en.md) |

## ⚙️ Selecting the Variant

```yaml
# user-config.yaml
substitutions:
  display_type: "st7920"  # or "st7789"
```

## ⚡ Quick Comparison

| Feature | ST7920 | HD44780 16×2 |
|---------|--------|--------------|
| Full menu design | ✅ | ⚠️ Reduced |
| Progress bar | ✅ | ❌ |
| Ender 3 compatible | ✅ | ❌ |
| Cost | ~5€ | ~2€ |
| Pins | SPI (3 pins) | I2C (2 pins) |
