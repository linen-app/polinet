import React from 'react';
import { submitOrder } from '../pubsub.js'

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
    submitOrder(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p> Order JSON: </p>
        <textarea value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Submit order" />
      </form>
    );
  }
}