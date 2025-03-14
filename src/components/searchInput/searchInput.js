import { Component } from "react";
import { Input } from "antd";
import debounce from "lodash.debounce";

export default class SearchInput extends Component {
  onSearch = (e) => {
    const { searchQuery } = this.props;
    const searchValue = e.target.value.trim();
    searchQuery(searchValue);
  };

  render() {
    return (
      <Input
        placeholder="Type to search..."
        onChange={debounce(this.onSearch, 500)}
      />
    );
  }
}
