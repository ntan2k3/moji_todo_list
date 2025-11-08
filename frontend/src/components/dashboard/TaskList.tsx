import type { FilterType } from "@/types/filter";
import type { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";

type TaskListProps = {
  filter: FilterType;
  filteredTasks: Task[];
  handleUpdateTaskList: () => void;
};

const TaskList = ({
  filteredTasks,
  filter,
  handleUpdateTaskList,
}: TaskListProps) => {
  if (!filteredTasks || filteredTasks.length === 0) {
    return <TaskEmptyState filter={filter} />;
  }
  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          handleUpdateTaskList={handleUpdateTaskList}
        />
      ))}
    </div>
  );
};

export default TaskList;
