import { Trash2, Edit2 } from 'lucide-react';

// Status color configuration (from your previous dynamic color setup)
const STATUS_COLORS = {
  'Done': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700 line-through',
    badge: 'bg-green-200 text-green-800 line-through'
  },
  'Blocked': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-200 text-red-800'
  },
  'In Progress': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-200 text-blue-800'
  },
  'To Do': {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    badge: 'bg-gray-200 text-gray-800'
  },
  'Awaiting Review': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badge: 'bg-purple-200 text-purple-800'
  }
};

export default function TodoItem({ todo, onEditClick, onDelete }) {
  // Fetch styling based on the status
  const colors = STATUS_COLORS[todo.status] || STATUS_COLORS['To Do'];

  return (
    <div className={`flex flex-col p-4 mb-3 border rounded-lg transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Todo Title */}
          <span className={`font-medium ${colors.text}`}>
            {todo.title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.badge}`}>
            {todo.status}
          </span>
          
          {/* Edit Button */}
          <button 
            onClick={() => onEditClick(todo)}
            className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button 
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Blockers details */}
      {todo.status === 'Blocked' && todo.blockers && (
        <p className="text-sm text-red-600 mt-2 bg-red-100/50 p-2 rounded">
          <strong>Blocker:</strong> {todo.blockers}
        </p>
      )}

      {/* Notes / Micro details */}
      {todo.notes && (
        <p className="text-xs text-gray-500 mt-2 italic">
          {todo.notes}
        </p>
      )}
    </div>
  );
}
