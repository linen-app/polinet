import React, { Component } from 'react';
import './App.css';
import OrderImport from './components/OrderImport.js'
import OrdersList from './components/OrdersList.js'
import PeerMonitor from './components/PeerMonitor.js'
import { initialize } from './services/pubsubService.js'

class App extends Component {
  componentDidMount() {
    initialize()
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to POLINET</h1>
        </header>
        <PeerMonitor />
        <OrderImport />
        <OrdersList />
      </div>
    );
  }
}

export default App;
