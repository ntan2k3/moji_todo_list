import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const { filter = "today" } = req.query;

    const now = new Date();

    let startDate;

    switch (filter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-11-08 00:00
        break;
      case "week":
        const mondayDate =
          now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
        startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = null;
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {};

    const result = await Task.aggregate([
      {
        $match: { userId },
      },
      {
        $match: query,
      },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completedCount: [
            { $match: { status: "completed" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = result[0] || {};
    return res.status(200).json({
      tasks: data.tasks || [],
      activeCount: data.activeCount[0]?.count || 0,
      completedCount: data.completedCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách task:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const addTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title } = req.body;

    const task = await Task.create({ title, userId });
    return res.status(201).json(task);
  } catch (error) {
    console.error("Lỗi khi tạo task: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, status, completedAt },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi cập nhật task: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    res.status(200).json({ message: "Xóa task thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa task: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
