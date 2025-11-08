import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signUpSchema = z.object({
  username: z.string().min(3, "Username bắt buộc phải có."),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const { username, email, password } = data;

      await signUp(username, email, password);
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="Logo Moji" />
                </a>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Chào mừng bạn đến với Moji!
                </h1>
                <p className="text-muted-foreground text-balance text-xs sm:text-base">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu!
                </p>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-xs sm:text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="moji"
                  className="text-sm"
                  {...register("username")}
                />

                {/* Thêm error message */}
                {errors.username && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-xs sm:text-sm">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="moji@gmail.com"
                  className="text-sm"
                  {...register("email")}
                />

                {/* Thêm errors message */}
                {errors.email && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-xs sm:text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  className="text-sm"
                  {...register("password")}
                />

                {/* Thêm errors message */}
                {errors.password && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Nút đăng ký */}
              <Button
                type="submit"
                className="w-full cursor-pointer text-xs sm:text-base"
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>

              <div className="text-center text-xs sm:text-sm">
                Đã có tài khoản?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 text-xs text-balance">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">điều khoản dịch vụ</a> và{" "}
        <a href="#">chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
