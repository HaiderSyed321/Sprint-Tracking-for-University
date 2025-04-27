
export type TaskStatus = "backlog" | "todo" | "inProgress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type TaskTag = {
  id: string;
  name: string;
  color: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  storyPoints: number;
  status: TaskStatus;
  tags?: TaskTag[];
}
