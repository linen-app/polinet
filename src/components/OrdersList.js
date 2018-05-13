import React from 'react';
import { subscribe } from '../services/pubsubService.js'
import { parseJsonOrder, convertToJson } from '../services/dharmaService.js';
import './OrdersList.css'

class OrderRow extends React.Component {
    render() {
        const order = this.props.order;
        const hash = order.hash;

        return (
            <tr>
                <td className="div-table-col">{hash}</td>
                <td className="div-table-col">{JSON.stringify(order)}</td>
            </tr>
        );
    }
}

class OrderTable extends React.Component {
    render() {
        const filterText = this.props.filterText;

        const rows = [];

        Object.values(this.props.orders).forEach((order) => {
            if (order.hash.indexOf(filterText) === -1) {
                return;
            }
            rows.push(
                <OrderRow
                    order={convertToJson(order)}
                    key={order.hash}
                />
            );
        });

        return (
            <table className="div-table">
                <thead>
                    <tr>
                        <th className="div-table-col">Order Hash</th>
                        <th className="div-table-col">Order JSON</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }

    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }

    render() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    onChange={this.handleFilterTextChange}
                />
            </form>
        );
    }
}

export default class OrdersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            orders: {}
        };

        subscribe(message => {
            parseJsonOrder(message).then((order) => {
                this.setState(prevState => ({
                    orders: {...prevState.orders, [order.hash]: order}
                }))
            });
        });

        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    onFilterTextChange={this.handleFilterTextChange}
                />
                <OrderTable
                    orders={this.state.orders}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }
}