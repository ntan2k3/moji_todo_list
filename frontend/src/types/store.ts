import type { FilterTimes } from "./filter";
import type { Task } from "./task";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface TaskState {
  tasks: Task[];
  activeTaskCount: number;
  completedTaskCount: number;
  loading: boolean;
  getAllTasks: (filter: FilterTimes) => Promise<void>;
  addTask: (title: string) => Promise<void>;
  updateTask: (
    id: string,
    title: string,
    status: string,
    completedAt: string
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}
