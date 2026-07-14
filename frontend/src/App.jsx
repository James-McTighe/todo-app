import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Plus, Edit2 } from 'lucide-react';
import TodoModal from './components/TodoModal'; // Import the new modal component

const API_URL = 'http://localhost:8000/todos';

// Blank template state for establishing new todo structures
const initialTodoState = { title: '', status: 'To Do', blockers: '', notes: '', completed: false };

export default function App() {
  const [todos, setTodos] = useState([]);
  
  // Unified Modal Management State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTodo, setActiveTodo] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  // Open modal in creation mode
  const handleAddClick = () => {
    setActiveTodo({ ...initialTodoState });
    setIsModalOpen(true);
  };

  // Open modal in update mode
  const handleEditClick = (todo) => {
    setActiveTodo({ ...todo });
    setIsModalOpen(true);
  };

  // Unified Save Operation (Handles both POST and PUT methods)
  const handleSaveTodo = async (e) => {
    e.preventDefault();
    if (!activeTodo.title.trim()) return;

    const isEditing = !!activeTodo.id;
    const url = isEditing ? `${API_URL}/${activeTodo.id}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeTodo),
      });
      const data = await res.json();

      if (isEditing) {
        setTodos(todos.map((t) => (t.id === activeTodo.id ? data : t)));
      } else {
        setTodos([...todos, data]);
      }

      setIsModalOpen(false);
      setActiveTodo(null);
    } catch (err) {
      console.error(`Error saving todo via ${method}:`, err);
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
      
      {/* Replaced top input bar with a clean trigger button */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={handleAddClick} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus size={18} />
          <span>Add New Task</span>
        </button>
      </div>

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

            {todo.notes && (
              <p className="text-xs text-gray-500 mt-2 pl-8 italic line-clamp-1">{todo.notes}</p>
            )}
          </li>
        ))}
      </ul>

      {/* Extracted Global Todo Management Modal Component */}
      <TodoModal 
        isOpen={isModalOpen}
        todo={activeTodo}
        onClose={() => { setIsModalOpen(false); setActiveTodo(null); }}
        onChange={setActiveTodo}
        onSave={handleSaveTodo}
      />
    </div>
  );
}
