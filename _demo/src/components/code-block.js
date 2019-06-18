import React from "react";
import { Tooltip } from "antd";

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showCode: false,
      jsxComponent: this.props.jsx ? this.props.jsx() : null
    };
  }

  componentDidUpdate(preProps, preState, snapshot) {
    if (preProps.jsx !== this.props.jsx) {
      this.setState({ jsxComponent: this.props.jsx ? this.props.jsx() : null });
    }
  }

  render() {
    return (
      <div
        style={{
          border: "1px solid #f3f3f3",
          paddingTop: 15,
          marginBottom: 15
        }}>
        <div style={{ paddingLeft: 10, paddingRight: 10}}>
          {this.state.jsxComponent}
        </div>
        <div
          style={{
            position: "relative",
            height: 1,
            background: "#f3f3f3",
            marginTop: 15,
            marginBottom: 15
          }}>
          <div
            style={{
              color: "black",
              top: -10,
              position: "absolute",
              left: 10,
              fontWeight: 600,
              background: "white"
            }}>
            {this.props.title}
          </div>
        </div>
        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <div
            className="margin-tb-zero markdown-body"
            dangerouslySetInnerHTML={{ __html: this.props.html || '作者没有留下任何描述' }}
          />
        </div>
        <div
          style={{
            marginTop: 10,
            border: "1px dashed #f3f3f3",
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: this.state.showCode ? 1 : 0,
            height: 40,
            lineHeight: "40px",
            textAlign: "center"
          }}>
          <Tooltip title={!this.state.showCode ? "显示代码" : "收起代码"}>
            <img
              onClick={() => {
                this.setState(state => {
                  return {
                    showCode: !state.showCode
                  };
                });
              }}
              style={{ cursor: "pointer" }}
              src={
                !this.state.showCode
                  ? "https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
                  : "https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
              }
              width={20}
            />
          </Tooltip>
        </div>
        <div
          className="markdown-body"
          style={{ display: this.state.showCode ? "block" : "none" }}>
          <pre>
            <code class="language-jsx">{this.props.source}</code>
          </pre>
        </div>
      </div>
    );
  }
}
