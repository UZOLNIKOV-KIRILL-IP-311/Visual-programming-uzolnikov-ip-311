import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav style={{ 
      padding: '10px', 
      borderRight: '1px solid #ccc', 
      minWidth: '100px',
      background: ' #999999'
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
          <NavLink 
            to="/comments" 
            style={{ textDecoration: 'none' }} 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Comments
          </NavLink>
        </li>
        <li style={{ margin: '10px 0' }}>
          <NavLink 
            to="/posts" 
            style={{ textDecoration: 'none' }} 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Posts
          </NavLink>
        </li>
        <li style={{ margin: '10px 0' }}>
          <NavLink 
            to="/albums" 
            style={{ textDecoration: 'none' }} 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Albums
          </NavLink>
        </li>
        <li style={{ margin: '10px 0' }}>
          <NavLink 
            to="/todos" 
            style={{ textDecoration: 'none' }} 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Todos
          </NavLink>
        </li>
        <li style={{ margin: '10px 0' }}>
          <NavLink 
            to="/users" 
            style={{ textDecoration: 'none' }} 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Users
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;