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

  renderLinks() {
    if (this.props.authenticated) {
      return [
        <li key="repos" className="nav-item">
          <Link to="repos" className="nav-link">Starred Repos</Link>
        </li>,
        <li key="logout" className="nav-item">
          <a onClick={this.handleLogout.bind(this)} className="nav-link">Logout</a>
        </li>
      ];
    }

    return (
      <li className="nav-item">
        <a onClick={this.handleLogin.bind(this)} className="nav-link">Login</a>
      </li>
    );
  }

  render() {
    return (
      <div>
        <header className="navbar navbar-fixed-top navbar-inverse">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">
              GitHub Starred Project Viewer
            </Link>
          </div>

          <div className="container">
            <nav className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                {this.renderLinks()}
                <li className="nav-item">
                  <Link to="about" className="nav-link">About</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container">
          {this.props.children}
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
  };
}

export default connect(
  mapStateToProps,
  {
    loginUser,
    logoutUser,
  }
)(App);
