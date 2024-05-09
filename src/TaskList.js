import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function TaskList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');

  const priorityMap = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        text: task,
        category,
        priority,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTask('');
    }
  };

  const toggleTask = index => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    if (newTasks[index].completed) {
      confetti();
    }
    setTasks(newTasks);
  };

  const removeTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const getProgress = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    return priorityMap[a.priority] - priorityMap[b.priority];
  });

  return (
    <div>
      <h1>JustTasks</h1>
      <input
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="New Task"
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>
      <h2>Progress: {getProgress().toFixed(1)}%</h2>
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar"
          style={{
            width: `${getProgress()}%`,
          }}
        />
      </div>
      <ul>
        {sortedTasks.map((t, index) => (
          <li
            key={index}
            className="task-item"
            style={{
              border: `2px solid ${
                t.priority === 'High'
                  ? '#f44336'
                  : t.priority === 'Medium'
                  ? '#ff9800'
                  : '#228B22'
              }`,
            }}
          >
            <span>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(index)}
              />
              {t.text} - [{t.category}] - <span className="task-priority">Priority: {t.priority}</span>
            </span>
            <button className="task-delete" onClick={() => removeTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
