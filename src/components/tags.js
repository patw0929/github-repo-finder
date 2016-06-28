import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { searchReposByTag } from '../actions';
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
    const { repos } = this.props;

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
  };
}

export default connect(mapStateToProps, { searchReposByTag })(Tags);
