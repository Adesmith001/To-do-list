import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Theme = 'light' | 'dark';

export interface Task { /* ... as before ... */
  id: string; title: string; completed: boolean; isImportant: boolean; isDeleted: boolean;
}
export const enum FilterValues { /* ... as before ... */
  ALL = 'ALL', ACTIVE = 'ACTIVE', COMPLETED = 'COMPLETED', IMPORTANT = 'IMPORTANT', DELETED = 'DELETED',
}

interface TaskState {
  tasks: Task[];
  currentFilter: FilterValues;
  theme: Theme; // New theme state
  // ... other actions ...
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  softDeleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentDeleteTask: (id: string) => void;
  clearCompletedTasks: () => void;
  setFilter: (filter: FilterValues) => void;
  toggleImportant: (id: string) => void;
  updateTaskTitle: (id: string, newTitle: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  toggleTheme: () => void; // New theme action
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentFilter: FilterValues.ALL,
      theme: 'light', // Default theme
      // ... other actions implementations ...
      addTask: (title) => set((state) => ({ tasks: [...state.tasks, { id: uuidv4(), title, completed: false, isImportant: false, isDeleted: false }], })),
      toggleTask: (id) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task ), })),
      softDeleteTask: (id) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, isDeleted: true } : task ), })),
      restoreTask: (id) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, isDeleted: false } : task ), })),
      permanentDeleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id), })),
      clearCompletedTasks: () => set((state) => ({ tasks: state.tasks.map(task => task.completed && !task.isDeleted ? { ...task, isDeleted: true } : task) })),
      setFilter: (filter) => set({ currentFilter: filter }),
      toggleImportant: (id) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, isImportant: !task.isImportant } : task ), })),
      updateTaskTitle: (id, newTitle) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, title: newTitle } : task ), })),
      reorderTasks: (startIndex, endIndex) => set((state) => {
        const activeTasks = state.tasks.filter(task => !task.isDeleted);
        const otherTasks = state.tasks.filter(task => task.isDeleted);
        if (state.currentFilter !== FilterValues.ALL && state.currentFilter !== FilterValues.ACTIVE && state.currentFilter !== FilterValues.COMPLETED && state.currentFilter !== FilterValues.IMPORTANT) {
            console.warn("Reordering is currently best supported on ALL, ACTIVE, COMPLETED or IMPORTANT filters.");
        }
        const [removed] = activeTasks.splice(startIndex, 1);
        activeTasks.splice(endIndex, 0, removed);
        return { tasks: [...activeTasks, ...otherTasks] };
      }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'todo-list-storage', // Existing persist config
      storage: createJSONStorage(() => localStorage),
      // Persist theme along with tasks. onRehydrateStorage might need to default theme if not present.
      onRehydrateStorage: (state) => {
        return (_state, error) => {
          if (error) { console.log('An error happened during hydration', error); }
          else {
            if (_state) {
              _state.tasks = _state.tasks.map(task => ({
                ...task,
                isImportant: task.isImportant ?? false,
                isDeleted: task.isDeleted ?? false,
                title: task.title ?? 'Untitled Task',
              }));
              _state.theme = _state.theme ?? 'light'; // Default theme if not in storage
            }
          }
        };
      }
    }
  )
);

// selectFilteredTasks remains the same
export const selectFilteredTasks = (state: TaskState): Task[] => { /* ... as before ... */
  const { tasks, currentFilter } = state;
  let tasksToDisplay: Task[];
  if (currentFilter === FilterValues.DELETED) {
    tasksToDisplay = tasks.filter(task => task.isDeleted);
  } else {
    const activeTasks = tasks.filter(task => !task.isDeleted);
    switch (currentFilter) {
      case FilterValues.ACTIVE: tasksToDisplay = activeTasks.filter(task => !task.completed); break;
      case FilterValues.COMPLETED: tasksToDisplay = activeTasks.filter(task => task.completed); break;
      case FilterValues.IMPORTANT: tasksToDisplay = activeTasks.filter(task => task.isImportant); break;
      case FilterValues.ALL: default: tasksToDisplay = activeTasks; break;
    }
  }
  return tasksToDisplay;
};
