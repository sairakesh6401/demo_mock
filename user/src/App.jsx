import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = 'http://localhost:5000/todos'; 

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API_URL);
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Failed to load todos');
      }
    };
    fetchTodos();
  }, []);

  
  const addTodo = async () => {
    if (newTask.trim() === '') return;
    try {
      const res = await axios.post(API_URL, { task: newTask });
      setTodos([...todos, res.data]);
      setNewTask('');
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add task');
    }
  };

  
  const toggleComplete = async (id, isCompleted) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { isCompleted: !isCompleted });
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error('Error toggling completion:', err);
      setError('Failed to update task');
    }
  };

  
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete task');
    }
  };

  
  const startEditTodo = (id, task) => {
    setEditTaskId(id);
    setEditTaskText(task);
  };

  
  const saveEditTodo = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { task: editTaskText });
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setEditTaskId(null);
      setEditTaskText('');
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task');
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTodo}>Add Task</button>

      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo._id}>
              {editTaskId === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                  <button onClick={() => saveEditTodo(todo._id)}>Save</button>
                  <button onClick={() => setEditTaskId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span
                    style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}
                    onClick={() => toggleComplete(todo._id, todo.isCompleted)}
                  >
                    {todo.task || 'Unnamed Task'}
                  </span>
                  <button onClick={() => startEditTodo(todo._id, todo.task)}>Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </ul>
    </div>
  );
}

export default App;
