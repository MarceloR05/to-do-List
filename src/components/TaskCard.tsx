import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';
import { Task } from '../services/api';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.completed === true;

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
      isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleStatus(task)}
            className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
          >
            {isCompleted ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <Circle className="text-gray-400 hover:text-gray-600" size={24} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium mb-1 ${
              isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mb-2 ${
                isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className={`px-2 py-1 rounded-full ${
                isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                  {isCompleted ? 'Completada' : 'Pendiente'}
              </span>
              <span>•</span>
              <span>{new Date(task.created_at).toLocaleDateString('es-ES')}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar tarea"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar tarea"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
