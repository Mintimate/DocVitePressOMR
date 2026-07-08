---
layout: doc
title: Lua Extensions
head:
  - - meta
    - name: keywords
      content: Rime Lua scripts,oh-my-rime Lua,oh-my-rime lua directory,shijian.lua,number_translator.lua,mint_calculator_translator.lua,chineseLunarCalendar_translator.lua,unicode_filter.lua,select_character.lua,codeLengthLimit_processor.lua,kp_number_processor.lua,auxCode_filter.lua,corrector_filter.lua,super_preedit.lua,autocap_filter.lua,reduce_english_filter.lua,force_gc.lua,tag_user_dict.lua
description: Detailed guide to oh-my-rime Lua extensions, organized by lua directory filename, Rime registration name, processor, translator, filter, trigger code, and configuration keys for date/time, calculator, Chinese amount conversion, lunar calendar, Unicode code lookup, select character from word, auxiliary code, keypad numbers, and candidate source tags.
---

# Lua Extensions

Oh-my-rime provides extension features through scripts in the `lua/` directory. This page is organized by Lua filename, Rime registration name, module type, trigger code, and configuration key, so searches for keywords such as `shijian.lua`, `select_character.lua`, `auxCode_filter.lua`, or `kp_number_processor.lua` can land on the correct feature.

## Lua Directory and Registration

In schema files, Lua scripts are usually registered in one of these forms:

| Registration | Type | Purpose |
|------|------|------|
| `lua_processor@*module_name` | processor | Handle key events, such as select character from word, keypad numbers, and input length limits |
| `lua_translator@*module_name` | translator | Generate candidates from input codes, such as date/time, Chinese amount, calculator, and lunar calendar |
| `lua_filter@*module_name` | filter | Adjust or annotate candidates, such as pronunciation hints, auxiliary code filtering, and English candidate demotion |
| `lua_filter@*module_name@namespace` | filter + namespace | Let one script read different data files, for example `lua_filter@*auxCode_filter@flypy_full` reads `lua/aux_code/flypy_full.txt` |

## Feature Overview

Oh-my-rime includes the following Lua files and auxiliary data. "Enabled by default" refers to `rime_mint.schema.yaml`; double-pinyin, auxiliary-code, or custom schemas may enable additional Lua modules.

| Lua File or Directory | Registration or Namespace | Type | Enabled by Default | Feature and Search Keywords |
|------|------|------|------|------|
| `shijian.lua` | `shijian` | translator | Yes | Date, time, weekday, holidays, solar terms, greetings, `osj`, `/sj`, `N20250315` |
| `number_translator.lua` | `number_translator` | translator | Yes | Chinese uppercase amount, RMB amount, `R1234` |
| `chineseLunarCalendar_translator.lua` | `chineseLunarCalendar_translator` | translator | Yes | Lunar calendar, Gregorian to lunar date, `/nl`, `onl`, `N20240115` |
| `mint_calculator_translator.lua` | `mint_calculator_translator` | translator | Yes | Calculator, math expression, `=1+1`, `sqrt` |
| `kp_number_processor.lua` | `kp_number_processor` | processor | Yes | Keypad numbers, numeric keypad, candidate selection, `kp_number_mode` |
| `select_character.lua` | `select_character` | processor | Yes | Select character from word, first character, last character, `select_first_character`, `select_last_character` |
| `codeLengthLimit_processor.lua` | `codeLengthLimit_processor` | processor | Yes | Input length limit, maximum code length, long pinyin string, lag prevention |
| `corrector_filter.lua` | `corrector_filter` | filter | Yes | Pronunciation error hints, spelling correction, candidate comment |
| `super_preedit.lua` | `super_preedit` | filter | Yes | Full pinyin display, tone display, `tone_display`, `声杳`, `声起` |
| `autocap_filter.lua` | `autocap_filter` | filter | Yes | Auto-capitalize English, sentence initial capitalization |
| `reduce_english_filter.lua` | `reduce_english_filter` | filter | Yes | Lower English candidates, short English word priority, `rug`, `mode: all` |
| `unicode_filter.lua` | `unicode_filter` | filter | Yes | Unicode code lookup, code point conversion, `Uc`, `U+4E2D`, `\u4E2D`, HTML entity |
| `force_gc.lua` | `force_gc` | translator | Yes | Force garbage collection, memory stability, Lua GC |
| `auxCode_filter.lua` | `auxCode_filter@flypy_full`, etc. | filter | No | Auxiliary code, shape-code filtering, Xiaohe Double Pinyin, Natural Code, Moqi, `aux_code/trigger_word` |
| `aux_code/*.txt` | `flypy_full`, `ZRM_Aux-code_4.3`, `moqi_aux_code` | Data file | Schema-dependent | Auxiliary code data, `Character=ShapeCode`, Xiaohe shape code, Natural Code shape code |
| `tag_user_dict.lua` | `tag_user_dict` | filter | No | Candidate source tag, user dictionary, user phrase, `user_table`, `user_phrase` |
| `log.lua` | `log` | helper | No | Lua debug logging, development debugging, output log file |

