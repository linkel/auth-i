import React, { Component } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Auth from './components/Auth';
import axios from 'axios';

axios.defaults.withCredentials = true; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users : []
    }
  }
  componentDidMount() {
    console.log("is this happening?")
    axios // POST REQ
    .get('http://localhost:5000/api/users')
    .then(response => {
        console.log(response)
    })
    .catch(err => {
        console.log(err)
    })
  }
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
