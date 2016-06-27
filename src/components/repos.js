import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getUser, searchRepos, enterKeyword } from '../actions';
import List from './repos/list';
import Pager from './repos/pager';

class Repos extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const page = this.props.params.page || 1;
    const keyword = this.props.params.keyword;

    if (this.props.authenticated) {
      this.props.getUser();

      if (keyword) {
        this.props.searchRepos(this.props.params.keyword, page);
      }
    }

    this.updateKeywordFromURL();
  }

  updateKeywordFromURL() {
    const keyword = this.props.params.keyword;

    if (keyword) {
      this.props.enterKeyword(keyword);
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

  renderUserInfo() {
    const { login, name } = this.props.user;

    if (login && name) {
      return (
        <div className="well">Hello {name} ({login})!</div>
      );
    }

    return null;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.props.keyword) {
      this.props.searchRepos(this.props.keyword);
      this.context.router.push(`/repos/${this.props.keyword}`);
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

        <form className="search-form form-inline" onSubmit={(e) => {this.handleSubmit(e)}}>
          <div className="form-group">
            <input type="search" value={this.props.keyword}
              onChange={(e) => {this.handleChangeKeyword(e)}}
              className="search-input form-control"
              placeholder="Please enter the keywords..."
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>

        <Pager pages={this.props.pages}
          keyword={this.props.keyword}
          isNotEmpty={this.props.repos.length > 0}
          onChangePage={this.onChangePage.bind(this)}
        />

        <List isEmpty={this.props.repos.length === 0}
          repos={this.props.repos}
          keyword={this.props.params.keyword}
        />

        <Pager pages={this.props.pages}
          keyword={this.props.keyword}
          isNotEmpty={this.props.repos.length > 0}
          onChangePage={this.onChangePage.bind(this)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
    user: state.user,
    keyword: state.repos.keyword,
    repos: state.repos.items,
    pages: state.repos.pages,
  };
}

export default connect(mapStateToProps,
  {
    getUser,
    searchRepos,
    enterKeyword,
  })(Repos);
