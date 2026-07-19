import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Plus, Edit2 } from 'lucide-react';
import TodoModal from './components/TodoModal'; // Import the new modal component
import TodoItem from './components/TodoItem.jsx';

const API_URL = 'http://localhost:8000/todos';

// Blank template state for establishing new todo structures
const initialTodoState = { title: '', status: 'To Do', blockers: '', notes: '', completed: false, due_date: '' };

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

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="w-3/6 p-4">
      <h2 className="text-2xl font-bold underline italic mb-4">James' ToDo list!</h2>
      
      <div className="mb-6 flex justify-end">
        <button 
          onClick={handleAddClick} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus size={18} />
          <span>Add New Task</span>
        </button>
      </div>

      <div className="mt-6">
        {todos.length === 0 ? (
          <p className="text-gray-500 italic text-center">No Tasks Found.</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEditClick={handleEditClick}
              onDelete={deleteTodo}
              />
          ))
        )}
      </div>

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
