---
layout: doc
title: Reverse Lookup Function
head:
  - - meta
    - name: keywords
      content: Oh-my-rime, Mint Pinyin, function keys, reverse lookup, combination input, second translator
description: Oh-my-rime's built-in reverse lookup function helps users to input characters using other input methods, such as radical-based input, stroke-based input, and Wubi input.
aside: true
---
# Reverse Lookup Function <Badge type="tip" text="^2026.03" />
Reverse lookup, in simple terms, refers to using alternative input methods to find characters under the current input method.

Translation to English:

> 2024.04: The reverse lookup function, originally `uu/~u`, `uw/~w`, `ui/~i`, etc., has been uniformly changed to `Uu`, `Uw`, `Ui`, etc., for easy memory.
> More: <Badge type="tip">[51779acb8](https://github.com/Mintimate/oh-my-rime/commit/51779acb88a447926af451426439573d504638f7)</Badge>

For example, using Wubi to view words under the current Pinyin input method.

The Oh-my-rime (Mint Input Method's Pinyin scheme) includes three types of reverse lookup:
- Character decomposition reverse lookup (Uu)
- Wubi reverse lookup (Uw)
- Stroke-based reverse lookup (Ui)

The Wubi input supports:
- Pinyin reverse lookup (Up)

## Configuration

Oh-my-rime comes with complete reverse lookup configurations built-in. This section explains how to customize and remove reverse lookup features.

::: tip Recommended: Use Custom Files for Overrides
Rime supports `.custom.yaml` files for overriding configurations, allowing you to customize settings without modifying original files, and your changes won't be overwritten by updates.

For example, to override Mint Pinyin settings, create a `rime_mint.custom.yaml` file.
:::

### Customize Reverse Lookup

To modify the prefix or hint text of a reverse lookup, you can override it in a `custom` file. Using radical lookup as an example:

```yaml
# rime_mint.custom.yaml
patch:
  radical_reverse_lookup:
    prefix: "Vu"           # Change prefix from Uu to Vu
    tips: 〔Radical Lookup〕 # Modify hint text
  # Update recognizer to match the new prefix
  "recognizer/patterns/radical_lookup": "Vu[a-z]*'?$"
```

::: warning Sync recognizer Configuration
When modifying the reverse lookup prefix, you must also update the corresponding pattern in `recognizer/patterns`, otherwise the new prefix will not trigger the reverse lookup.
:::

To enable the "Tone Display" feature for showing Pinyin with tones:

```yaml
# rime_mint.custom.yaml
patch:
  "switches/@next":
    name: tone_display
    states: [ 声杳, 声起 ]
    reset: 1               # Enable by default
```

### Remove Reverse Lookup

If you don't need certain reverse lookup features, you can remove them in the `custom` file. Using stroke lookup removal as an example:

```yaml
# rime_mint.custom.yaml
patch:
  # Remove dependency
  "dependencies/@next": {}
  # Remove from segmentors
  "engine/segmentors/@before 4": {}
  # Remove from translators
  "engine/translators/@before 6": {}
  # Remove from reverse_lookup.tags
  "reverse_lookup/tags/@before 2": {}
  # Remove recognizer pattern
  "recognizer/patterns/stroke": {}
```

### Add New Reverse Lookup

To add a new reverse lookup feature, complete the following steps:

1. **Add dependency**: Import the target scheme in `dependencies`
   ```yaml
   dependencies:
     - radical_pinyin
   ```

2. **Add engine components**: Import in `segmentors` and `translators` under `engine`
   ```yaml
   engine:
     segmentors:
       - affix_segmentor@radical_reverse_lookup
     translators:
       - reverse_lookup_translator@radical_reverse_lookup
   ```

3. **Define reverse lookup configuration**:
   ```yaml
   radical_reverse_lookup:
     tag: radical_lookup
     dictionary: radical_pinyin
     prefix: "Uu"
     tips: 〔Radical〕
   
   reverse_lookup:
     tags: [radical_lookup]
     overwrite_comment: true
   ```

4. **Add recognition rule**:
   ```yaml
   recognizer:
     patterns:
       radical_lookup: "Uu[a-z]*'?$"
   ```

::: tip Input Comment Display (Tone Display)
In Oh-my-rime, the reverse lookup results support displaying complete Pinyin annotations. This feature is controlled by the "**Tone Display**" switch:
- **Tone Hidden (声杳)**: Disable Pinyin annotation display
- **Tone Display (声起)**: Enable Pinyin annotation display, showing complete Pinyin in the input box during reverse lookup

When enabled, typing `Uuniuniuniu` will display the full Pinyin with tones in real-time in the preedit area (e.g., `niú niú niú`), helping you confirm the correct pronunciation of the radical combination.

**How it works**:
1. Define the `tone_display` switch in the schema
   ```yaml
   - name: tone_display
     states: [ 声杳, 声起 ]
     reset: 0
   ```
2. The Lua filter `super_preedit.lua` reads the switch state and converts input codes to full Pinyin with tones in the preedit area
3. During reverse lookup, `reverse_lookup`'s `overwrite_comment: true` ensures comments are correctly overlaid and displayed
:::

## Radical-based Reverse Lookup

**Personally, I think this is the most practical type of reverse lookup**; In Oh-my-rime, press `Uu` to activate the radical-based input mode. Subsequent inputs will be interpreted using the radical library.

For example: When you type `Uuniuniuniu` on the keyboard, it will be interpreted as the combination of "niu niu niu," which represents three "牛" (cows) and forms the character "犇".

![Radical-based Reverse Lookup](/image/demo/reverseChaizi.webp)

## Wubi Reverse Lookup

In Oh-my-rime's Mint Pinyin mode, use `Uw` to activate the Wubi mode. Subsequent inputs will be interpreted using Wubi.

For example: When you type `Uwq` on the keyboard, it will be interpreted as `q`. In the Wubi dictionary, it automatically retrieves the character `我` (me), which is convenient for combined character lookup.

![Wubi Reverse Lookup](/image/demo/reverseWubi.webp)

The selected text translates to:

## Stroke Reverse Lookup
In Oh-my-rime's Mint Pinyin mode, use `Ui` to activate the stroke mode, and the subsequent input content will be parsed using strokes.

::: danger Countdown to Removal

Considering that the stroke input method is used by too few people. We are considering removing the stroke reverse lookup and related stroke configurations. If you are still using stroke input or reverse lookup, please be sure to contact us, otherwise we may remove the stroke category in the future.

:::

## Pinyin Reverse Lookup
In Oh-my-rime's Wubi mode, use `Up` to activate the stroke mode, and the subsequent input content will be parsed using Pinyin.