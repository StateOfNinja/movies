import debounce from 'lodash.debounce';
import { Component } from 'react';
import { Input } from 'antd';

export default class SearchInput extends Component {
  onSearch = (e) => {
    const searchValue = e.target.value.trim();
    this.props.searchQuery(searchValue);
  };

  render() {
    return <Input placeholder="Type to search..." onChange={debounce(this.onSearch, 500)} />;
  }
}
