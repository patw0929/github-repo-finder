import React from 'react';
import ListItem from './listItem';

const List = ({ isEmpty, keyword, repos }) => {
  if (isEmpty) {
    if (keyword !== '') {
      return (
        <div className="repos-list--empty">
          <p>No result.</p>
        </div>
      );
    }

    return (
      <div className="repos-list--empty">
        <p>Please enter some keyword to search.</p>
      </div>
    );
  }

  const listItems = repos && repos.map(repo => {
    return (
      <ListItem repo={repo} key={repo.id} />
    );
  });

  return (
    <div className="repos-list">
      {listItems}
    </div>
  );
};

export default List;
