import { create } from "zustand";
import type { TaskState } from "@/types/store";
import { toast } from "sonner";
import { taskService } from "@/services/taskService";
import type { FilterTimes } from "@/types/filter";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  activeTaskCount: 0,
  completedTaskCount: 0,
  loading: false,

  getAllTasks: async (filter: FilterTimes = "all") => {
    try {
      set({ loading: true });

      const data = await taskService.getAllTasks(filter);
      set({
        tasks: data.tasks,
        activeTaskCount: data.activeCount,
        completedTaskCount: data.completedCount,
      });
    } catch (error) {
      console.error(error);
      toast.error("Lấy danh sách nhiệm vụ thất bại.");
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (title) => {
    try {
      set({ loading: true });

      const newTask = await taskService.addTask(title);
      // Cập nhật danh sách nhiệm vụ
      set({ tasks: [newTask, ...get().tasks] });
      toast.success("Tạo nhiệm vụ mới thành công.");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo nhiệm vụ mới.");
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id, title, status, completedAt) => {
    try {
      set({ loading: true });

      const updatedTask = await taskService.updateTask(
        id,
        title,
        status,
        completedAt
      );

      // Cập nhật danh sách nhiệm vụ
      set({
        tasks: get().tasks.map((task) =>
          task._id === id ? updatedTask : task
        ),
      });
      toast.success("Cập nhật nhiệm vụ thành công.");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ loading: true });

      await taskService.deleteTask(id);

      // Cập nhật danh sách nhiệm vụ
      set({ tasks: get().tasks.filter((task) => task._id !== id) });
      toast.success("Xóa nhiệm vụ thành công.");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa nhiệm vụ.");
    } finally {
      set({ loading: false });
    }
  },
}));
