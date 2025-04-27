
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  BarChart, 
  MoreVertical, 
  Edit, 
  Trash2,
  Tag,
  ArrowUp,
  ArrowDown,
  ArrowRight
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
  onDeleteClick?: () => void;
}

// Get color for priority indicator
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

// Get priority icon
const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <ArrowUp className="w-3 h-3 text-red-600" />;
    case "medium":
      return <ArrowRight className="w-3 h-3 text-amber-600" />;
    case "low":
      return <ArrowDown className="w-3 h-3 text-green-600" />;
    default:
      return null;
  }
};

// Get task ID display format (like Jira's TIS-123)
const getTaskIdDisplay = (id: string) => {
  // Use first 6 characters of the UUID to simulate a Jira ticket number
  const shortId = id.substring(0, 6).toUpperCase();
  return `TIS-${shortId}`;
};

export const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  priority,
  storyPoints,
  status,
  tags = [], // Default to empty array if no tags
  onClick,
  onDeleteClick,
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
      className={`p-3 cursor-pointer transition-all duration-200 bg-white relative border-l-4 
        ${priority === 'high' ? 'border-l-red-500' : 
          priority === 'medium' ? 'border-l-amber-500' : 'border-l-green-500'}
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
        {/* Header with task ID and actions */}
        <div className="flex justify-between items-start pb-2">
          <span className="text-xs font-mono text-gray-500 font-medium">
            {getTaskIdDisplay(id)}
          </span>
          
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
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteClick) onDeleteClick();
                      }} 
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Task title */}
        <h3 className="font-medium text-gray-900">{title}</h3>
        
        {/* Task tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 my-2">
            {tags.map((tag) => (
              <div 
                key={tag.id} 
                className="text-xs py-0.5 px-2 rounded-sm font-medium" 
                style={{ 
                  backgroundColor: `${tag.color}20`, // Add transparency
                  color: tag.color,
                  border: `1px solid ${tag.color}40` // More transparent border
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
        
        {/* Task description - only show short preview */}
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        
        {/* Footer with metadata */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 mt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Priority indicator */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  {getPriorityIcon(priority)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{priority} priority</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Story points */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                      {storyPoints}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{storyPoints} story points</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Due date */}
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
