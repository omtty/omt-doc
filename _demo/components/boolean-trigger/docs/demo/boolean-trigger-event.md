---
title: BooleanTrigger 自定义粗发按钮事件
order: 2
---

自定义粗发按钮事件

```jsx omt-doc-jsx
import React from "react";
import { Button, Modal } from "antd";
import BooleanTrigger from "boolean-trigger";

class BooleanTriggerDemo extends React.Component {
  render() {
    return (
      <BooleanTrigger>
        <Button
          type="primary"
          onClick={(next, event) => {
            alert("触发器");
          }}>
          我是一个模态对话框触发器
        </Button>
        <Modal title="我是一个Dialog">我是一个模态对话框</Modal>
      </BooleanTrigger>
    );
  }
}

ReactDOM.render(<BooleanTriggerDemo />);
```
