import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refreshToken, getMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    if (!accessToken) {
      await refreshToken();
    }

    if (accessToken && !user) {
      await getMe();
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoute;
