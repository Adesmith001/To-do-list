import React from 'react';
import { useTaskStore, Theme } from '../store/taskStore'; // Assuming Theme is exported

const ThemeToggleButton: React.FC = () => {
  const theme = useTaskStore((state) => state.theme);
  const toggleTheme = useTaskStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to \${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to \${theme === 'light' ? 'dark' : 'light'} mode`}
      className="theme-toggle-button"
    >
      <i className={`bx \${theme === 'light' ? 'bx-moon' : 'bx-sun'}`}></i>
    </button>
  );
};

export default ThemeToggleButton;
