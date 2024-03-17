# Shortcut Keys for Input Method

The Rime framework supports setting shortcut keys on the desktop. Shortcut keys refer to the different keys we can press when invoking the input method to achieve actions such as candidate word pagination and mode selection.

The built-in shortcut keys can be found in the `default.yaml` file within Squirrel and Weasel input methods:
```yaml
key_binder:
  bindings:
    - {accept: "Control+p", send: Up, when: composing}
    - {accept: "Control+n", send: Down, when: composing}
    - {accept: "Control+b", send: Left, when: composing}
    - {accept: "Control+f", send: Right, when: composing}
    - {accept: "Control+a", send: Home, when: composing}
    - {accept: "Control+e", send: End, when: composing}
    - {accept: "Control+d", send: Delete, when: composing}
    - {accept: "Control+k", send: "Shift+Delete", when: composing}
    - {accept: "Control+h", send: BackSpace, when: composing}
    - {accept: "Control+g", send: Escape, when: composing}
    - {accept: "Control+bracketleft", send: Escape, when: composing}
    - {accept: "Alt+v", send: Page_Up, when: composing}
    - {accept: "Control+v", send: Page_Down, when: composing}
    - {accept: ISO_Left_Tab, send: Page_Up, when: composing}
    - {accept: "Shift+Tab", send: Page_Up, when: composing}
    - {accept: Tab, send: Page_Down, when: composing}
    - {accept: minus, send: Page_Up, when: has_menu}
    - {accept: equal, send: Page_Down, when: has_menu}
    - {accept: comma, send: Page_Up, when: paging}
    - {accept: period, send: Page_Down, when: has_menu}
    - {accept: "Control+Shift+1", select: .next, when: always}
    - {accept: "Control+Shift+2", toggle: ascii_mode, when: always}
    - {accept: "Control+Shift+3", toggle: full_shape, when: always}
    - {accept: "Control+Shift+4", toggle: simplification, when: always}
    - {accept: "Control+Shift+5", toggle: extended_charset, when: always}
    - {accept: "Control+Shift+exclam", select: .next, when: always}
    - {accept: "Control+Shift+at", toggle: ascii_mode, when: always}
    - {accept: "Control+Shift+numbersign", toggle: full_shape, when: always}
    - {accept: "Control+Shift+dollar", toggle: simplification, when: always}
    - {accept: "Control+Shift+percent", toggle: extended_charset, when: always}
    - {accept: "Shift+space", toggle: full_shape, when: always}
    - {accept: "Control+period", toggle: ascii_punct, when: always}
```
In the above configuration, the `when` field represents different modes of the input method:
- `has_menu`: When the input method displays a menu.
- `always`: Any input mode.
- `composing`: When the input method is in the composing state.


## Shortcut Keys for Oh-My-Rime

The default configuration for shortcut keys in Oh-My-Rime is relatively simple:
- Initially, `[` and `]` were used for page up and page down.
- After September 15, 2023, `-` and `=` were added for page up and page down.

The `default.custom.yaml` file is the global configuration file. However, Oh-My-Rime does not have a global configuration file. Instead, you can add configurations in the `rime_mint.schema.yaml` file:
```yaml
key_binder:
  bindings:
    - {accept: "Control+Shift+E", toggle: emoji_suggestion, when: always}
    - {accept: "Control+Shift+1", toggle: simplification, when: has_menu}
    - {accept: bracketleft, send: Page_Up, when: paging}      # Use `[` for page up (does not work on the first page)
    - {accept: bracketright, send: Page_Down, when: has_menu} # Use `]` for page down
    - {accept: minus, send: Page_Up, when: paging}     # Use `-` for page up (does not work on the first page)
    - {accept: equal, send: Page_Down, when: has_menu} # Use `=` for page down
 ```
Yes, you have the option to either modify the `rime_mint.custom.yaml` file to override the settings in `rime_mint.schema.yaml`, or directly modify the rime_mint.schema.yaml file.

