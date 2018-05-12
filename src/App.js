import React, { Component } from 'react';
import './App.css';
import OrderImport from './components/OrderImport.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to POLINET</h1>
        </header>

        <OrderImport/>
      </div>
    );
  }
}

export default App;
