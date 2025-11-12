import { KanbanBoard } from "@/components/KanbanBoard";
import { DUMMY_TASKS } from "@/lib/dummy-tasks";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your projects and tasks efficiently
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total Tasks: <span className="font-semibold">{DUMMY_TASKS.length}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-hidden">
        <KanbanBoard initialTasks={DUMMY_TASKS} />
      </div>
    </main>
  );
}
