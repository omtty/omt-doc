---
title: BooleanTrigger 自定义Modal的onCancel和onOk事件
order: 3
---

自定义 Modal 的 onCancel 和 onOk 事件

```jsx omt-doc-jsx
import React from "react";
import BooleanTrigger from "boolean-trigger";
import { Button, Modal } from "antd";

class MyModal extends React.Component {
  state = {
    loading: false
  };
  render() {
    return (
      <Modal
        confirmLoading={this.state.loading}
        visible={this.props.visible}
        title="我是一个Dialog"
        onCancel={this.props.onCancel}
        onOk={() => {
          this.setState({ loading: true });
          this.props.onOk("我是一个返回结果").then(response => {
            this.setState({ loading: false });
          });
        }}>
        我是一个模态对话框
      </Modal>
    );
  }
}

class BooleanTriggerDemo extends React.Component {
  render() {
    return (
      <BooleanTrigger>
        <Button
          type="primary"
          onClick={event => {
            alert("触发器");
          }}>
          我是一个模态对话框触发器
        </Button>
        <MyModal
          onOk={response => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 3000);
            });
          }}
        />
      </BooleanTrigger>
    );
  }
}

ReactDOM.render(<BooleanTriggerDemo />);
```
