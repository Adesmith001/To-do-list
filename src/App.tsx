import React, { useState, useEffect } from 'react'; // Added useEffect
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import { useTaskStore } from './store/taskStore'; // Import the store
import './App.css';

function App() {
  const clearCompletedTasks = useTaskStore((state) => state.clearCompletedTasks);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTaskStore((state) => state.theme); // Get theme from store

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]); // Update body attribute when theme changes

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container"> {/* Container will pick up themed styles via CSS variables */}
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        <TaskForm />
        <TaskList />
        <button id="clear-completed" onClick={clearCompletedTasks}>
          Clear Completed (Soft Delete)
        </button>
      </main>
    </div>
  );
}

export default App;
