---
category: 通用
order: 100
title: BooleanTrigger 布尔触发器
---

布尔触发器

## 何时使用

用于控制一个控件的 boolean 属性，常用的是一个按钮触发事件然后弹出 Modal 对话框

## API

### BooleanTriggerProps

| 参数            | 说明                                                                    | 类型                | 默认值     |
| --------------- | ----------------------------------------------------------------------- | ------------------- | ---------- |
| actionName      | 触发按钮的事件名称                                                      | string              | 'onClick'  |
| onnCancelName   | 取消事件名称                                                            | string              | 'onCancel' |
| onOkName        | 确认事件名称                                                            | string              | 'onOk'     |
| booleanPropName | 显示属性名称                                                            | string              | 'visible'  |
| children        | 子元素，必须包含两个子元素，第一个为触发元素，第二个为类 Modal 元素     | ReactElement[]      | 必填       |
| destoryOnClose  | 关闭时是否销毁元素                                                      | boolean             | false      |
| renderMode      | 用于控制元素创建时机，'default'为一开始就创建，'lazy'为第一次显示时创建 | 'default' \| 'lazy' | 'lazy'     |
