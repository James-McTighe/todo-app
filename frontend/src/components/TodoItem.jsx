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

  const formatToDdMmmYyyy = (dateString) => {
    if (!dateString) return '';

    // Expecting standard HTML format: "YYYY-MM-DD"
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Fallback if format is unexpected

    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthName = months[monthIndex] || parts[1];

    return `${day}-${monthName}-${year}`;
  };

  const getDueDateColorClass = (dateString) => {
    if (!dateString) return 'text-gray-500 bg-gray-100'; // Default styling if no due date

    // Parse target date and current date (ignoring times for accurate day calculation)
    const targetDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds and convert to days
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      // Overdue / Elapsed
      return 'text-red-700 bg-red-100 border border-red-200';
    } else if (daysRemaining <= 30) {
      // Within 30 days
      return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
    }

    // Fallback for more than 30 days out
    return 'text-green-700 bg-green-100 border border-green-200';
  };

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

          {/* Due Date */}
          {todo.due_date && (
            <span className={ `text-s px-2 py-1 rounded ${getDueDateColorClass(todo.due_date)}` }>
              Due: {formatToDdMmmYyyy(todo.due_date)}
            </span>
          )}

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
