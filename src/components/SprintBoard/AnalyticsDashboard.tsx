
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "lucide-react";

interface AnalyticsDashboardProps {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  tasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export const AnalyticsDashboard = ({
  totalTasks,
  completedTasks,
  completionPercentage,
  tasksByPriority,
}: AnalyticsDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tasks Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} />
            <p className="text-sm text-gray-600 italic">
              {completionPercentage >= 75
                ? "Almost there! Keep up the great work!"
                : completionPercentage >= 50
                ? "You're making good progress!"
                : completionPercentage >= 25
                ? "Keep pushing forward!"
                : "Let's get started on these tasks!"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">High</span>
              </div>
              <span className="font-medium">{tasksByPriority.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm text-gray-600">Medium</span>
              </div>
              <span className="font-medium">{tasksByPriority.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Low</span>
              </div>
              <span className="font-medium">{tasksByPriority.low}</span>
            </div>
            <div className="pt-2">
              <div className="h-[100px] flex items-end justify-around">
                {tasksByPriority.high > 0 && (
                  <div
                    className="bg-red-500 w-8 rounded-t"
                    style={{
                      height: `${(tasksByPriority.high / totalTasks) * 100}px`,
                      minHeight: "10px",
                    }}
                  ></div>
                )}
                {tasksByPriority.medium > 0 && (
                  <div
                    className="bg-amber-500 w-8 rounded-t"
                    style={{
                      height: `${(tasksByPriority.medium / totalTasks) * 100}px`,
                      minHeight: "10px",
                    }}
                  ></div>
                )}
                {tasksByPriority.low > 0 && (
                  <div
                    className="bg-green-500 w-8 rounded-t"
                    style={{
                      height: `${(tasksByPriority.low / totalTasks) * 100}px`,
                      minHeight: "10px",
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
