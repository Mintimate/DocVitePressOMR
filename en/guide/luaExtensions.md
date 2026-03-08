---
layout: doc
title: Lua Extensions
head:
  - - meta
    - name: keywords
      content: Rime Lua scripts,oh-my-rime Lua,Rime date time,Rime calculator,Rime number conversion
description: Detailed guide on Lua extension features in oh-my-rime, including date/time input, calculator, number conversion, lunar calendar, and more.
---

# Lua Extensions

Oh-my-rime provides a rich set of extension features through Lua scripts, greatly enhancing the practicality of the input method. This article details the usage and configuration of each Lua module.

## Feature Overview

Oh-my-rime includes the following built-in Lua modules:

| Module | Type | Description |
|--------|------|-------------|
| `shijian` | translator | Date, time, weekday, holidays, solar terms, greetings |
| `number_translator` | translator | Number to Chinese uppercase amount conversion |
| `chineseLunarCalendar_translator` | translator | Gregorian to Lunar calendar conversion |
| `mint_calculator_translator` | translator | Calculator (dynamic expression evaluation) |
| `select_character` | processor | Select individual character from word |
| `codeLengthLimit_processor` | processor | Limit maximum input code length |
| `corrector_filter` | filter | Pronunciation error hints |
| `super_preedit` | filter | Display full pinyin with tones in preedit |
| `autocap_filter` | filter | Auto-capitalize English words |
| `reduce_english_filter` | filter | Lower ranking of certain English candidates |
| `force_gc` | translator | Force garbage collection (performance) |

## Date & Time Input (shijian)

This is one of the most frequently used Lua features in oh-my-rime. Through specific leader keys, you can quickly input current date, time, weekday, and more.

### Basic Usage

Oh-my-rime uses `o` as the default leader key for Lua scripts. Although the `shijian.lua` script itself supports `/` as a leader key, in the default configuration, `/` is occupied by Symbols input. Therefore, it is recommended to use `o` as the prefix to trigger date and time functions.

| Input Code | Function | Example Output |
|------------|----------|----------------|
| `osj` | Current Time | 14:30, 14点30分 |
| `orq` | Current Date | 2025年03月08日, 2025-03-08 |
| `onl` | Lunar Date | 二〇二五年二月初九 |
| `oxq` | Weekday | 星期六 |
| `oww` | Week Number | 第10周 |
| `ojq` | Solar Term | 惊蛰 |
| `odt` | Date + Time | 2025-03-08 14:30:00 |
| `ott` | Timestamp | 1741425000 |
| `ojr` | Holiday | 妇女节 |
| `oday` | Greeting | 下午好！ |

::: tip Note
Typing `/sj`, `/rq`, etc., will trigger Rime's Symbols input function (defined in `symbols.yaml`), outputting special symbols (like `㍘`, `㏠`, etc.) instead of dynamically generated date and time.
:::

### N-mode Date Conversion

Type uppercase `N` followed by a date number to convert a Gregorian date to Lunar calendar:

| Input | Function |
|-------|----------|
| `N20250308` | Convert March 8, 2025 to Lunar date |
| `N0308` | Convert March 8 of the current year to Lunar date |

### Custom Date/Time Formats

Oh-my-rime supports customizing date and time output formats in the schema file. In `rime_mint.schema.yaml`:

```yaml
date_formats:
  - "Y年m月d日"
  - "Y-m-d"
  - "Y/m/d"
  - "Y.m.d"
  - "Ymd"
  - "Y年n月j日"

time_formats:
  - "H:M"
  - "H点M分"
  - "H:M:S"
  - "H时M分S秒"
  - "AI:M"
  - "I:M P"

datetime_formats:
  - "Y-m-d H:M:S"
  - "Y-m-dTH:M:S O"
  - "YmdHMS"
  - "Y年m月d日 H点M分"
  - "y/m/d I:M p"
```

**Format Placeholder Reference:**

**Date:**
| Placeholder | Description | Range/Example |
|-------------|-------------|---------------|
| `Y` | Four-digit year | 2025 |
| `y` | Two-digit year | 25 |
| `m` | Month (zero-padded) | 01-12 |
| `n` | Month (no padding) | 1-12 |
| `d` | Day (zero-padded) | 01-31 |
| `j` | Day (no padding) | 1-31 |

**Time:**
| Placeholder | Description | Range/Example |
|-------------|-------------|---------------|
| `H` | 24-hour (zero-padded) | 00-23 |
| `G` | 24-hour (no padding) | 0-23 |
| `I` | 12-hour (zero-padded) | 01-12 |
| `l` | 12-hour (no padding) | 1-12 |
| `M` | Minutes (zero-padded) | 00-59 |
| `S` | Seconds (zero-padded) | 00-59 |
| `p` | am/pm (lowercase) | am / pm |
| `P` | AM/PM (uppercase) | AM / PM |
| `A` | Chinese time period | 凌晨/上午/中午/下午/晚上 |

