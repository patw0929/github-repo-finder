import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getUser, fetchStarredRepos } from '../actions';

class Repo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const page = this.props.params.page || 1;
    if (this.props.authenticated) {
      this.props.getUser();
      this.props.fetchStarredRepos(page);
    }
  }

  onChangePage(e, page) {
    if (page && page !== this.props.params.page) {
      this.props.fetchStarredRepos(page);
    } else {
      e.preventDefault();
    }
    e.target.blur();
  }

  renderRepos() {
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

  renderPages() {
    if (this.props.pages) {
      const { prev, next } = this.props.pages;

      return (
        <ul className="pager">
          <li className={'previous ' + (!prev ? 'disabled' : '')}>
            <Link to={ prev ? '/repos/' + prev : '' }
              onClick={(e) => {this.onChangePage(e, prev)} }>Previous</Link>
          </li>
          <li className={'next ' + (!next ? 'disabled' : '')}>
            <Link to={ next ? '/repos/' + next : '' }
              onClick={ (e) => {this.onChangePage(e, next)} }>Next</Link>
          </li>
        </ul>
      );
    }
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

        {this.renderPages()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
    user: state.user,
    repos: state.repos.repos,
    pages: state.repos.pages,
  };
}

export default connect(mapStateToProps,
  {
    getUser,
    fetchStarredRepos,
  })(Repo);
