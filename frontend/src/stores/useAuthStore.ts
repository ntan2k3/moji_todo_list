import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, email, password) => {
    try {
      set({ loading: true });

      await authService.signUp(username, email, password);

      toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang đăng nhập.");
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công.");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().getMe();

      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();

      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi đăng xuất.");
    }
  },

  getMe: async () => {
    try {
      set({ loading: true });

      const user = await authService.getMe();
      set({ user });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy dữ liệu người dùng.");
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    try {
      set({ loading: true });
      const { user, getMe } = get();
      const accessToken = await authService.refreshToken();
      get().setAccessToken(accessToken);

      if (!user) {
        await getMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
