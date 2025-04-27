
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  BarChart, 
  MoreVertical, 
  Edit, 
  Trash2 
} from "lucide-react";
import { Task } from "@/hooks/useTaskManager";
import { useDrag } from "react-dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isHovered, setIsHovered] = useState(false);

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
      className={`p-4 cursor-pointer transition-all duration-200 bg-white relative
        ${isDragging ? "opacity-50 scale-105 shadow-lg" : "opacity-100"}
        ${isHovered ? "transform -translate-y-1 shadow-md" : "shadow"}
      `}
      onClick={(e) => {
        // Prevent click if we're clicking the dropdown menu
        if ((e.target as HTMLElement).closest('[data-dropdown]')) {
          e.stopPropagation();
          return;
        }
        onClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="flex items-center gap-1">
            <Badge className={`${getPriorityColor(priority)} capitalize`}>
              {priority}
            </Badge>
            
            {isHovered && (
              <div 
                data-dropdown 
                onClick={(e) => e.stopPropagation()} 
                className="ml-1"
              >
                <TooltipProvider>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actions</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onClick}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              </div>
            )}
          </div>
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
