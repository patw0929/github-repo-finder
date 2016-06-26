import React from 'react';

const InfoTagList = ({ tags }) => {
  if (!tags || !tags.length) {
    return null;
  }

  return (
    <div className="info-tags">
      <span className="glyphicon glyphicon-tags"></span>
      <ul className="info-tags__list">
        {tags && tags.map(tag => {
          return <li key={tag.tag} className="info-tags__list-item">{tag.tag}</li>;
        })}
      </ul>
    </div>
  );
};

export default InfoTagList;