**Timezone:**
| Placeholder | Description | Example |
|-------------|-------------|---------|
| `O` | With colon | +08:00 |
| `o` | Without colon | +0800 |

**Escape support:**
- `\X`: Escape a single character, output as literal
- `[[...]]`: Block escape, output as literal

To customize formats via a custom file, create `rime_mint.custom.yaml`:

```yaml
patch:
  date_formats:
    - "Y年m月d日"
    - "Y-m-d"
    - "Ymd"
  time_formats:
    - "H:M:S"
    - "H:M"
```

### Changing Leader Keys

The leader key for date/time functions can be modified via `key_binder/shijian_keys`:

```yaml
patch:
  key_binder/shijian_keys: ["o", "v"]  # Support both o and v as leader keys
```

## Number to Chinese Amount (number_translator)

In Chinese input mode, type uppercase `R` followed by a number to convert it to Chinese uppercase amount format.

### Usage Examples

| Input | Output |
|-------|--------|
| `R1234` | 壹仟贰佰叁拾肆元整 |
| `R1234.56` | 壹仟贰佰叁拾肆元伍角陆分 |
| `R0.5` | 零元伍角 |

::: tip Trigger Prefix
This feature is triggered by the `rmb` rule in `recognizer`:
```yaml
recognizer:
  patterns:
    rmb: "^R[0-9]+[.]?[0-9]*"
```
The script automatically extracts the numeric part after `R` for conversion.
:::

## Calculator (mint_calculator_translator)

In Chinese input mode, type `=` followed by a mathematical expression to calculate the result directly.

### Usage Examples

| Input | Output |
|-------|--------|
| `=1+1` | 2 |
| `=3.14*2` | 6.28 |
| `=100/3` | 33.333... |
| `=2^10` | 1024 |
| `=sqrt(144)` | 12 |

::: tip Trigger Prefix
This feature is triggered by the `expression` rule in `recognizer`:
```yaml
recognizer:
  patterns:
    expression: "^=.*$"
```
:::

## Lunar Calendar (chineseLunarCalendar_translator)

In addition to the N-mode mentioned above, oh-my-rime also configures a lunar calendar translator. The configuration in the schema:

```yaml
chineseLunarCalendar_translator: lunar
```

Use `/nl` or `onl` to directly output today's lunar date.

## Pronunciation Error Hints (corrector_filter)

This Lua filter hints at possible pronunciation errors during input. When you type a common spelling mistake, the candidate's comment area will display the correct spelling.

This feature requires the following configuration in the schema:

```yaml
translator:
  spelling_hints: 8
  always_show_comments: true
  comment_format: {comment}
```

## Auto-capitalize English (autocap_filter)

This filter automatically capitalizes the first letter of English words when they appear at the beginning of a sentence or in specific contexts.

## Reduce English Candidates (reduce_english_filter)

This filter addresses the issue of short English words interfering with pinyin input. For example, when typing `rug`, the default behavior would show English `rug` first; with this enabled, Chinese `如果` will be prioritized.

### Configuration Modes

Different frequency reduction modes can be configured in the schema:

```yaml
reduce_english_filter:
  mode: all       # all | none | custom | leave blank
  idx: 2          # Position to lower to
  words: [...]    # Custom word list for custom mode
```

| Mode | Description |
|------|-------------|
| `all` | Lower all 3-4 character English words matching specific patterns (using built-in list) |
| `none` | Don't lower any words |
| `custom` | Only lower words specified in the `words` list |
| Blank | Use the script's global default settings |

To modify via a custom file:

```yaml
patch:
  reduce_english_filter:
    mode: none  # Disable English frequency reduction
```

## Select Character from Word (select_character)

Oh-my-rime uses `[` and `]` by default for character selection from words:
- `[`: Select the first character of the word
- `]`: Select the last character of the word

For example, after typing `mingbai` (明白):
- Press `[` to commit 「明」
- Press `]` to commit 「白」

### Changing Selection Keys

To change the character selection keys (e.g., to `-` and `=`):

```yaml
patch:
  key_binder/select_first_character: "minus"   # Use - to select first char
  key_binder/select_last_character: "equal"    # Use = to select last char
```

## Full Pinyin Display with Tones (super_preedit)

This filter converts input codes to full pinyin with tones in real-time. For example, typing `nihao` will display `nǐ hǎo` in the preedit area.

This feature is controlled by the `tone_display` switch in the schema:

```yaml
switches:
  - name: tone_display
    states: [ 声杳, 声起 ]
    reset: 0  # Off by default
```

- **声杳** (Off): Display original input codes
- **声起** (On): Display full pinyin with tones

## Input Length Limit (codeLengthLimit_processor)

Oh-my-rime limits the maximum pinyin string length to 25 characters by default to prevent lag from overly long inputs.

To modify:

```yaml
patch:
  codeLengthLimit_processor: 100  # Adjust to 100 characters
```

::: warning Note
Increasing the input length limit may cause lag on some devices. Adjust according to your device's performance.
:::
