import React, { Component } from 'react'
import axios from 'axios'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value })
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.password.length < 8 || this.state.password.length > 99) {
      // Password does not meet length requirements
      this.setState({
        error: {
          type: 'auth_error',
          status: 401,
          message: 'Password must be between 8 and 99 characters.'
        },
        password: ''
      })
    } else {
      axios.post('/auth/signup', {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }).then(result => {
        localStorage.setItem('mernToken', result.data.token)
        this.props.liftToken(result.data)
      }).catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          Name: <input type="text" value={this.state.name} onChange={this.handleNameChange} /><br />
          Email: <input type="email" value={this.state.email} onChange={this.handleEmailChange} /><br />
          Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange} /><br />
          <input type="submit" value="Sign Up!" className="btn" />
        </form>
      </div>
    )
  }

}

export default Signup