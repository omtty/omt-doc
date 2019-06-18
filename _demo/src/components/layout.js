import React from "react";
import { Layout, Menu, Row, Col } from "antd";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;
import ScrollBar from "react-custom-scrollbars";
import CodeBlock from "./code-block";

export function queryStringParse(href) {
  let mode = "",
    keyValue = "";
  const keyValues = [];
  for (let i = 0; i < href.length; i++) {
    const chr = href.substr(i, 1);
    switch (chr) {
      case "#":
      case "&":
      case "?":
        if (mode === "?") {
          if (keyValue.length > 0) {
            keyValues.push(keyValue);
            keyValue = "";
          }
        } else {
          keyValue = "";
        }
        if (chr === "#") {
          mode = "#";
        } else if (chr === "?") {
          mode = "?";
        }
        break;
      case "/":
        break;
      default:
        if (mode === "?") {
          keyValue += chr;
        }
        break;
    }
  }

  if (keyValue.length > 0) {
    keyValues.push(keyValue);
  }

  return keyValues.reduce((total, next) => {
    const components = next.split("=");
    if (components.length === 2) {
      return {
        ...total,
        [components[0]]: components[1]
      };
    } else {
      return total;
    }
  }, {});
}

export default class AppLayout extends React.Component {
  state = {
    id: "0"
  };
  render() {
    return (
      <Layout style={{ height: "100%" }}>
        <Header style={{ paddingLeft: 23 }}>
          <div>
            <img src="/public/logo.png" />
          </div>
        </Header>
        <Layout>
          <Sider
            width={260}
            style={{
              background: "#fff"
            }}>
            <ScrollBar>
              <Menu
                onSelect={({ item, key, keyPath, selectedKeys, domEvent }) => {
                  window.location.href = "/public/index.html?id=" + key;
                }}
                mode="inline"
                selectedKeys={[this.state.id]}
                defaultOpenKeys={["components"]}
                style={{ height: "100%", borderRight: 0 }}>
                {this.getMenus("components")}
              </Menu>
            </ScrollBar>
          </Sider>
          <Layout style={{ paddingLeft: 10 }}>
            <Content
              style={{
                background: "#fff",
                padding: 0,
                margin: 0,
                minHeight: 280
              }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  padding: 10,
                  background: "white"
                }}>
                {this.getContent(this.state.id)}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }

  componentDidMount() {
    const id = queryStringParse(window.location.href)["id"];
    if (id) {
      this.setState({ id: id });
    } else {
      const components = window.getOmtDocs("components");
      if (components.length > 0) {
        this.setState({ id: components[0].id });
      }
    }
  }

  getMenus = type => {
    const components = window.getOmtDocs(type).sort((a, b) => {
      return parseInt(a.header.order) - parseInt(b.header.order);
    });
    const groups = new Set();
    components.forEach(component => {
      groups.add(component.header.category);
    });
    const menus = [];
    [...groups].forEach(group => {
      const subMenus = [];
      components.forEach(component => {
        if (component.header.category === group) {
          subMenus.push(
            <Menu.Item key={component.id}>{component.header.title}</Menu.Item>
          );
        }
      });
      if (group)
        menus.push(<MenuItemGroup title={group}>{subMenus}</MenuItemGroup>);
      else menus.push(...subMenus);
    });
    const title = type.replace(/( |^)[a-z]/g, L => L.toUpperCase());
    return (
      <SubMenu title={title} key={type}>
        {menus}
      </SubMenu>
    );
  };

  getContent = id => {
    let component = null;
    const coms = window.getOmtDocs("components") || [];
    [...coms].concat().forEach(com => {
      if (com.id === id) {
        component = com;
      }
    });

    const codeBocks = [];
    if (component && component.children) {
      let cols = component.header.cols || 2;
      const childComponents = (component.children || []).sort((a, b) => {
        return parseInt(a.header.order) - parseInt(b.header.order);
      });
      if (childComponents.length == 1) {
        cols = 1;
      }
      const partitions = [];
      childComponents.forEach((item, index) => {
        if (!partitions[index % cols]) {
          partitions[index % cols] = [];
        }
        partitions[index % cols].push(item);
      });
      partitions.forEach(partition => {
        const cbs = [];
        partition.forEach(item => {
          const jsxs = item.jsxs;
          const jsxSources = item.jsxSources;
          for (let index = 0; index < jsxs.length; index++) {
            cbs.push(
              <CodeBlock
                title={item.header.title}
                jsx={jsxs[index]}
                source={jsxSources[index]}
                html={item.html}
              />
            );
          }
        });
        codeBocks.push(<Col span={parseInt(24 / cols)}>{cbs}</Col>);
      });
    }

    return component ? (
      <div>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: component.html }}
        />
        {codeBocks.length > 0 ? (
          <div className="markdown-body" style={{ marginTop: 18 }}>
            <h2 id="代码演示">代码演示</h2>
          </div>
        ) : null}
        {codeBocks.length > 0 ? (
          <Row gutter={10} style={{ marginTop: 15, marginBottom: 15 }}>
            {codeBocks}
          </Row>
        ) : null}
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: component.api }}
        />
      </div>
    ) : null;
  };
}
