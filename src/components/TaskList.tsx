import React from 'react';
import { useTaskStore, Task, selectFilteredTasks, FilterValues } from '../store/taskStore';
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

const TaskList: React.FC = () => {
  const tasks = useTaskStore(selectFilteredTasks); // Get filtered tasks
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const currentFilter = useTaskStore(state => state.currentFilter);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside the list
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return; // Dropped in the same place
    }

    // IMPORTANT: Reordering is only allowed/makes sense on lists that reflect the main mutable order.
    // Reordering on DELETED view is disabled.
    // Reordering on other filtered views will reorder within the master list of active tasks.
    if (currentFilter === FilterValues.DELETED) {
        console.warn("Reordering is disabled for the Recycle Bin view.");
        return;
    }

    reorderTasks(source.index, destination.index);
  };

  // Disable DND for recycle bin view
  const isDndDisabled = currentFilter === FilterValues.DELETED;

  if (tasks.length === 0) {
    let message = "No tasks yet. Add one above!";
    if (currentFilter === FilterValues.COMPLETED) message = "No completed tasks.";
    if (currentFilter === FilterValues.ACTIVE) message = "No active tasks.";
    if (currentFilter === FilterValues.IMPORTANT) message = "No important tasks marked.";
    if (currentFilter === FilterValues.DELETED) message = "Recycle bin is empty.";
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="taskListDroppable" isDropDisabled={isDndDisabled}>
        {(provided) => (
          <div
            id="task-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task: Task, index: number) => (
              <TaskItem
                key={task.id} // react-beautiful-dnd requires key to be same as draggableId
                task={task}  // Pass the whole task object
                index={index} // Pass index for Draggable
                isDndDisabled={isDndDisabled}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
