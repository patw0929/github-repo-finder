import React from 'react';
import { connect } from 'react-redux';
import { removeTag } from '../../actions';

class TagList extends React.Component {
  constructor(props) {
    super(props);
  }

  handleRemove(id) {
    if (confirm('Do you really want to remove this tag?')) {
      this.props.removeTag(this.props.repo, id);
    }
  }

  renderDeleteBtn(id, type = 'public') {
    if (type === 'public') {
      return;
    }

    return (
      <a className="detail-tags__remove"
        onClick={() => {this.handleRemove(id)}}>✖</a>
    );
  }

  render() {
    const { tags, type } = this.props;

    if (!tags || !tags.length) {
      return null;
    }

    return (
      <div>
        <h5>{ type === 'public' ? 'Community Tags' : 'Tagged by me' }</h5>

        <div className="detail-tags">
          {tags && tags.map(tag => {
            return (
              <span className="detail-tag label label-success"
                key={tag.id}>{tag.tag}
                 {this.renderDeleteBtn(tag.id, type)}
              </span>)
          })}
        </div>

        <hr />
      </div>
    );
  }
}

export default connect(null, { removeTag })(TagList);
