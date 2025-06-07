import React from 'react';
import ThemeToggleButton from './ThemeToggleButton'; // Import the new component

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div> {/* Wrapper for menu icon and title */}
        <span
          id="menu-icon"
          className="bx bx-menu"
          onClick={onMenuClick}
          role="button"
          aria-label="Open menu"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onMenuClick(); }}
        ></span>
        <h1>To-Do List</h1>
      </div>
      <ThemeToggleButton /> {/* Add the button here */}
    </header>
  );
};

export default Header;
