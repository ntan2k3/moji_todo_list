import axiosInstance from "@/lib/axios";

export const authService = {
  signUp: async (username: string, email: string, password: string) => {
    const res = await axiosInstance.post(
      "/auth/signup",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await axiosInstance.post(
      "/auth/signin",
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return res.data;
  },

  signOut: async () => {
    return await axiosInstance.post(
      "/auth/signout",
      {},
      {
        withCredentials: true,
      }
    );
  },

  getMe: async () => {
    const res = await axiosInstance.get("/users/me", { withCredentials: true });

    return res.data.user;
  },

  refreshToken: async () => {
    const res = await axiosInstance.post("/auth/refresh", {
      withCredentials: true,
    });

    return res.data.accessToken;
  },
};
