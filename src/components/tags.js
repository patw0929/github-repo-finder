import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { searchReposByTag, getRandomTags } from '../actions';
import DetailView from './repos/detailView';

class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: '',
    };
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    this.setState({
      tag: this.props.tag,
    });

    this.props.getRandomTags();
  }

  clickRandomTag(tag) {
    if (tag) {
      this.setState({
        tag,
      });
      this.props.searchReposByTag(tag, 1);
    }
  }

  handleChangeSearch(e) {
    this.setState({
      tag: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const tag = this.state.tag;
    this.props.searchReposByTag(tag, 1);
    this.context.router.push(`/tags/${tag}`)
  }

  render() {
    const { repos, randomTags } = this.props;

    return (
      <div>
        <form onSubmit={(e) => {this.handleSubmit(e)}}
          className="search-form form-inline">
          <div className="form-group">
            <input type="search"
              name="tag"
              placeholder="Please enter the tag..."
              className="search-input form-control"
              onChange={(e) => {this.handleChangeSearch(e)}}
              value={this.state.tag}
            />
            <button type="submit"
              className="btn btn-primary">Search</button>
          </div>

          <div className="random-tags">
            {randomTags && randomTags.map(tag => {
              return (
                <Link key={tag}
                  className="random-tags__tag label label-success"
                  to={`/tags/${tag}`}
                  onClick={() => {this.clickRandomTag(tag)}}>
                  {tag}
                </Link>
              );
            })}
          </div>
        </form>

        <hr />

        <div className="repos-list">
          {repos && repos.map(repo => {
            return (
              <div key={repo.outrepoid} className="repo-card">
                <div className="repo-card__header">
                  <h4 className="repo-card__title">
                    <a href={`https://github.com/${repo.outreponame}`}
                      target="_blank">{repo.outreponame}</a>
                  </h4>
                </div>

                <div className="repo-card__info">
                  <DetailView name={repo.outreponame.split('/')[1]}
                    owner={repo.outreponame.split('/')[0]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tag: state.tags.tag,
    repos: state.tags.repos,
    pages: state.tags.pages,
    randomTags: state.randomTags,
  };
}

export default connect(mapStateToProps, {
  searchReposByTag,
  getRandomTags,
})(Tags);
