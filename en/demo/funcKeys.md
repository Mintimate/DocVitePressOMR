---
layout: doc
title: Special Function Keys
head:
  - - meta
    - name: keywords
      content: oh-my-rime, function keys, shortcuts, Lua effects
description: Oh-my-rime input codes for dates (orq), time (osj), lunar dates (onl), Chinese currency (R), date conversion (N), and calculator expressions (=).
aside: true
---

# Special Function Keys

Oh-my-rime uses Lua scripts to generate the following content from input codes. Type each code in Chinese input mode, preserving its letter case, then choose a result from the candidates:
- Time/Week/Date/Solar Terms printing
- Capitalized Chinese currency printing
- Lunar date printing/conversion
- Simple calculator

## Time/Week/Date/Solar Terms <Badge type="tip" text="^2025.11" />

Before version [7ae364ea06](https://github.com/Mintimate/oh-my-rime/commit/2c53f68cf4bb9461bda82e1b2862307ae364ea06), multiple Lua scripts were used to implement time, week, and date printing.

However, after this version, AMZ contributed the [shijian.lua](https://github.com/Mintimate/oh-my-rime/blob/8c8fb9c40a8e4bdff8a325049e96119f6699c965/lua/shijian.lua) script to implement the printing of time and other information.

You can use the following keywords to activate the corresponding functions:
- Time: osj
- Date: orq
- Lunar calendar: onl
- Week: oxq
- Week of the year: oww
- Solar terms: ojq
- Date + Time: odt
- Timestamp: ott
- Uppercase N date: N20250315 or N0312 without year
- Festivals: ojr
- Greeting template: oday

![shijian.lua usage effect](/image/demo/shijianLua.webp)

If you want to set the order of each date in `orq`, you can override the `date_formats` configuration item:

![Override date_format](/image/demo/overrideDateFormat.webp)

## Capitalized Chinese Currency Printing

Type uppercase `R` followed by an amount, for example `R123.45`, to generate Chinese currency in words. Number-key behavior also depends on the [numeric keypad processor configuration](/en/guide/luaExtensions.html).
![Capitalized Chinese Currency](/image/demo/rmbKey.webp)

Afterward, to select a candidate, you can use the arrow keys for selection and the spacebar to select; you can also use `Ctrl` + `number key` to select.

## Lunar Date Printing/Conversion
Type `onl` to output today's lunar date. Older instructions and the historical screenshot below use `lunar`; follow the `shijian.lua` instructions above for the current default codes.

If you want to query the lunar date of a certain day, you can use the leading letter `N`. Then enter the query date using the numeric keys.

![Lunar Date Printing/Conversion](/image/demo/luaLunar.webp)

## Simple Calculator
Users have been eagerly requesting this feature, so starting from version [fca55ddff0](https://github.com/Mintimate/oh-my-rime/commit/fca55ddff09b88b0c022f9d883a22940659cf497), the simple calculator function has been officially added.

> In fact, I had already submitted a pull request for this feature to the upstream code [baopaau/rime-lua-collection #3](https://github.com/baopaau/rime-lua-collection/pull/3) at the beginning of 2024, but for some reasons, it has not been adapted to the Mintimate input method until now.

In Chinese input mode, type `=` followed by an expression, such as `=1+2`, to use the calculator:

![Simple Calculator](/image/demo/luaCalculator.webp)

Of course, `=` can be changed to other letters, and you can override the `recognizer/patterns/expression` configuration item.

If you don't want to use the calculator, you can disable it through custom configuration. For example, using the `double_pinyin_flypy.custom.yaml` file, add the following content:
```yaml
patch:
  # Close the simple calculator
  "recognizer/patterns/expression": ""
```
