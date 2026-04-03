# 🖥️ Display Design (ST7920 128×64)

Das Display ist ein **ST7920 128×64 Pixel** Monochrom-LCD, kompatibel mit dem Ender 3 Display-Modul.
Dieses ist die **Standard-Variante** von FilaScale mit vollem Display-Funktionsumfang.
Die Darstellung basiert auf dem **Silkscreen** Font in drei Größen.

---

## 🎨 Design-Prinzipien

- **Konsistenz**: Alle Pages (außer Home) folgen demselben Grundlayout
- **Einheitliche Navigation**: Gleiche Symbole und Bezeichnungen auf allen Screens
- **Titelzeile**: Jede Page (außer Home) hat eine klar beschriftete Titelzeile
- **Footer**: Zeigt immer nur die relevanten Navigationsmöglichkeiten

---

## 📐 Grundlayout

### Standard-Pages (Menü, Einstellungen, Aktionen)

```
┌────────────────────┐  Zeile 1 (y=0):  Titelzeile
│ Titel              │
├────────────────────┤  Trennlinie (y=14)
│                    │  Zeilen 2–6 (y=18–46): Content
│   Content          │
│                    │
│                    │
│                    │
├────────────────────┤  Trennlinie (y=54)
│ Nav-Hint           │  Zeile 8 (y=56): Navigation
└────────────────────┘
```

### Home-Screen (ohne Titelzeile — mehr Platz für Daten)

```
┌────────────────────┐  Zeilen 1–2: Filament-Info
│ Hersteller  Typ    │
│ Farbname           │
├────────────────────┤  Trennlinie
│   243.5 g          │  Zeilen 3–5: Gewicht + Fortschritt
│   ▓▓▓▓▓▓░░  68%   │
├────────────────────┤  Trennlinie
│ #5  ✓ Backend      │  Zeilen 6–7: Status + Menü-Hint
│      [ MENÜ ]      │
└────────────────────┘
```

---

## 🕹️ Navigations-Symbole

| Symbol | Bedeutung | Encoder-Aktion |
|--------|-----------|----------------|
| `↕` | Scrollen / Wert ändern | Drehen |
| `●` | Bestätigen / OK | Kurz drücken |
| `◀` | Zurück / Abbrechen | Lang drücken |
| `▶` | Weiter / Untermenü öffnen | Kurz drücken |

### Footer-Varianten

Nur relevante Aktionen werden angezeigt:

```
│ ↕ Scroll  ● OK  ◀ Back │   ← Standard (Menü, Listen)
│ ↕ Ändern  ● OK  ◀ Back │   ← Wert-Editor
│ ● Bestätigen    ◀ Back │   ← Aktions-Seiten (Tare, Sync)
│ ↕ ● Toggle      ◀ Back │   ← Checkboxen
```

> **Regel:** `◀ Back` (Lang drücken) gilt immer und überall —
> muss aber nicht auf jeder Page explizit angezeigt werden.

---

## 🗂️ Screen-Übersicht

### Page 0 — Home (kein Tag)

```
┌────────────────────┐
│                    │
│   Kein Tag         │
│                    │
│      0.0 g         │
│                    │
│   Bereit...        │
│      [ MENÜ ]      │
└────────────────────┘
```

### Page 0 — Home (Tag erkannt)

```
┌────────────────────┐
│ Prusament  PLA     │
│ Galaxy Grey        │
├────────────────────┤
│   243.5 g          │
│   ▓▓▓▓▓▓░░  68%   │
├────────────────────┤
│ #5  ✓ Backend      │
│      [ MENÜ ]      │
└────────────────────┘
```

### Page 1 — Menü

```
┌────────────────────┐
│ MENÜ               │
├────────────────────┤
│ > 1. Tarieren      │
│   2. Spule wählen  │
│   3. Spule wählen  │
│   4. Sync / Info   │
├────────────────────┤
│ ↕ Scroll  ● OK     │
└────────────────────┘
```

### Page 2 — Tarieren

```
┌────────────────────┐
│ Tarieren           │
├────────────────────┤
│ Plattform leeren,  │
│ dann bestätigen.   │
│                    │
│                    │
├────────────────────┤
│ ● Tare     ◀ Back  │
└────────────────────┘
```

### Page 3 — Spule wählen

```
┌────────────────────┐
│ Spule wählen       │
├────────────────────┤
│ > Prusament PLA    │
│   243g       #5    │
│   Generic PETG     │
│   180g       #7    │
├────────────────────┤
│ ↕ Scroll  ● OK     │
└────────────────────┘
```

### Page 4 — Tag schreiben

Zeigt die zuvor in Page 3 ausgewählte Spule zur Bestätigung an.

```
┌────────────────────┐
│ Tag schreiben      │
├────────────────────┤
│ Prusament PLA      │
│ Galaxy Grey  #5    │
│                    │
│ Tag auflegen...    │
├────────────────────┤
│ ● Schreiben ◀ Back │
└────────────────────┘
```

### Page 5 — Sync

_Wird nur angezeigt wenn kein Auto-Sync aktiv ist._

```
┌────────────────────┐
│ Spoolman Sync      │
├────────────────────┤
│ Sende Gewicht:     │
│                    │
│   243.5 g → #5     │
│                    │
├────────────────────┤
│ ● Sync     ◀ Back  │
└────────────────────┘
```

### Page 6 — Gewichts-Abgleich

```
┌────────────────────┐
│ Abgleichen?        │
├────────────────────┤
│ Spoolman:  865 g   │
│ Gewogen:   868 g   │
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
│ WLAN: -65 dBm      │
│ filascale.local    │
│ v2026.4.0          │
├────────────────────┤
│            ◀ Back  │
└────────────────────┘
```

### Page 8 — Einstellungen (Beispiel mit Checkboxen)

```
┌────────────────────┐
│ Einstellungen      │
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

| ID | Font | Größe | Verwendung |
|----|------|-------|------------|
| `font_small` | Silkscreen | 8px | Fließtext, Footer, Labels |
| `font_medium` | Silkscreen | 10px | Titelzeilen, wichtige Werte |
| `font_large` | Silkscreen | 15px | Gewichtsanzeige |
| `font_xlarge` | Silkscreen | 20px | Spool-ID (groß) |

---

## 📊 Fortschrittsbalken

Der Füllstand-Balken wird aus gefüllten (`▓`) und leeren (`░`) Blöcken zusammengesetzt:

```
▓▓▓▓▓▓░░  68%   (6 von 8 Blöcken gefüllt)
▓▓▓▓░░░░  50%   (4 von 8 Blöcken gefüllt)
▓░░░░░░░  12%   (1 von 8 Blöcken gefüllt)
```

Breite: 8 Blöcke × ~8px = ~64px → passt in die linke Hälfte der Zeile.
