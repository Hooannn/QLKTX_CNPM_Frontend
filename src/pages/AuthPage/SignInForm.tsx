import { Input, Button, Link } from "@nextui-org/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";

type SignInInputs = {
  username: string;
  password: string;
};
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>();

  const { signInMutation } = useAuth();

  const onSubmit: SubmitHandler<SignInInputs> = (data) => {
    signInMutation.mutateAsync(data)
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Hệ thống quản lý kí túc xá Học viện cơ sở Bưu chính viễn thông - Thành phố Hồ Chí Minh,</h3>
        <h3 className="font-medium text-3xl">Đăng nhập để tiếp tực.</h3>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Input
          errorMessage={errors.username?.message}
          {...register("username", {
            required: "Tên đăng nhập là bắt buộc",
          })}
          color="primary"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(onSubmit)();
            }
          }}
          variant="bordered"
          type="email"
          label="Tên đăng nhập"
          placeholder="Điền tên đăng nhập"
        />
        <Input
          errorMessage={errors.password?.message}
          {...register("password", {
            required: "Mật khẩu là bắt buộc",
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
          placeholder="Nhập mật khẩu"
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

        <div className="mx-auto">
          <Link
            className="cursor-pointer"
            onClick={() => {
              searchParams.set("type", "forgotPassword");
              setSearchParams(searchParams);
            }}
            color="foreground"
            size="sm"
            underline="always"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          isLoading={
            signInMutation.isLoading
          }
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Đăng nhập
        </Button>
      </div>
    </>
  );
}
