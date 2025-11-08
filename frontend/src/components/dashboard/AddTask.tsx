import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useTaskStore } from "@/stores/useTaskStore";

type AddTaskProps = {
  handleUpdateTaskList: () => void;
};

const AddTask = ({ handleUpdateTaskList }: AddTaskProps) => {
  const { addTask } = useTaskStore();
  const [newTitleTask, setNewTitleTask] = useState<string>("");

  const handleAddTask = async () => {
    if (!newTitleTask.trim()) return;

    try {
      await addTask(newTitleTask);
      handleUpdateTaskList();
      setNewTitleTask("");
    } catch (error) {
      console.error("Thêm task thất bại:", error);
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì..."
          className="h-10 sm:h-12 text-sm sm:text-base bg-slate-50 sm:flex-1 rounded-[8px] border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={newTitleTask}
          onChange={(e) => setNewTitleTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTask();
            }
          }}
        />
        <Button
          variant="gradient"
          className="rounded-[8px] text-sm sm:text-base h-10 sm:h-12"
          size="xl"
          onClick={handleAddTask}
          disabled={!newTitleTask.trim()}
        >
          <Plus className="size-4 sm:size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
