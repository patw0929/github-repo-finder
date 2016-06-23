import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import querystring from 'querystring';
import config from '../config';
import { loginUser, logoutUser } from '../actions';
import '../style/style.scss';

class App extends Component {
  handleLogin() {
    let code;
    console.log(config);
    window.location.href = `https://github.com/login/oauth/authorize?
client_id=${config.client_id}&scopes=user&redirect_uri=${config.redirect_uri}`;
  }

  handleLogout() {
    this.props.logoutUser();
  }

  componentWillMount() {
    const query = window.location.search.substring(1);
    const code = querystring.parse(query).code;
    if (code) {
      this.props.loginUser(code);
    }
  }

  render() {
    let userTab = (
      <a onClick={this.handleLogin.bind(this)} className="nav-link">Login</a>
    );

    if (this.props.token) {
      userTab = (
        <a onClick={this.handleLogout.bind(this)} className="nav-link">Logout</a>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
          <Link className="navbar-brand" to="/">
            GitHub Starred Project Viewer
          </Link>

          <ul className="nav navbar-nav">
            <li className="nav-item">
              {userTab}
            </li>
            <li className="nav-item">
              <Link to="about" className="nav-link">About</Link>
            </li>
          </ul>
        </nav>

        <main class="container">
          {this.props.children}
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
  };
}

export default connect(
  mapStateToProps,
  {
    loginUser,
    logoutUser,
  }
)(App);
