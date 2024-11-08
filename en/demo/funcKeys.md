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
- Time printing
- Week printing
- Date printing
- Capitalized Chinese currency printing

## Time Printing

Within the input method, simply input the keyword "`time`," and the input method will automatically generate a sentence based on the current time using a Lua script:
![Time Printing](/image/demo/timeKey.webp)

## Week Printing

Similar to the previous function, but the keyword is changed to "`week`":
![Week Printing](/image/demo/weekKey.webp)

## Date Printing

Keyword: "date":
![Date Printing](/image/demo/dateKey.webp)

## Capitalized Chinese Currency Printing

This feature of printing capitalized Chinese currency is quite interesting. It is activated by using the uppercase letter "`R`" and then inputting the numeric keys on the keyboard (the keys above the letters, not the ones on the numpad):
![Capitalized Chinese Currency](/image/demo/rmbKey.webp)

Afterward, to select a candidate, you can use the arrow keys for selection and the spacebar to select; you can also use `Ctrl` + `number key` to select.

## Lunar Date Printing/Conversion
If you want to print the lunar date, you need to know that the `"Chinese lunar calendar"` in English is: Chinese lunar calendar.

Therefore, I set the leading word for printing the lunar date to `lunar`. If you enter the leading word in the input method, you can output the lunar date of the current day.

If you want to query the lunar date of a certain day, you can use the leading letter `N`. Then enter the query date using the numeric keys.

![Lunar Date Printing/Conversion](/image/demo/luaLunar.webp)