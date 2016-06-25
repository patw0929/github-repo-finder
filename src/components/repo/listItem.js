import React from 'react';
import DetailView from './detailView';
import { truncate } from '../../utils';

const ListItem = (props) =>
  <div className="repo-card">
    <div className="repo-card__header">
      <h4 className="repo-card__title">
        <a href={props.repo.html_url} target="_blank">{props.repo.name}</a>
      </h4>

      <p className="repo-card__desc">
        {truncate.call(props.repo.description, 200, true)}
      </p>
    </div>

    <div className="repo-card__info">
      <div className="info-star">
        <span className="glyphicon glyphicon-star"></span> {props.repo.stargazers_count}
      </div>

      <div className="info-author">
        <span className="glyphicon glyphicon-user"></span> {props.repo.owner.login}
      </div>

      <DetailView name={props.repo.name}
        description={props.repo.description}
        owner={props.repo.owner.login}
      />
    </div>
  </div>;

export default ListItem;
