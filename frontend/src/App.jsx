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
    <div className="mx-20 mt-12 p-6 bg-slate-200 rounded-xl shadow-md font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">FastAPI + React Todo App</h2>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </form>

      <ul className="divide-y divide-gray-100">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between py-3 group">
            <div 
              className="flex items-center flex-grow cursor-pointer select-none" 
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed ? (
                <CheckCircle size={20} className="text-green-500 mr-3 shrink-0" />
              ) : (
                <Circle size={20} className="text-gray-400 mr-3 shrink-0 group-hover:text-gray-600" />
              )}
              <span className={`text-base transition-all ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)} 
              className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
