import React from 'react';
import { submitOrder } from '../services/pubsubService.js'
import { validateOrderAsync, parseJsonOrder } from '../services/0xService.js'

export default class OrderImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const jsonOrder = JSON.parse(this.state.value);
    parseJsonOrder(jsonOrder)
      .then(validateOrderAsync)
      .then(() => submitOrder(jsonOrder))
      .then(() => this.setState({ value: '' }))
      .catch(e => {
        console.error(e);
        alert(e);
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p> Submit Order JSON: </p>
        <textarea value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Submit order" />
      </form>
    );
  }
}