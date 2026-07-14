import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, Plus, Edit2, X } from 'lucide-react';

const EditModal = ({ isOpen, onClose, todo }) => {
  if ( !isOpen ) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Task Details</h3>

        <form onSubmit={onClose} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Task Title</label>
            <input
              type="text"
              value={todo.title}
              onChange={(e) => setEditingTodo({ ...todo, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select
                value={todo.status}
                onChange={(e) => setEditingTodo({ ...todo, status: e.target.value })}
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
                  checked={todo.completed}
                  onChange={(e) => setEditingTodo({ ...todo, completed: e.target.checked })}
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
              value={todo.blockers || ''}
              onChange={(e) => setEditingTodo({ ...todo, blockers: e.target.value })}
              placeholder="Any dependencies or blocking issues?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</label>
            <textarea
              value={todo.notes || ''}
              onChange={(e) => setEditingTodo({ ...todo, notes: e.target.value })}
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
  )
}

export default EditModal;
