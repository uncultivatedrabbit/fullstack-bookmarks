  
import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav(props) {
  return (
    <nav className='Nav'>
      <Link className="btn" to={'/'}>
        Bookmark List
      </Link>
      {' '}
      <Link className="btn" to={'/add-bookmark'}>
        Add Bookmark
      </Link>
    </nav>
  );
}