import React from 'react';

const ListItem = (props) =>
  <div className="repo-card">
    <div className="repo-card__header">
      <h4 className="repo-card__title">
        <a href={props.repo.html_url} target="_blank">{props.repo.name}</a>
      </h4>

      <p className="repo-card__desc">
        {props.repo.description}
      </p>
    </div>

    <div className="repo-card__info">
      <span className="info-star glyphicon glyphicon-star">
        {props.repo.stargazers_count}
      </span>

      <span className="info-author glyphicon glyphicon-user">
        {props.repo.owner.login}
      </span>
    </div>
  </div>;

export default ListItem;
