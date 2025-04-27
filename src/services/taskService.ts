
import { Task } from "@/types/task";
import { toast } from "sonner";

export const saveToDatabase = async (tasks: Task[]): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("sprintTasks", JSON.stringify(tasks));
      resolve(true);
    }, 500);
  });
};

export const loadFromDatabase = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem("sprintTasks");
      resolve(stored ? JSON.parse(stored) : []);
    }, 500);
  });
};

export const handleTaskOperation = async (
  operation: () => Promise<boolean>,
  successMessage: string,
  errorMessage: string = "Operation failed"
): Promise<boolean> => {
  try {
    const result = await operation();
    if (result) {
      toast.success(successMessage);
    }
    return result;
  } catch (error) {
    console.error(errorMessage, error);
    toast.error(errorMessage);
    return false;
  }
};
