import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Plus, Edit2, X } from 'lucide-react';
import EditModal from './components/EditTask';

const API_URL = 'http://localhost:8000/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, status: 'To Do', blockers: '', notes: '' }),
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo({ ...todo });
    setIsModalOpen(true);
  };

  const saveUpdatedTodo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTodo),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === editingTodo.id ? updated : t)));
      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const quickToggleComplete = async (todo) => {
    try {
      const updatedPayload = { ...todo, completed: !todo.completed };
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">FastAPI + React Todo App</h2>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center cursor-pointer">
          <Plus size={18} />
        </button>
      </form>

      <ul className="divide-y divide-gray-100">
        {todos.map((todo) => (
          <li key={todo.id} className="flex flex-col py-4 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-grow cursor-pointer" onClick={() => quickToggleComplete(todo)}>
                {todo.completed ? (
                  <CheckCircle size={20} className="text-green-500 mr-3 shrink-0" />
                ) : (
                  <Circle size={20} className="text-gray-400 mr-3 shrink-0" />
                )}
                <div>
                  <span className={`text-base font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                      {todo.status}
                    </span>
                    {todo.blockers && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEditClick(todo)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded hover:bg-gray-50 cursor-pointer">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-50 cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Micro details row */}
            {todo.notes && (
              <p className="text-xs text-gray-500 mt-2 pl-8 italic line-clamp-1">{todo.notes}</p>
            )}
          </li>
        ))}
      </ul>

      <EditModal onClose={saveUpdatedTodo} isOpen={isModalOpen} todo={editingTodo} />
    </div>
  );
}
