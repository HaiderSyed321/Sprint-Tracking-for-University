
import { useDrop } from "react-dnd";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "@/hooks/useTaskManager";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

export const BoardColumn = ({
  title,
  status,
  tasks,
  onTaskClick,
  onDropTask,
}: BoardColumnProps) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => {
      onDropTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-gray-50 rounded-lg p-4 space-y-4 min-h-[500px] ${
        isOver ? "bg-gray-100" : ""
      }`}
    >
      <h2 className="font-medium text-gray-700 flex items-center justify-between">
        {title}
        <span className="text-sm bg-white px-2 py-1 rounded text-gray-600">
          {tasks.length}
        </span>
      </h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="bg-white p-4 rounded-lg border border-dashed border-gray-200 text-center text-gray-500 text-sm">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
};
