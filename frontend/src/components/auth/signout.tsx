import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const SignOut = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button
      className="p-4 text-xs sm:text-sm sm:p-6 bg-gradient-primary cursor-pointer shadow-md hover:scale-105 hover:shadow-lg"
      onClick={handleLogOut}
    >
      Đăng xuất
    </Button>
  );
};

export default SignOut;
