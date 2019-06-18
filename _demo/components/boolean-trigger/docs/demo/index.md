---
title: BooleanTrigger 基本用法
order: 1
---

这是一个简单的按钮绑定一个Modal的事例

```jsx omt-doc-jsx
import React from 'react';
import BooleanTrigger from 'boolean-trigger';
import { Button, Modal } from 'antd';

class BooleanTriggerDemo extends React.Component {
  render() {
    return (
      <BooleanTrigger destoryOnClose>
        <Button type='primary'>我是一个模态对话框触发器</Button>
        <Modal title='我是一个Dialog'>
            我是一个模态对话框
        </Modal>
      </BooleanTrigger>
    );
  }
}

ReactDOM.render(<BooleanTriggerDemo />);
```