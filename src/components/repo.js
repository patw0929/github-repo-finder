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
          <div className="repo-card__header">
            <h4 className="repo-card__title">
              <a href={repo.html_url} target="_blank">{repo.name}</a>
            </h4>

            <p className="repo-card__desc">
              {repo.description}
            </p>
          </div>

          <div className="repo-card__info">
            <span className="info-star glyphicon glyphicon-star">
              {repo.stargazers_count}
            </span>

            <span className="info-author glyphicon glyphicon-user">
              {repo.owner.login}
            </span>
          </div>
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

  renderUserInfo() {
    const { login, name } = this.props.user;

    if (login && name) {
      return (
        <div className="well">Hello {name} ({login})!</div>
      );
    }

    return null;
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <div>Please login first.</div>
      );
    }

    return (
      <div>
        {this.renderUserInfo()}

        <form className="search-form form-inline">
          <div className="form-group">
            <input type="search" className="search-input form-control" placeholder="Please enter the keywords..." />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>

        {this.renderPages()}

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
