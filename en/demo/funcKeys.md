---
layout: doc
title: Special Function Keys
head:
  - - meta
    - name: keywords
      content: oh-my-rime, function keys, shortcuts, Lua effects
description: With oh-my-rime, you can utilize various related shortcuts and function keys. Some of these function shortcuts are implemented using Lua, allowing for features like automatically inputting the current date, time, and Chinese currency in both numerals and words. These shortcuts can also be implemented within the rime input method.
aside: true
---

# Special Function Keys

With the help of `Lua` scripts, Oh-my-rime has implemented some specific function keys:
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
- Date + Time: ors
- Timestamp: ott
- Uppercase N date: N20250315 or N0312 without year
- Festivals: ojr
- Greeting template: oday

![shijian.lua usage effect](/image/demo/shijianLua.webp)

If you want to set the order of each date in `orq`, you can override the `date_format` configuration item:

![Override date_format](/image/demo/overrideDateFormat.webp)

## Capitalized Chinese Currency Printing

This feature of printing capitalized Chinese currency is quite interesting. It is activated by using the uppercase letter "`R`" and then inputting the numeric keys on the keyboard (the keys above the letters, not the ones on the numpad):
![Capitalized Chinese Currency](/image/demo/rmbKey.webp)

Afterward, to select a candidate, you can use the arrow keys for selection and the spacebar to select; you can also use `Ctrl` + `number key` to select.

## Lunar Date Printing/Conversion
If you want to print the lunar date, you need to know that the `"Chinese lunar calendar"` in English is: Chinese lunar calendar.

Therefore, I set the leading word for printing the lunar date to `lunar`. If you enter the leading word in the input method, you can output the lunar date of the current day.

If you want to query the lunar date of a certain day, you can use the leading letter `N`. Then enter the query date using the numeric keys.

![Lunar Date Printing/Conversion](/image/demo/luaLunar.webp)

## Simple Calculator
Users have been eagerly requesting this feature, so starting from version [fca55ddff0](https://github.com/Mintimate/oh-my-rime/commit/fca55ddff09b88b0c022f9d883a22940659cf497), the simple calculator function has been officially added.

> In fact, I had already submitted a pull request for this feature to the upstream code [baopaau/rime-lua-collection #3](https://github.com/baopaau/rime-lua-collection/pull/3) at the beginning of 2024, but for some reasons, it has not been adapted to the Mintimate input method until now.

If you want to use the calculator, simply enter `=` followed by the calculation formula within the input method:

![Simple Calculator](/image/demo/luaCalculator.webp)

Of course, `=` can be changed to other letters, and you can override the `recognizer/expression` configuration item.

If you don't want to use the calculator, you can disable it through custom configuration. For example, using the `double_pinyin_flypy.custom.yaml` file, add the following content:
```yaml
patch:
  # Close the simple calculator
  "recognizer/patterns/expression": ""
```