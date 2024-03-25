import { Input, Button, Link } from "@nextui-org/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";
import toast from "react-hot-toast";

type ResetPasswordInputs = {
  password: string;
  confirmPassword: string;
};
export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordInputs>();
  const watchPassword = watch("password", "");

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }
    await resetPasswordMutation.mutateAsync({
      newPassword: data.password,
      token,
    });
    searchParams.delete("token");
    searchParams.set("type", "signIn");
    setSearchParams(searchParams);
  };

  const { resetPasswordMutation } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Đặt lại mật khẩu,</h3>
        <h3 className="font-medium text-3xl">Nhập mật khẩu mới để tiếp tục.</h3>
      </div>
      <div>
        <div className="font-medium">
          Đã xong?{" "}
          <Link
            className="cursor-pointer"
            color="foreground"
            target="_self"
            underline="always"
            onClick={() => {
              searchParams.set("type", "signIn");
              setSearchParams(searchParams);
            }}
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Input
          errorMessage={errors.password?.message}
          {...register("password", {
            required: "Mật khẩu không được để trống",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(onSubmit)();
            }
          }}
          color="primary"
          label="Mật khẩu"
          variant="bordered"
          placeholder="Nhập mật khẩu của bạn"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
        />

        <Input
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Mật khẩu không được để trống",
            validate: (value) =>
              value === watchPassword || "Mật khẩu không khớp",
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(onSubmit)();
            }
          }}
          color="primary"
          label="Nhập lại mật khẩu"
          variant="bordered"
          placeholder="Nhập lại mật khẩu của bạn"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility2}
            >
              {isVisible2 ? (
                <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible2 ? "text" : "password"}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          isLoading={resetPasswordMutation.isLoading}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Đặt lại mật khẩu
        </Button>
      </div>
    </>
  );
}
