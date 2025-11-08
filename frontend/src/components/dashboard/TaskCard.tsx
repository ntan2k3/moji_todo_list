import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/useTaskStore";
import type { Task } from "@/types/task";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

type TaskCardProps = {
  task: Task;
  handleUpdateTaskList: () => void;
};

const TaskCard = ({ task, handleUpdateTaskList }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [updateTitleTask, setUpdateTitleTask] = useState(task.title || "");

  const handleUpdateTask = async (task: Task) => {
    await updateTask(task._id, updateTitleTask, task.status, task.completedAt);
    handleUpdateTaskList();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    handleUpdateTaskList();
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "active" : "completed";
    const completedAt =
      newStatus === "completed" ? new Date().toISOString() : "";

    await updateTask(task._id, task.title, newStatus, completedAt);
    handleUpdateTaskList();
  };

  return (
    <Card
      className={cn(
        "p-4 bg-white/80 border-0 shadow-md hover:shadow-lg",
        task.status === "completed" && "opacity-75"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-6 sm:size-8 rounded-full",
            task.status === "completed"
              ? "text-green-500 hover:text-green-500/80"
              : "text-muted-foreground"
          )}
          onClick={() => handleToggleComplete(task)}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="size-4 sm:size-5" />
          ) : (
            <Circle className="size-4 sm:size-5" />
          )}
        </Button>

        {/* Hiển thị và chỉnh sửa */}
        <div className="flex-1 min-w-0 space-y-2">
          {isEditing ? (
            <Input
              placeholder=""
              className="flex-1 h-12 text-sm sm:text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updateTitleTask}
              onChange={(e) => setUpdateTitleTask(e.target.value)}
              onBlur={() => {
                setUpdateTitleTask(task.title);
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateTask(task);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <p
              className={cn(
                "text-sm sm:text-base",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          {/* Ngày tạo & hoàn thành */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground">-</span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Chỉnh và xóa */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 sm:size-8 text-muted-foreground hover:text-info cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            <SquarePen className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-6 sm:size-8 text-muted-foreground hover:text-destructive cursor-pointer"
            onClick={() => handleDeleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
