import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore, FilterValues, Task } from '../store/taskStore';
import { Draggable } from 'react-beautiful-dnd';

interface TaskItemProps {
  task: Task;
  index: number;
  isDndDisabled: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, isDndDisabled }) => {
  const { id, title, completed, isImportant, isDeleted } = task;

  const { /* ... store actions ... */
    toggleTask, softDeleteTask, restoreTask, permanentDeleteTask,
    toggleImportant, updateTaskTitle, currentFilter
  } = useTaskStore(state => ({
    toggleTask: state.toggleTask, softDeleteTask: state.softDeleteTask, restoreTask: state.restoreTask,
    permanentDeleteTask: state.permanentDeleteTask, toggleImportant: state.toggleImportant,
    updateTaskTitle: state.updateTaskTitle, currentFilter: state.currentFilter,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleSpanRef = useRef<HTMLSpanElement>(null);


  useEffect(() => {
    if (isEditing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [isEditing]);
  useEffect(() => { if (!isEditing) { setEditText(title); } }, [title, isEditing]);

  const handleTitleClick = () => { if (isDeleted || isDndDisabled || isEditing) return; setIsEditing(true); };
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (isDeleted || isDndDisabled || isEditing) return;
      setIsEditing(true);
      e.preventDefault(); // Prevent space from scrolling
    }
  };


  const handleSave = () => { /* ... same save logic ... */
    if (editText.trim() === "") setEditText(title);
    else if (editText.trim() !== title) updateTaskTitle(id, editText.trim());
    setIsEditing(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') { setEditText(title); setIsEditing(false); }
  };
  const handleInputBlur = () => {
    if (editText.trim() === "") setEditText(title);
    handleSave();
  };
  const handleToggleImportant = () => { if (isDeleted) return; toggleImportant(id); };

  const isInRecycleBinView = currentFilter === FilterValues.DELETED && isDeleted;

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDndDisabled || isEditing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          // {...provided.dragHandleProps} // Drag handle applied to this div by default
          className={`task-item \${completed && !isDeleted ? 'completed' : ''} \${isImportant && !isDeleted ? 'important' : ''} \${isDeleted ? 'deleted-visual-cue' : ''} \${snapshot.isDragging ? 'dragging' : ''}`}
          style={{ ...provided.draggableProps.style }}
          aria-roledescription={snapshot.isDragging ? "Dragging task" : "Task item"}
        >
          {/* Drag Handle: Apply dragHandleProps to a specific element if you don't want the whole item to be the handle */}
          <div {...provided.dragHandleProps} className="drag-handle" aria-label="Drag task to reorder" tabIndex={isDndDisabled || isEditing ? -1 : 0}>
             <i className='bx bx-grid-vertical'></i> {/* Example drag handle icon */}
          </div>

          {isEditing && !isDeleted ? (
            <input
              ref={inputRef} type="text" value={editText}
              onChange={handleInputChange} onKeyDown={handleInputKeyDown} onBlur={handleInputBlur}
              className="task-item-edit-input"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Edit title for task: \${title}`}
            />
          ) : (
            <span
              ref={titleSpanRef}
              onClick={handleTitleClick}
              onKeyDown={handleTitleKeyDown}
              tabIndex={(isDeleted || isDndDisabled || isEditing) ? -1 : 0} // Make span focusable for editing
              role={(isDeleted || isDndDisabled || isEditing) ? undefined : "button"} // Role button if clickable
              aria-label={isEditing? undefined : `Task: \${title}. Status: \${completed ? 'Completed' : 'Active'}. \${isImportant ? 'Important.' : ''} Click or press Enter to edit.`}
              style={{ /* ... same style ... */
                cursor: (isDeleted || isDndDisabled || isEditing) ? 'default' : 'pointer'
              }}
              // title={(isDeleted || isDndDisabled || isEditing) ? title : "Click to edit title"}
            >
              {title}
            </span>
          )}

          <div className="task-item-controls"> {/* Controls are grouped */}
          {isInRecycleBinView ? (
            <>
              <button className="restore bx bx-undo" onClick={() => restoreTask(id)} title="Restore task" aria-label="Restore task"></button>
              <button className="delete bx bx-trash" onClick={() => permanentDeleteTask(id)} title="Delete permanently" aria-label="Delete task permanently"></button>
            </>
          ) : (
            <>
              <input type="checkbox" checked={completed} onChange={() => toggleTask(id)} disabled={isDeleted ?? false} aria-label={`Mark task \${title} as \${completed ? 'incomplete' : 'complete'}`} />
              <button className={`bx \${isImportant ? 'bxs-star' : 'bx-star'}`} onClick={handleToggleImportant} disabled={isDeleted ?? false} title={isImportant ? 'Unmark important' : 'Mark important'} aria-label={isImportant ? `Unmark task \${title} as important` : `Mark task \${title} as important`}></button>
              <button className="delete bx bx-trash" onClick={() => softDeleteTask(id)} disabled={isDeleted ?? false} title="Move to recycle bin" aria-label={`Move task \${title} to recycle bin`}></button>
            </>
          )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default TaskItem;
