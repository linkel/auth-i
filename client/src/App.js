import React, { Component } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Auth from './components/Auth';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Successfully logged in!</h1>
          <button onClick={this.props.logOut}>Logout</button>
        </header>
      </div>
    );
  }
}

export default Auth(App)(Login);
