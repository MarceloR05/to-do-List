import { useEffect, useState } from 'react';
import { Plus, ListTodo, CheckCircle2, Circle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Task, tasksApi } from './services/api';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

type FilterType = 'todas' | 'pendientes' | 'completadas';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('todas');

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      toast.error('Error al cargar las tareas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData: { title: string; description: string }) => {
    try {
      await tasksApi.create(taskData);
      toast.success('Tarea creada correctamente');
      loadTasks();
    } catch (error) {
      toast.error('Error al crear la tarea');
      console.error(error);
    }
  };

  const handleUpdateTask = async (taskData: { title: string; description: string }) => {
    if (!editingTask) return;

    try {
      await tasksApi.update(editingTask.id, taskData);
      toast.success('Tarea actualizada correctamente');
      loadTasks();
    } catch (error) {
      toast.error('Error al actualizar la tarea');
      console.error(error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      const newCompleted = !task.completed;
      await tasksApi.update(task.id, { completed: newCompleted });
      toast.success(newCompleted ? '¡Tarea completada!' : 'Tarea marcada como pendiente');
      loadTasks();
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error(error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

    try {
      await tasksApi.delete(task.id);
      toast.success('Tarea eliminada correctamente');
      loadTasks();
    } catch (error) {
      toast.error('Error al eliminar la tarea');
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setModalMode('edit');
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pendientes') return task.completed === false;
    if (filter === 'completadas') return task.completed === true;
    return true;
  });

  const stats = {
    total: tasks.length,
    pendientes: tasks.filter(t => t.completed === false).length,
    completadas: tasks.filter(t => t.completed === true).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ListTodo className="text-blue-600" size={36} />
            <h1 className="text-4xl font-bold text-gray-800">To-Do List</h1>
          </div>
          <p className="text-gray-600">Organiza tus tareas de manera eficiente</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.pendientes}</div>
                <div className="text-xs text-gray-500">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completadas}</div>
                <div className="text-xs text-gray-500">Completadas</div>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              Nueva Tarea
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('todas')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'todas'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('pendientes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'pendientes'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Circle size={16} />
            Pendientes
          </button>
          <button
            onClick={() => setFilter('completadas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'completadas'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={16} />
            Completadas
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando tareas...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <ListTodo className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No hay tareas {filter === 'todas' ? '' : filter}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'todas'
                ? '¡Comienza agregando tu primera tarea!'
                : `No tienes tareas ${filter} en este momento`
              }
            </p>
            {filter === 'todas' && (
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear primera tarea
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={modalMode === 'create' ? handleCreateTask : handleUpdateTask}
        task={editingTask}
        mode={modalMode}
      />
    </div>
  );
}

export default App;
