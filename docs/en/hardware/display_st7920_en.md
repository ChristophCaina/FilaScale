# 🖥️ Display Design (ST7920 128×64)

[← Back to Hardware Documentation](./README.md)

The display is an **ST7920 128×64 pixel** monochrome LCD, compatible with the Ender 3 display module.
This is the **standard variant** of FilaScale with full display functionality.
The layout is based on the **Silkscreen** font in three sizes.

---

## 🎨 Design Principles

- **Consistency**: All pages (except Home) follow the same basic layout
- **Unified navigation**: Same symbols and labels on all screens
- **Title bar**: Every page (except Home) has a clearly labelled title bar
- **Footer**: Always shows only the relevant navigation options

---

## 📐 Base Layout

### Standard Pages (Menu, Settings, Actions)

```
┌────────────────────┐  Line 1 (y=0):   Title bar
│ Title              │
├────────────────────┤  Divider (y=14)
│                    │  Lines 2–6 (y=18–46): Content
│   Content          │
│                    │
│                    │
│                    │
├────────────────────┤  Divider (y=54)
│ Nav hint           │  Line 8 (y=56): Navigation
└────────────────────┘
```

### Home Screen (no title bar — more room for data)

```
┌────────────────────┐  Lines 1–2: Filament info
│ Brand       Type   │
│ Color name         │
├────────────────────┤  Divider
│   243.5 g          │  Lines 3–5: Weight + progress
│   ▓▓▓▓▓▓░░  68%   │
├────────────────────┤  Divider
│ #5  ✓ Backend      │  Lines 6–7: Status + menu hint
│      [ MENU ]      │
└────────────────────┘
```

---

## 🕹️ Navigation Symbols

| Symbol | Meaning | Encoder Action |
|--------|---------|----------------|
| `↕` | Scroll / change value | Rotate |
| `●` | Confirm / OK | Short press |
| `◀` | Back / cancel | Long press |
| `▶` | Forward / open submenu | Short press |

### Footer Variants

Only relevant actions are shown:

```
│ ↕ Scroll  ● OK  ◀ Back │   ← Standard (menu, lists)
│ ↕ Change  ● OK  ◀ Back │   ← Value editor
│ ● Confirm       ◀ Back │   ← Action pages (tare, sync)
│ ↕ ● Toggle      ◀ Back │   ← Checkboxes
```

> **Rule:** `◀ Back` (long press) is always available everywhere —
> but does not need to be shown explicitly on every page.

---

## 🗂️ Screen Overview

### Page 0 — Home (no tag)

```
┌────────────────────┐
│                    │
│   No Tag           │
│                    │
│      0.0 g         │
│                    │
│   Ready...         │
│      [ MENU ]      │
└────────────────────┘
```

### Page 0 — Home (tag detected)

```
┌────────────────────┐
│ Prusament  PLA     │
│ Galaxy Grey        │
├────────────────────┤
│   243.5 g          │
│   ▓▓▓▓▓▓░░  68%   │
├────────────────────┤
│ #5  ✓ Backend      │
│      [ MENU ]      │
└────────────────────┘
```

### Page 1 — Menu

```
┌────────────────────┐
│ MENU               │
├────────────────────┤
│ > 1. Tare          │
│   2. Select Spool  │
│   3. Write Tag     │
│   4. Sync / Info   │
├────────────────────┤
│ ↕ Scroll  ● OK     │
└────────────────────┘
```

### Page 2 — Tare

```
┌────────────────────┐
│ Tare Scale         │
├────────────────────┤
│ Clear platform,    │
│ then confirm.      │
│                    │
│                    │
├────────────────────┤
│ ● Tare     ◀ Back  │
└────────────────────┘
```

### Page 3 — Select Spool

```
┌────────────────────┐
│ Select Spool       │
├────────────────────┤
│ > Prusament PLA    │
│   243g       #5    │
│   Generic PETG     │
│   180g       #7    │
├────────────────────┤
│ ↕ Scroll  ● OK     │
└────────────────────┘
```

### Page 4 — Write Tag

Shows the spool selected in Page 3 for confirmation.

```
┌────────────────────┐
│ Write Tag          │
├────────────────────┤
│ Prusament PLA      │
│ Galaxy Grey  #5    │
│                    │
│ Place tag...       │
├────────────────────┤
│ ● Write    ◀ Back  │
└────────────────────┘
```

### Page 5 — Sync

_Only shown when auto-sync is not active._

```
┌────────────────────┐
│ Spoolman Sync      │
├────────────────────┤
│ Sending weight:    │
│                    │
│   243.5 g → #5     │
│                    │
├────────────────────┤
│ ● Sync     ◀ Back  │
└────────────────────┘
```

### Page 6 — Weight Reconciliation

```
┌────────────────────┐
│ Reconcile?         │
├────────────────────┤
│ Spoolman:  865 g   │
│ Weighed:   868 g   │
│ Delta:      +3 g   │
│                    │
├────────────────────┤
│ ● Sync  ◀ Ignore   │
└────────────────────┘
```

### Page 7 — Info / System

```
┌────────────────────┐
│ System Info        │
├────────────────────┤
│ IP: 192.168.1.95   │
│ WiFi: -65 dBm      │
│ filascale.local    │
│ v2026.4.0          │
├────────────────────┤
│            ◀ Back  │
└────────────────────┘
```

### Page 8 — Settings (example with checkboxes)

```
┌────────────────────┐
│ Settings           │
├────────────────────┤
│ > [x] Auto-Sync    │
│   [ ] Debug Log    │
│   [x] Winder       │
│                    │
├────────────────────┤
│ ↕ ● Toggle  ◀ Back │
└────────────────────┘
```

---

## 🔤 Fonts

| ID | Font | Size | Usage |
|----|------|------|-------|
| `font_small` | Silkscreen | 8px | Body text, footer, labels |
| `font_medium` | Silkscreen | 10px | Title bars, important values |
| `font_large` | Silkscreen | 15px | Weight display |
| `font_xlarge` | Silkscreen | 20px | Spool ID (large) |

---

## 📊 Progress Bar

The fill-level bar is composed of filled (`▓`) and empty (`░`) blocks:

```
▓▓▓▓▓▓░░  68%   (6 of 8 blocks filled)
▓▓▓▓░░░░  50%   (4 of 8 blocks filled)
▓░░░░░░░  12%   (1 of 8 blocks filled)
```

Width: 8 blocks × ~8px = ~64px → fits in the left half of the line.
