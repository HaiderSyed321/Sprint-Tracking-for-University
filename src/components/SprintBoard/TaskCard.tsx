
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BarChart } from "lucide-react";
import { Task } from "@/hooks/useTaskManager";
import { useDrag } from "react-dnd";

interface TaskCardProps extends Task {
  onClick: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  priority,
  storyPoints,
  status,
  onClick,
}: TaskCardProps) => {
  // Set up dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id, status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Format the date for display
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  return (
    <Card
      ref={drag}
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow bg-white ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <Badge className={`${getPriorityColor(priority)} capitalize`}>
            {priority}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span>{storyPoints} pts</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
