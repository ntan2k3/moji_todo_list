import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    //
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Lấy ra token từ "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedUser) => {
      if (error) {
        console.error(error);
        return res
          .status(403)
          .json({ message: "Access token hết hạn hoặc không đúng" });
      }

      const user = await User.findById(decodedUser.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      req.user = user;

      next();
    });
    // Xác nhận token hợp lệ
  } catch (error) {
    console.error("Lỗi khi xác minh jwt");
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
