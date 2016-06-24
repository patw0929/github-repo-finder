import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getUser, searchRepos, enterKeyword } from '../actions';
import ListItem from './repo/listItem';

class Repo extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const page = this.props.params.page || 1;
    if (this.props.authenticated) {
      this.props.getUser();

      if (this.props.keyword) {
        this.props.searchRepos(this.props.keyword, page);
      }
    }
  }

  onChangePage(e, page) {
    if (page && page !== this.props.params.page) {
      this.props.searchRepos(this.props.keyword, page);
    } else {
      e.preventDefault();
    }
    e.target.blur();
  }

  renderRepos() {
    if (this.props.repos.length === 0) {
      return (
        <p>No result.</p>
      );
    }

    return this.props.repos.map(repo => {
      return (
        <ListItem repo={repo} key={repo.id} />
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

  handleSearch(e) {
    e.preventDefault();

    const page = this.props.params.page || 1;

    if (this.props.keyword) {
      this.props.searchRepos(this.props.keyword, page);
    }
  }

  handleChangeKeyword(e) {
    this.props.enterKeyword(e.target.value);
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

        <form className="search-form form-inline" onSubmit={(e) => {this.handleSearch(e)}}>
          <div className="form-group">
            <input type="search" value={this.props.keyword}
              onChange={(e) => {this.handleChangeKeyword(e)}}
              className="search-input form-control"
              placeholder="Please enter the keywords..."
            />
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
    keyword: state.repos.keyword,
    repos: state.repos.repos,
    pages: state.repos.pages,
  };
}

export default connect(mapStateToProps,
  {
    getUser,
    searchRepos,
    enterKeyword,
  })(Repo);