## Key Mapping
The supported mappings for `accept` are as follows:
The `accept` and `send` fields can contain all keys on the keyboard, in addition to A-Za-z0-9:
```yaml
BackSpace	Backspace
Tab	Tab
Linefeed	Linefeed
Clear	Clear
Return	Return
Pause	Pause
Sys_Req	Sys Req
Escape	Escape
Delete	Delete
Home	Home
Left	Left arrow
Up	Up arrow
Right	Right arrow
Down	Down arrow
Prior, Page_Up	Page Up
Next, Page_Down	Page Down
End	End
Begin	Begin
Shift_L	Left Shift
Shift_R	Right Shift
Control_L	Left Control
Control_R	Right Control
Meta_L	Left Meta
Meta_R	Right Meta
Alt_L	Left Alt
Alt_R	Right Alt
Super_L	Left Super
Super_R	Right Super
Hyper_L	Left Hyper
Hyper_R	Right Hyper
Caps_Lock	Caps Lock
Shift_Lock	Shift Lock
Scroll_Lock	Scroll Lock
Num_Lock	Num Lock
Select	Select
Print	Print
Execute	Execute
Insert	Insert
Undo	Undo
Redo	Redo
Menu	Menu
Find	Find
Cancel	Cancel
Help	Help
Break	Break
space
exclam	!
quotedbl	"
numbersign	#
dollar	$
percent	%
ampersand	&
apostrophe	'
parenleft	(
parenright	)
asterisk	*
plus	+
comma	,
minus	-
period	.
slash	/
colon	:
semicolon	;
less	<
equal	=
greater	>
question	?
at	@
bracketleft	[
backslash
bracketright	]
asciicircum	^
underscore	_
grave	`
braceleft	{
bar	|
braceright	}
asciitilde	~
KP_Space	Keypad Space
KP_Tab	Keypad Tab
KP_Enter	Keypad Enter
KP_Delete	Keypad Delete
KP_Home	Keypad Home
KP_Left	Keypad Left arrow
KP_Up	Keypad Up arrow
KP_Right	Keypad Right arrow
KP_Down	Keypad Down arrow
KP_Prior, KP_Page_Up	Keypad Page Up
KP_Next, KP_Page_Down	Keypad Page Down
KP_End	Keypad End
KP_Begin	Keypad Begin
KP_Insert	Keypad Insert
KP_Equal	Keypad Equal
KP_Multiply	Keypad Multiply
KP_Add	Keypad Add
KP_Subtract	Keypad Subtract
KP_Divide	Keypad Divide
KP_Decimal	Keypad Decimal
KP_0	Keypad 0
KP_1	Keypad 1
KP_2	Keypad 2
KP_3	Keypad 3
KP_4	Keypad 4
KP_5	Keypad 5
KP_6	Keypad 6
KP_7	Keypad 7
KP_8	Keypad 8
KP_9	Keypad 9
```

By using the combinations mentioned above, you can achieve a wide range of custom functionalities. For example, if someone wants to bind ";" to the second candidate word:
```json
{ "when": "has_menu", "accept": ";", "send": 2 }
```
This way, when the candidate word appears in the second position, you can directly press ";" to input it.


Reference from: 
- [Rime 输入法中的快捷键](https://einverne.github.io/post/2021/10/rime-shortcut.html)
- [Schema.yaml 詳解](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md)

## Mint Input left and right brackets

It should be noted that in the Mint input method, `[` and `]` are used by default to determine characters by words:
```yarm
engine:
  processors:
    - lua_processor@*select_character # Determine the character by word
```
So, if you want to use `[` and `]` for translation, taking Mint Pinyin (rime_mint.schema.yaml file) as an example, you can modify the `key_binder` in it to the following configuration:
```yarm
key_binder:
  import_preset: default
  # Define words with words
  select_first_character: "minus" # Use -
  select_last_character: "equal"  # use =
  bindings:
    - {accept: "Control+Shift+E", toggle: emoji_suggestion, when: always}
    - {accept: "Control+Shift+exclam", toggle: transcription, when: has_menu}
    - {accept: "Control+Shift+1", toggle: transcription, when: has_menu}
    - {accept: bracketleft, send: Page_Up, when: paging} # Use `[` to page up (invalid on the first page)
    - {accept: bracketright, send: Page_Down, when: has_menu} # Use `]` to page down
```

Reference issue: [https://github.com/Mintimate/oh-my-rime/issues/42](https://github.com/Mintimate/oh-my-rime/issues/42)