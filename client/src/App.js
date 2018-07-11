import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
  }

  checkForLocalToken() {
    // Look in local storage for the token
    let token = localStorage.getItem('mernToken')
    if (!token) {
      // There was no token
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // We did find a token in localStorage
      // Send it to the back to be verified
      axios.post('/auth/me/from/token', {token}).then(result => {
        // Put the token in localStorage
        localStorage.setItem('mernToken', result.data.token);
        this.setState({
          token: result.data.token,
          user: result.data.user
        })
      }).catch(err => console.log(err))
    }
  }

  componentDidMount() {
    this.checkForLocalToken()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