## Date & Time Input (shijian)

`lua/shijian.lua` is registered as `lua_translator@*shijian`. It is one of the most frequently used Lua translators in oh-my-rime. Through specific leader keys, you can quickly input date, time, weekday, holidays, solar terms, greeting templates, and more.

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

`lua/number_translator.lua` is registered as `lua_translator@*number_translator`. It converts numbers to Chinese uppercase amount text, commonly used for RMB amount input. In Chinese input mode, type uppercase `R` followed by a number to convert it to Chinese uppercase amount format.

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

`lua/mint_calculator_translator.lua` is registered as `lua_translator@*mint_calculator_translator`. It calculates mathematical expressions directly in the candidate list. In Chinese input mode, type `=` followed by an expression to get the result.

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

`lua/chineseLunarCalendar_translator.lua` is registered as `lua_translator@*chineseLunarCalendar_translator`. It is used for lunar date lookup and Gregorian-to-lunar conversion. In addition to the N-mode mentioned above, oh-my-rime also configures a lunar calendar translator. The configuration in the schema:

```yaml
chineseLunarCalendar_translator: lunar
```

Use `/nl` or `onl` to directly output today's lunar date.

## Unicode Code Lookup (unicode_filter)

`lua/unicode_filter.lua` is registered as `lua_filter@*unicode_filter`. It converts candidate text into common Unicode code point formats. The default trigger prefix is `Uc`; type `Uc` followed by the code used by the current schema for the target character or word.

This is not "type a Unicode code point and get the character". It is "type a word or character code and look up its Unicode representation". For example, first find `中` through pinyin, double pinyin, Wubi, or another schema code, then output formats such as `U+4E2D` and `\u4E2D`. It is mostly for fun: when you are curious about the Unicode code points for `薄荷`, you can look them up on the spot.

| Input | Schema Example | Description |
|-------|----------------|-------------|
| `Uczhong` | Mint Pinyin full pinyin | Query the Unicode code for `中` |
| `Ucvs` | Xiaohe Double Pinyin | Query the Unicode code for `中` |

When the candidate text is `中`, the filter can generate these formats:

| Format | Example Output |
|--------|----------------|
| Unicode code point | `U+4E2D` |
| Hex code point | `4E2D` |
| JavaScript/JSON escape | `\u4E2D` |
| HTML entity | `&#x4E2D;` |
| Perl/Ruby-style escape | `\x{4E2D}` |

For multi-character candidates, the filter outputs each character's code point in sequence. For example, a word may produce candidates such as `U+4F60 U+597D`, `\u4F60\u597D`, or `&#x4F60;&#x597D;`.

Related schema configuration:

