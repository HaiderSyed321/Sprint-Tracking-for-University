
import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types/task";
import { saveToDatabase, loadFromDatabase, handleTaskOperation } from "@/services/taskService";

export type TaskFilters = {
  priority: string;
  searchTerm: string;
  dueDate: string;
};

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    priority: "",
    searchTerm: "",
    dueDate: ""
  });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const loadedTasks = await loadFromDatabase();
        setTasks(loadedTasks);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveToDatabase(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = async (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID()
    };
    
    return handleTaskOperation(
      async () => {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await saveToDatabase(updatedTasks);
        return true;
      },
      "Task created successfully",
      "Failed to create task"
    );
  };

  const updateTask = async (updatedTask: Task) => {
    return handleTaskOperation(
      async () => {
        const updatedTasks = tasks.map((task) => 
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        await saveToDatabase(updatedTasks);
        return true;
      },
      "Task updated successfully",
      "Failed to update task"
    );
  };

  const deleteTask = async (taskId: string) => {
    return handleTaskOperation(
      async () => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        await saveToDatabase(updatedTasks);
        return true;
      },
      "Task deleted successfully",
      "Failed to delete task"
    );
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    return handleTaskOperation(
      async () => {
        const taskToMove = tasks.find((t) => t.id === taskId);
        if (!taskToMove) return false;

        const updatedTask = { ...taskToMove, status: newStatus };
        const updatedTasks = tasks.map((task) => 
          task.id === taskId ? updatedTask : task
        );
        
        setTasks(updatedTasks);
        await saveToDatabase(updatedTasks);
        return true;
      },
      newStatus === "completed" ? "Task completed! 🎉" : "Task moved successfully",
      "Failed to move task"
    );
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      if (filters.dueDate && task.dueDate !== filters.dueDate) {
        return false;
      }
      
      if (filters.searchTerm && 
          !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
          !task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const tasksByStatus = (status: TaskStatus) => {
    return getFilteredTasks().filter(task => task.status === status);
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
    tasks: getFilteredTasks(),
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

// Re-export types and constants for backward compatibility
export * from "@/types/task";
export * from "@/constants/taskConstants";
