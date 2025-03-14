import React, { Component } from "react";
import { Tabs } from "antd";

export default class Pages extends Component {
  items = [
    {
      key: "search",
      label: "Search",
    },
    {
      key: "rated",
      label: "Rated",
    },
  ];
  render() {
    return <Tabs defaultActiveKey="search" items={this.items} />;
  }
}