```yaml
engine:
  segmentors:
    - affix_segmentor@unicode
  translators:
    - script_translator@unicode
  filters:
    - lua_filter@*unicode_filter

unicode:
  tag: unicode
  dictionary: rime_mint
  enable_user_dict: false
  enable_sentence: false
  prefix: "Uc"
  tips: 〔Unicode〕

recognizer:
  patterns:
    unicode: "^Uc[a-z0-9;]*'?$"
```

::: tip Note
Unicode code lookup depends on the current schema's dictionary code, so the suffix after `Uc` differs between full pinyin, double pinyin, Wubi, T9, and other schemas. The rule is simply `Uc + current schema code`.
:::

## Keypad Number Handling (kp_number_processor)

`lua/kp_number_processor.lua` is registered as `lua_processor@*kp_number_processor`. It controls numeric keypad and main keyboard number behavior. The problem it solves is that number keys may need to participate in input codes, commit numbers directly, or select candidates when a candidate menu is visible.

In `rime_mint.schema.yaml`, this processor is placed near the beginning of `engine/processors`:

```yaml
engine:
  processors:
    - lua_processor@*kp_number_processor
```

Configuration:

```yaml
kp_number_mode: auto  # auto | compose
```

| Mode | Description |
|------|-------------|
| `auto` | Default mode. Numeric keypad numbers commit directly when idle; while composing, they participate in the input code |
| `compose` | Numeric keypad numbers always participate in the input code and do not commit directly |

Main keyboard numbers can still select candidates when a candidate menu exists. If the current input matches function patterns in `recognizer/patterns`, such as URL, reverse lookup, RMB amount, calculator, or lunar date conversion, the number continues to be inserted as part of the input code.

## Pronunciation Error Hints (corrector_filter)

`lua/corrector_filter.lua` is registered as `lua_filter@*corrector_filter`. This Lua filter hints at possible pronunciation errors during input. When you type a common spelling mistake, the candidate's comment area will display the correct spelling.

This feature requires the following configuration in the schema:

```yaml
translator:
  spelling_hints: 8
  always_show_comments: true
  comment_format: {comment}
```

## Auto-capitalize English (autocap_filter)

`lua/autocap_filter.lua` is registered as `lua_filter@*autocap_filter`. This filter automatically capitalizes the first letter of English words when they appear at the beginning of a sentence or in specific contexts. Useful search keywords include English auto-capitalization, sentence initial capitalization, and autocap.

## Reduce English Candidates (reduce_english_filter)

`lua/reduce_english_filter.lua` is registered as `lua_filter@*reduce_english_filter`. This filter addresses the issue of short English words interfering with pinyin input. For example, when typing `rug`, the default behavior would show English `rug` first; with this enabled, Chinese `如果` will be prioritized.

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

`lua/select_character.lua` is registered as `lua_processor@*select_character`. Character selection from a word means typing a word first, letting the target word appear in the candidate list, and then committing the first or last character of that word with predefined keys. Oh-my-rime uses `[` and `]` by default:
- `[`: Commit the first character of the candidate word
- `]`: Commit the last character of the candidate word

For example, if you want to input 「钛」, typing `tai` directly may make the character hard to find. Instead, type `tai he jin`; when 「钛合金」 appears in the candidate list, press `[` to commit 「钛」. Pressing `]` would commit 「金」.

### Changing Selection Keys

To change the character selection keys (e.g., to `-` and `=`), configure them under `key_binder`. After changing the binding, use the new key; for example, `select_first_character: "minus"` means pressing `-` commits the first character:

```yaml
patch:
  key_binder/select_first_character: "minus"   # Use - to select first char
  key_binder/select_last_character: "equal"    # Use = to select last char
```

## Auxiliary Code Filter (auxCode_filter)

`lua/auxCode_filter.lua` is registered as `lua_filter@*auxCode_filter@namespace`. It is used for double-pinyin auxiliary code, shape-code filtering, and candidate shape-code hints. A common registration is:

```yaml
filters:
  - lua_filter@*auxCode_filter@flypy_full
```

