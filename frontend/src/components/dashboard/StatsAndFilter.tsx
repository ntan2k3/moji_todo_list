import { Filter } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useTaskStore } from "@/stores/useTaskStore";
import type { FilterType } from "@/types/filter";

const filterTypes = {
  all: "Tất cả",
  active: "Đang làm",
  completed: "Hoàn thành",
} as const;

const filterKeys = Object.keys(filterTypes) as (keyof typeof filterTypes)[];

type StatsAndFilterProps = {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
};

const StatsAndFilter = ({ filter, setFilter }: StatsAndFilterProps) => {
  const { activeTaskCount, completedTaskCount } = useTaskStore();

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Stats */}
      <div className="flex gap-3">
        <Badge
          variant="secondary"
          className="bg-white/50 text-blue-500 border-info/20 "
        >
          {activeTaskCount} {filterTypes.active}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-white/50 text-green-500 border-info/20 "
        >
          {completedTaskCount} {filterTypes.completed}
        </Badge>
      </div>

      {/* Filter */}
      <div className="flex gap-2 w-full sm:justify-end sm:w-auto">
        {filterKeys.map((type) => (
          <Button
            key={type}
            variant={filter === type ? "gradient" : "ghost"}
            size="sm"
            className="capitalize rounded-[8px]"
            onClick={() => setFilter(type)}
          >
            <Filter className="hidden sm:size-4 sm:block" />
            <span className="text-xs">{filterTypes[type]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StatsAndFilter;
