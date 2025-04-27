
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { useState } from "react";
import { TaskPriority } from "@/hooks/useTaskManager";

interface TaskFiltersProps {
  onFilterChange: (filters: {
    priority: TaskPriority | "all";
    searchTerm: string;
    dueDate: string;
  }) => void;
  currentFilters: {
    priority: TaskPriority | "";
    searchTerm: string;
    dueDate: string;
  };
}

export const TaskFilters = ({
  onFilterChange,
  currentFilters,
}: TaskFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm);
  const [priority, setPriority] = useState<TaskPriority | "all">(currentFilters.priority === "" ? "all" : currentFilters.priority);
  const [dueDate, setDueDate] = useState(currentFilters.dueDate);
  
  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      priority,
      dueDate,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriority("all");
    setDueDate("");
    onFilterChange({
      searchTerm: "",
      priority: "all",
      dueDate: "",
    });
  };

  const hasActiveFilters = searchTerm || priority !== "all" || dueDate;

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyFilters();
            }
          }}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Select 
          value={priority} 
          onValueChange={(value) => setPriority(value as TaskPriority | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-[180px]"
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={applyFilters} 
            variant="default"
            size="icon"
            title="Apply filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          {hasActiveFilters && (
            <Button 
              onClick={clearFilters} 
              variant="outline"
              size="icon"
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
