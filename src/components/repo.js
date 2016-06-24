import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser, fetchStarredRepos } from '../actions';

class Repo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.getUser();
      this.props.fetchStarredRepos();
    }
  }

  renderRepos() {
    console.log(this.props.repos);
    return this.props.repos.map(repo => {
      return (
        <div key={repo.id} className="repo-card">
          <h4 className="card-title">
            <a href={repo.html_url} target="_blank">{repo.name}</a>
          </h4>

          <p className="card-text">
            {repo.description}
          </p>
        </div>
      );
    });
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <div>Please login first.</div>
      );
    }

    const { login, name } = this.props.user;

    return (
      <div>
        <p>Hello {name}!</p>

        <div className="repos-list">
          {this.renderRepos()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
    user: state.user,
    repos: state.repos,
  };
}

export default connect(mapStateToProps,
  {
    getUser,
    fetchStarredRepos,
  })(Repo);
