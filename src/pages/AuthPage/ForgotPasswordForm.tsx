import { Input, Button, Link } from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";

type ForgotPasswordInputs = {
  email: string;
};

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();

  const { forgotPasswordMutation } = useAuth();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    await forgotPasswordMutation.mutateAsync(data);
    searchParams.set("type", "resetPassword");
    searchParams.set("email", btoa(data.email));
    setSearchParams(searchParams);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Quên mật khẩu,</h3>
        <h3 className="font-medium text-3xl">
          Điền email của bạn để tiếp tục.
        </h3>
      </div>
      <div>
        <div className="font-medium">
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
          startContent={
            <AiOutlineMail className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          errorMessage={errors.email?.message}
          {...register("email", {
            required: "Email không được để trống",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Email không hợp lệ",
            },
          })}
          color="primary"
          variant="bordered"
          type="email"
          label="Email"
          placeholder="Nhập email của bạn"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          isLoading={forgotPasswordMutation.isLoading}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Gửi yêu cầu
        </Button>
      </div>
    </>
  );
}
