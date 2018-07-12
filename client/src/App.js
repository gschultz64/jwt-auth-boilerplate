import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import { UserProfile } from './UserProfile';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null,
      lockedResult: ''
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  liftTokenToState(data) {
    this.setState({
      token: data.token, 
      user: data.user
    })
  }

  handleClick(e) {
    e.preventDefault()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.token
    axios.get('/locked/test').then(result => {
      this.setState({
        lockedResult: result.data
      })
    })
  }

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('mernToken')
    // Remove the user info from the state
    this.setState({
      token: '',
      user: null
    })
  }

  checkForLocalToken() {
    // Look in local storage for the token
    let token = localStorage.getItem('mernToken')
    if (!token || token === 'undefined') {
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
    let user = this.state.user
    if (user) {
      return (
        <div className="App">
          <UserProfile user={user} logout={this.logout}/>
          <a onClick={this.handleClick}>Test the protected route</a>
          <p>{this.state.lockedResult}</p>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Login liftToken={this.liftTokenToState}/><br/>
          <Signup liftToken={this.liftTokenToState}/>
        </div>
      )
    }
    
  }
}

export default App;