Here `@flypy_full` is the namespace, and it also corresponds to `lua/aux_code/flypy_full.txt`. If the specified file cannot be found, the script falls back to the default `lua/aux_code/ZRM_Aux-code_4.3.txt`.

Auxiliary code data files are stored in `lua/aux_code/`, using the `Character=ShapeCode` format:

```text
啊=kk
阿=ek
爱=py
安=bn
```

Built-in auxiliary code data:

| Filename | Common Use | Description |
|------|------|------|
| `flypy_full.txt` | Xiaohe Double Pinyin / Xiaohe phonetic-shape | Xiaohe shape code |
| `ZRM_Aux-code_4.3.txt` | Natural Code | Natural Code shape code, also the default fallback file |
| `moqi_aux_code.txt` | Other double-pinyin schemas | Moqi shape code |

Common auxiliary code configuration:

```yaml
aux_code:
  trigger_word: ";"
  show_aux_notice: "trigger"  # always | trigger | none
```

| Configuration | Description |
|------|-------------|
| `aux_code/trigger_word` | Key used to activate auxiliary-code filtering, default is `;` |
| `aux_code/show_aux_notice: always` | Always show shape-code hints for candidates |
| `aux_code/show_aux_notice: trigger` | Show shape-code hints only after the trigger key is entered |
| `aux_code/show_aux_notice: none` | Do not show shape-code hints |

For example, after entering a double-pinyin code and seeing multiple homophone candidates, continue with `;` and the shape code; `auxCode_filter` filters candidates by the auxiliary code of the character or word. For the full Xiaohe Double Pinyin auxiliary-code guide, see [Xiaohe Phonetic Shape](../demo/doublePinyinFly.md).

## Full Pinyin Display with Tones (super_preedit)

`lua/super_preedit.lua` is registered as `lua_filter@*super_preedit`. This filter converts input codes to full pinyin with tones in real time. For example, typing `nihao` will display `nǐ hǎo` in the preedit area.

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

`lua/codeLengthLimit_processor.lua` is registered as `lua_processor@*codeLengthLimit_processor`. Oh-my-rime limits the maximum pinyin string length to 25 characters by default to prevent lag from overly long inputs.

To modify:

```yaml
patch:
  codeLengthLimit_processor: 100  # Adjust to 100 characters
```

::: warning Note
Increasing the input length limit may cause lag on some devices. Adjust according to your device's performance.
:::

## Force Garbage Collection (force_gc)

`lua/force_gc.lua` is registered as `lua_translator@*force_gc`. It calls Lua's `collectgarbage("step")` for incremental garbage collection, which helps keep memory usage stable during long-running input sessions. This module usually does not require a user-facing trigger or extra configuration; keeping it in the schema is enough.

## Candidate Source Tags (tag_user_dict)

`lua/tag_user_dict.lua` is registered as `lua_filter@*tag_user_dict`, but it is not enabled by default in `rime_mint.schema.yaml`. It is mainly used for debugging candidate sources by appending marks to different candidate types, such as user dictionary entries, user phrases, completions, sentences, and default phrases.

Example configuration:

```yaml
patch:
  "engine/filters/+":
    - lua_filter@*tag_user_dict
  tag_user_dict:
    user_table: "☁"
    completion: "☁"
    sentence: "~"
    phrase: ""
    user_phrase: "*"
```

Useful search keywords: candidate source, user dictionary tag, user phrase tag, `user_table`, `completion`, `sentence`, `phrase`, and `user_phrase`. For a fuller custom-file example, see [Customization Input](./customizationInput.md).

## Debug Logging (log)

`lua/log.lua` is a Lua debugging helper for other scripts to `require("log")` during development or troubleshooting. It is not a processor, translator, or filter, and it is not enabled as an input-method feature by default. A common use is temporarily logging from scripts such as `auxCode_filter.lua` to inspect candidate handling, auxiliary-code matching, or configuration loading.
