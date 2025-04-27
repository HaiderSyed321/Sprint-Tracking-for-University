
import { useDrop } from "react-dnd";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "@/hooks/useTaskManager";
import { 
  Inbox, 
  CheckCircle2, 
  ListTodo, 
  ActivitySquare 
} from "lucide-react";

const getColumnIcon = (status: TaskStatus) => {
  switch (status) {
    case "backlog":
      return <Inbox className="w-4 h-4 text-gray-600" />;
    case "todo":
      return <ListTodo className="w-4 h-4 text-gray-600" />;
    case "inProgress":
      return <ActivitySquare className="w-4 h-4 text-gray-600" />;
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-gray-600" />;
    default:
      return null;
  }
};

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
      className={`bg-gray-50 rounded-lg p-4 space-y-4 min-h-[500px] transition-colors duration-200 ${
        isOver ? "bg-gray-100 border-2 border-classli-primary border-opacity-50" : ""
      }`}
    >
      <h2 className="font-medium text-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getColumnIcon(status)}
          <span>{title}</span>
        </div>
        <span className={`text-sm bg-white px-2 py-1 rounded text-gray-600 transition-all duration-500 ${
          tasks.length > 0 ? "animate-pulse" : ""
        }`}>
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
