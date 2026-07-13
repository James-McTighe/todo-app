import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Plus } from 'lucide-react';

const API_URL = 'http://localhost:8000/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch all todos on load
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Toggle todo status (complete/incomplete)
  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>FastAPI + React Todo App</h2>
      
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <Plus size={18} />
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? (
                <CheckCircle size={20} color="green" style={{ marginRight: '10px' }} />
              ) : (
                <Circle size={20} color="#ccc" style={{ marginRight: '10px' }} />
              )}
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#000' }}>
                {todo.title}
              </span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
