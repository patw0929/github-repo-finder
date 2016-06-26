import React from 'react';
import { Link } from 'react-router';

const Pager = ({ isNotEmpty, pages: { prev, next }, keyword, onChangePage }) => {
  if (!isNotEmpty) {
    return null;
  }

  return (
    <ul className="pager">
      <li className={'previous ' + (!prev ? 'disabled' : '')}>
        <Link to={ prev ? `/repos/${keyword}/${prev}` : '' }
          onClick={(e) => {onChangePage(e, prev)} }>Previous</Link>
      </li>
      <li className={'next ' + (!next ? 'disabled' : '')}>
        <Link to={ next ? `/repos/${keyword}/${next}` : '' }
          onClick={ (e) => {onChangePage(e, next)} }>Next</Link>
      </li>
    </ul>
  );
};

export default Pager;
