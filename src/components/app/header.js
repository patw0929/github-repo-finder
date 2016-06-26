import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import querystring from 'querystring';
import config from '../../config';
import { loginUser, logoutUser } from '../../actions';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleLogin() {
    let code;
    window.location.href = `https://github.com/login/oauth/authorize?
client_id=${config.client_id}&scope=user,repo&redirect_uri=${config.redirect_uri}`;
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
          <Link to="/repos" className="nav-link">Search</Link>
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
      <header className="navbar navbar-fixed-top navbar-inverse">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">
            GitHub Repo Finder
          </Link>
        </div>

        <div className="container">
          <nav className="navbar-collapse collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              {this.renderLinks()}
              <li className="nav-item">
                <Link to="about" className="nav-link">About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
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
)(Header);
