import React, { useEffect, useRef } from 'react';
import { useTaskStore, FilterValues } from '../store/taskStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const setFilter = useTaskStore((state) => state.setFilter);
  const currentFilter = useTaskStore((state) => state.currentFilter);
  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);


  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  const handleFilterClick = (filter: FilterValues) => {
    setFilter(filter);
    onClose(); // Close sidebar after selecting a filter
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  useEffect(() => {
    // Cast document to any to allow addEventListener with KeyboardEvent
    const doc = document as any;
    doc.addEventListener('keydown', handleKeyDown);
    return () => {
      doc.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  return (
    <aside
      ref={sidebarRef}
      className={`sidebar \${isOpen ? 'open' : ''}`}
      id="sidebar"
      aria-hidden={!isOpen}
      aria-labelledby="sidebar-title"
    >
      <h2 id="sidebar-title" className="sr-only">Navigation Menu</h2> {/* For screen readers */}
      <button
        ref={closeButtonRef}
        id="close-sidebar"
        className="bx bx-x"
        onClick={onClose}
        aria-label="Close sidebar"
      ></button>
      <a
        ref={firstLinkRef}
        href="#"
        onClick={(e) => { e.preventDefault(); handleFilterClick(FilterValues.ALL); }}
        className={currentFilter === FilterValues.ALL ? 'active' : ''}
        aria-current={currentFilter === FilterValues.ALL ? 'page' : undefined}
      >All Tasks</a>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleFilterClick(FilterValues.ACTIVE); }}
        className={currentFilter === FilterValues.ACTIVE ? 'active' : ''}
        aria-current={currentFilter === FilterValues.ACTIVE ? 'page' : undefined}
      >Active</a>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleFilterClick(FilterValues.COMPLETED); }}
        className={currentFilter === FilterValues.COMPLETED ? 'active' : ''}
        aria-current={currentFilter === FilterValues.COMPLETED ? 'page' : undefined}
      >Completed</a>
      <a
        href="#"
        id="important-tasks"
        onClick={(e) => { e.preventDefault(); handleFilterClick(FilterValues.IMPORTANT); }}
        className={currentFilter === FilterValues.IMPORTANT ? 'active' : ''}
        aria-current={currentFilter === FilterValues.IMPORTANT ? 'page' : undefined}
      >Important</a>
      <a
        href="#"
        id="recycle-bin"
        onClick={(e) => { e.preventDefault(); handleFilterClick(FilterValues.DELETED); }}
        className={currentFilter === FilterValues.DELETED ? 'active' : ''}
        aria-current={currentFilter === FilterValues.DELETED ? 'page' : undefined}
      >Recycle Bin</a>
    </aside>
  );
};

export default Sidebar;
