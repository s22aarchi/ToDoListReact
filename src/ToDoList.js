import React, { useState, useEffect } from 'react';
import './ToDoList.css';
const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'active'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const validateTask = (task) => {
    if (task.trim() === '') {
      setError('Task cannot be empty');
      return false;
    }
    setError('');
    return true;
  };

  const addTask = (task, isCompleted = false) => {
    if (!validateTask(task)) return;
    const newTasks = [...tasks, { text: task, completed: isCompleted }];
    setTasks(newTasks);
    setNewTask('');
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleCompletion = (index) => {
    const newTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleSort = (tasks) => {
    return tasks.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.text.localeCompare(b.text);
      } else {
        return b.text.localeCompare(a.text);
      }
    });
  };

  const filteredAndSortedTasks = handleSort(
    tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'active') return !task.completed;
      return true;
    })
  );

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={() => addTask(newTask)}>Add Task</button>
      <button onClick={() => addTask(newTask, true)}>Add Completed Task</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      <ul>
        {filteredAndSortedTasks.map((task, index) => (
          <li key={index}>
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
              onClick={() => toggleCompletion(index)}
            >
              {task.text}
            </span>
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;


