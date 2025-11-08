import { Circle } from "lucide-react";
import { Card } from "../ui/card";
import type { FilterType } from "@/types/filter";

type TaskEmptyStateProps = {
  filter: FilterType;
};

const TaskEmptyState = ({ filter }: TaskEmptyStateProps) => {
  return (
    <Card className="p-8 text-center border-0 bg-white shadow-md ">
      <div className="space-y-3">
        <Circle className="size-12 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base">
            {filter === "active"
              ? "Không có nhiệm vụ nào đang làm."
              : filter === "completed"
              ? "Chưa có nhiệm vụ nào hoàn thành."
              : "Chưa có nhiệm vụ"}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {filter === "all"
              ? "Thêm nhiệm vụ đầu tiên vào để bắt đầu."
              : `Chuyển sang "tất cả" để thấy những nhiệm vụ.`}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TaskEmptyState;
