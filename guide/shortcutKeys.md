---
layout: doc
title: 输入法快捷键
aside: true
---
# 输入法的快捷键
Rime框架在桌面端支持设置快捷键，快捷键也就是我们输入法呼出时候，可以选择按不同的按键到达： 候选词翻页、模式选择。

自带的快捷键在小狼毫、鼠须管内置的`default.yaml`内可以看到：
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
其中，`when`代表的是输入法下不同的模式：
- `has_menu`: 输入法出现菜单的时候；
- `always`: 任意输入模式；
- `composing`: 输入法为组合状态。



## 薄荷拼音的快捷键
薄荷拼音的快捷键，默认的配置比较简单：
- 最初是使用`[、]`进行上下页的翻页；
- 在2023.09.15后，增加`-、=`进行翻页。

`default.custom.yaml`是全局的配置；而薄荷拼音没有启动全局的配置，使用的是在`rime_mint.schema.yaml`内添加配置：
```yaml
key_binder:
  bindings:
    - {accept: "Control+Shift+E", toggle: emoji_suggestion, when: always}
    - {accept: "Control+Shift+1", toggle: simplification, when: has_menu}
    - {accept: bracketleft, send: Page_Up, when: paging}      # 使用`[`进行向上翻页（第一页时候无效）
    - {accept: bracketright, send: Page_Down, when: has_menu} # 使用`]`进行向下翻页
    - {accept: minus, send: Page_Up, when: paging}     # 使用`-`进行向上翻页（第一页时候无效）
    - {accept: equal, send: Page_Down, when: has_menu} # 使用`=`进行向下翻页
```

你可以选择更改`rime_mint.custom.yaml`来覆盖`rime_mint.schema.yaml`，或者直接修改`rime_mint.schema.yaml`。

## 快捷键映射
支持映射的`accept`如下：
`accept` 和 `send` 可用字段除A-Za-z0-9外，还可以包含键盘上实际的所有按键：
```yaml
BackSpace	退格
Tab	水平定位符
Linefeed	换行
Clear	清除
Return	回車
Pause	暫停
Sys_Req	印屏
Escape	退出
Delete	刪除
Home	原位
Left	左箭頭
Up	上箭頭
Right	右箭頭
Down	下箭頭
Prior、Page_Up	上翻
Next、Page_Down	下翻
End	末位
Begin	始位
Shift_L	左Shift
Shift_R	右Shift
Control_L	左Ctrl
Control_R	右Ctrl
Meta_L	左Meta
Meta_R	右Meta
Alt_L	左Alt
Alt_R	右Alt
Super_L	左Super
Super_R	右Super
Hyper_L	左Hyper
Hyper_R	右Hyper
Caps_Lock	大寫鎖
Shift_Lock	上檔鎖
Scroll_Lock	滾動鎖
Num_Lock	小鍵板鎖
Select	選定
Print	列印
Execute	執行
Insert	插入
Undo	還原
Redo	重做
Menu	菜單
Find	蒐尋
Cancel	取消
Help	幫助
Break	中斷
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
KP_Space	小鍵板空格
KP_Tab	小鍵板水平定位符
KP_Enter	小鍵板回車
KP_Delete	小鍵板刪除
KP_Home	小鍵板原位
KP_Left	小鍵板左箭頭
KP_Up	小鍵板上箭頭
KP_Right	小鍵板右箭頭
KP_Down	小鍵板下箭頭
KP_Prior、KP_Page_Up	小鍵板上翻
KP_Next、KP_Page_Down	小鍵板下翻
KP_End	小鍵板末位
KP_Begin	小鍵板始位
KP_Insert	小鍵板插入
KP_Equal	小鍵板等於
KP_Multiply	小鍵板乘號
KP_Add	小鍵板加號
KP_Subtract	小鍵板減號
KP_Divide	小鍵板除號
KP_Decimal	小鍵板小數點
KP_0	小鍵板0
KP_1	小鍵板1
KP_2	小鍵板2
KP_3	小鍵板3
KP_4	小鍵板4
KP_5	小鍵板5
KP_6	小鍵板6
KP_7	小鍵板7
KP_8	小鍵板8
KP_9	小鍵板9
```

通过上面的组合就可以实现非常多自定义的功能，比如有人喜欢将 ; 绑定到第二个候选词：
```json
{ when: has_menu, accept: ";", send: 2 }
```
这样当候选词出现在第二位时，直接按下 ; 就可以输入。

参考自：
- [Rime 输入法中的快捷键](https://einverne.github.io/post/2021/10/rime-shortcut.html)
- [Schema.yaml 詳解](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md)