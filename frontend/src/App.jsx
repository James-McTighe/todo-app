import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Plus, Edit2, X } from 'lucide-react';

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

      {/* --- EDIT MODAL OVERLAY --- */}
      {isModalOpen && editingTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Task Details</h3>
            
            <form onSubmit={saveUpdatedTodo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editingTodo.status}
                    onChange={(e) => setEditingTodo({ ...editingTodo, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingTodo.completed}
                      onChange={(e) => setEditingTodo({ ...editingTodo, completed: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span>Mark Completed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Blockers</label>
                <input
                  type="text"
                  value={editingTodo.blockers || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, blockers: e.target.value })}
                  placeholder="Any dependencies or blocking issues?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  value={editingTodo.notes || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, notes: e.target.value })}
                  placeholder="Additional contexts..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
