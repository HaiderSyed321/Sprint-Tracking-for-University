
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useTaskManager, Task, TaskStatus, TaskPriority, PREDEFINED_TAGS } from "@/hooks/useTaskManager";
import { TaskDialog, TaskFormValues } from "./TaskDialog";
import { BoardColumn } from "./BoardColumn";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { TaskFilters } from "./TaskFilters";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "completed", title: "Completed" }
] as const;

export const SprintBoard = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  const {
    isLoading,
    tasks,
    tasksByStatus,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksCompletionStats,
    getTasksByPriority
  } = useTaskManager();
  
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

  const handleCreateTask = (values: TaskFormValues) => {
    const taskToAdd: Omit<Task, "id"> = {
      title: values.title,
      description: values.description || "",
      dueDate: values.dueDate,
      priority: values.priority,
      storyPoints: values.storyPoints,
      status: values.status,
      // Add random tags to make it look more like Jira
      tags: values.tags || [
        // Add 1-2 random tags from predefined tags
        ...PREDEFINED_TAGS.slice(0, Math.floor(Math.random() * 3))
      ]
    };
    
    addTask(taskToAdd);
  };

  const handleEditTask = (values: TaskFormValues) => {
    if (currentTask) {
      const updatedTask: Task = {
        id: currentTask.id,
        title: values.title,
        description: values.description || "",
        dueDate: values.dueDate,
        priority: values.priority,
        storyPoints: values.storyPoints,
        status: values.status,
        tags: values.tags || currentTask.tags
      };
      
      updateTask(updatedTask);
    }
    setCurrentTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setCurrentTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setCurrentTask(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTask = () => {
    if (currentTask) {
      deleteTask(currentTask.id);
      setDeleteDialogOpen(false);
      setCurrentTask(null);
    }
  };

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
  };

  const handleFilterChange = (newFilters: {
    priority: "all" | TaskPriority;
    searchTerm: string;
    dueDate: string;
  }) => {
    setFilters({
      ...newFilters,
      priority: newFilters.priority === "all" ? "" : newFilters.priority
    });
  };

  const completionStats = getTasksCompletionStats();
  const priorityStats = getTasksByPriority();

  if (isLoading) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-classli-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sprint board...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className="h-full p-6 space-y-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Sprint Board</h1>
              <p className="text-gray-600">Organize and track your semester tasks</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          
          <AnalyticsDashboard
            totalTasks={completionStats.total}
            completedTasks={completionStats.completed}
            completionPercentage={completionStats.percentage}
            tasksByPriority={priorityStats}
          />
        </div>
        
        <TaskFilters 
          onFilterChange={handleFilterChange} 
          currentFilters={filters}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <BoardColumn
              key={column.id}
              title={column.title}
              status={column.id}
              tasks={tasksByStatus(column.id)}
              onTaskClick={handleTaskClick}
              onDeleteClick={handleDeleteClick}
              onDropTask={handleDropTask}
            />
          ))}
        </div>

        {tasks.length === 0 && !filters.priority && !filters.searchTerm && !filters.dueDate && (
          <div className="p-8 text-center bg-white rounded-lg border border-dashed border-gray-300 mt-8">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet!</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              Start by creating your first task. Track your assignments, projects, and study sessions.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Task
            </Button>
          </div>
        )}

        <TaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateTask}
          mode="create"
        />

        {currentTask && (
          <TaskDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleEditTask}
            defaultValues={currentTask}
            mode="edit"
          />
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the task "{currentTask?.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DndProvider>
  );
};
