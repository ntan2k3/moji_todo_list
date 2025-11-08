export interface Task {
  _id: string;
  title: string;
  status: "active" | "completed";
  completedAt: string;
  createdAt: string;
  userId: string;
}
