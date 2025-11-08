import { useTaskStore } from "@/stores/useTaskStore";
import type { FilterTimes, FilterType } from "@/types/filter";
import { useEffect, useState, useCallback } from "react";
import SignOut from "@/components/auth/signout";
import AddTask from "@/components/dashboard/AddTask";
import Header from "@/components/dashboard/Header";
import StatsAndFilter from "@/components/dashboard/StatsAndFilter";
import TaskList from "@/components/dashboard/TaskList";
import DateTimeFilter from "@/components/dashboard/DateTimeFilter";
import TaskListPagination from "@/components/dashboard/TaskListPagination";

const VISIBLE_TASK_LIMIT = 4;

const DashboardPage = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const getAllTasks = useTaskStore((s) => s.getAllTasks);

  const [dateQuery, setDateQuery] = useState<FilterTimes>("all");
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState<number>(1);

  // Lọc task theo filter
  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : task.status === filter
  );

  // Tính tổng số trang
  const totalPage = Math.ceil(filteredTasks.length / VISIBLE_TASK_LIMIT);

  const visibleTasks = filteredTasks.slice(
    (page - 1) * VISIBLE_TASK_LIMIT,
    page * VISIBLE_TASK_LIMIT
  );

  const handleNext = () => {
    if (page < totalPage) setPage((p) => p + 1);
  };

  const handlePre = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (visibleTasks.length === 0) {
    handlePre();
  }
  // Memo hóa hàm update task list
  const fetchTasks = useCallback(() => {
    getAllTasks(dateQuery);
  }, [getAllTasks, dateQuery]);

  // Lấy danh sách các tasks khi dateQuery thay đổi
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [dateQuery, filter]);

  return (
    <div className="min-h-screen pt-8 bg-gradient-purple mx-auto">
      <div className="flex justify-end px-8">
        <SignOut />
      </div>

      <div className="max-w-2xl w-full p-6 mx-auto space-y-6">
        {/* Header */}
        <Header />

        {/* AddTask */}
        <AddTask handleUpdateTaskList={fetchTasks} />

        {/* StatsAndFilter */}
        <StatsAndFilter filter={filter} setFilter={setFilter} />

        {/* TaskList */}
        <TaskList
          filteredTasks={visibleTasks}
          filter={filter}
          handleUpdateTaskList={fetchTasks}
        />

        {/* DateTimeFilter and Pagination */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <TaskListPagination
            handleNext={handleNext}
            handlePre={handlePre}
            handlePageChange={handlePageChange}
            page={page}
            totalPage={totalPage}
          />
          <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
