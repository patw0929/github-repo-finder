import React from 'react';

const TagList = ({ tags, type }) => {
  if (!tags || !tags.length) {
    return null;
  }

  return (
    <div>
      <h5>{ type === 'public' ? 'Community Tags' : 'My Private Tags' }</h5>

      <div className="detail-tags">
        {tags && tags.map(tag => {
          return (<span className="detail-tag label label-success"
            key={tag.id}>{tag.tag} <i>{tag.count}</i></span>)
        })}
      </div>

      <hr />
    </div>
  );
};

export default TagList;
