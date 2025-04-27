
import { useState } from "react";
import { TaskCard } from "./TaskCard";

const INITIAL_TASKS = [
  {
    id: "1",
    title: "Research Project Introduction",
    description: "Write the introduction section for the semester research project",
    dueDate: "2025-05-01",
    priority: "high",
    storyPoints: 8,
    status: "backlog"
  },
  {
    id: "2",
    title: "Math Assignment 3",
    description: "Complete problems 1-10 from Chapter 4",
    dueDate: "2025-04-30",
    priority: "medium",
    storyPoints: 5,
    status: "todo"
  }
] as const;

const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "completed", title: "Completed" }
] as const;

export const SprintBoard = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  return (
    <div className="h-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Sprint Board</h1>
        <p className="text-gray-600">Organize and track your semester tasks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg p-4 space-y-4"
          >
            <h2 className="font-medium text-gray-700 flex items-center justify-between">
              {column.title}
              <span className="text-sm bg-white px-2 py-1 rounded text-gray-600">
                {tasks.filter((task) => task.status === column.id).length}
              </span>
            </h2>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    storyPoints={task.storyPoints}
                    onClick={() => console.log("Open task details:", task.id)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
