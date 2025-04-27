
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type TaskStatus = "backlog" | "todo" | "inProgress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  storyPoints: number;
  status: TaskStatus;
}

// This would be replaced with real Supabase integration
const mockSaveToDatabase = async (tasks: Task[]): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("sprintTasks", JSON.stringify(tasks));
      resolve(true);
    }, 500);
  });
};

// This would be replaced with real Supabase loading
const mockLoadFromDatabase = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem("sprintTasks");
      resolve(stored ? JSON.parse(stored) : []);
    }, 500);
  });
};

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    priority: "" as TaskPriority | "",
    searchTerm: "",
    dueDate: ""
  });

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const loadedTasks = await mockLoadFromDatabase();
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  // Save tasks when they change
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      const saveTasks = async () => {
        try {
          await mockSaveToDatabase(tasks);
        } catch (error) {
          console.error("Error saving tasks:", error);
          toast.error("Failed to save tasks");
        }
      };
      
      saveTasks();
    }
  }, [tasks, isLoading]);

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID()
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await mockSaveToDatabase(updatedTasks);
      toast.success("Task created successfully");
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to create task");
      return false;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const updatedTasks = tasks.map((task) => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      setTasks(updatedTasks);
      await mockSaveToDatabase(updatedTasks);
      toast.success("Task updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return false;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      await mockSaveToDatabase(updatedTasks);
      toast.success("Task deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const taskToMove = tasks.find((t) => t.id === taskId);
      if (!taskToMove) return false;

      const updatedTask = { ...taskToMove, status: newStatus };
      const updatedTasks = tasks.map((task) => 
        task.id === taskId ? updatedTask : task
      );
      
      setTasks(updatedTasks);
      await mockSaveToDatabase(updatedTasks);
      return true;
    } catch (error) {
      console.error("Error moving task:", error);
      toast.error("Failed to move task");
      return false;
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filter by priority if set
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      // Filter by due date if set
      if (filters.dueDate && task.dueDate !== filters.dueDate) {
        return false;
      }
      
      // Filter by search term
      if (filters.searchTerm && 
          !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
          !task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  const tasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getTasksCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  };

  const getTasksByPriority = () => {
    const high = tasks.filter(task => task.priority === "high").length;
    const medium = tasks.filter(task => task.priority === "medium").length;
    const low = tasks.filter(task => task.priority === "low").length;
    
    return { high, medium, low };
  };

  return {
    isLoading,
    tasks: filteredTasks,
    tasksByStatus,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksCompletionStats,
    getTasksByPriority
  };
};
