import axiosInstance from "@/lib/axios";
import type { FilterTimes } from "@/types/filter";

export const taskService = {
  getAllTasks: async (filter: FilterTimes = "all") => {
    const res = await axiosInstance.get(`/tasks?filter=${filter}`, {
      withCredentials: true,
    });

    return res.data;
  },

  addTask: async (title: string) => {
    const res = await axiosInstance.post(
      "/tasks",
      { title },
      { withCredentials: true }
    );

    return res.data;
  },

  updateTask: async (
    id: string,
    title: string,
    status: string,
    completedAt: string
  ) => {
    const res = await axiosInstance.put(
      `/tasks/${id}`,
      { title, status, completedAt },
      { withCredentials: true }
    );

    return res.data;
  },

  deleteTask: async (id: string) => {
    await axiosInstance.delete(`/tasks/${id}`, {
      withCredentials: true,
    });
  },
};
