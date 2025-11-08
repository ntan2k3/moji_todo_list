import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = process.env.JWT_EXPIRES_IN || "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    // Lấy thông tin đăng ký từ req
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(409).json({ message: "Người dùng đã tồn tại." });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo tài khoản mới
    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi đăng ký: ", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

export const signIn = async (req, res) => {
  try {
    // Lấy thông tin đăng nhập
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Tìm người dùng theo username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Tên người dùng hoặc mặt khẩu không đúng." });
    }

    // Tạo access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });

    // Tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Tạo session để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Trả refresh token về cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // Trả access token về trong res
    return res
      .status(200)
      .json({ message: `${user.username} đã login thành công`, accessToken });
  } catch (error) {
    console.error("Lỗi khi đăng nhập: ", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

export const signOut = async (req, res) => {
  try {
    // Lấy refresh token tù cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // Xóa refresh token
      await Session.deleteOne({ refreshToken: token });

      // Xóa cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi đăng xuất: ", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy refresh token." });
    }

    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session || session.expiredAt < new Date()) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Tạo access token mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi lấy access token: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
