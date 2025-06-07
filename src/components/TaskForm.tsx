import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';

const TaskForm: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (taskTitle.trim() === '') return;
    addTask(taskTitle.trim());
    setTaskTitle('');
  };

  return (
    <form id="task-form" onSubmit={handleSubmit} aria-labelledby="task-form-label">
      <h2 id="task-form-label" className="sr-only">Add new task</h2>
      <div className="task-input">
        <input
          type="text"
          id="task-title-input" // Changed ID to be more specific
          placeholder="Add a new task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
          aria-label="New task title" // Using aria-label as placeholder is sometimes not enough
        />
      </div>
      <button type="submit" aria-label="Add task"><i className='bx bx-plus'></i></button>
    </form>
  );
};

export default TaskForm;
