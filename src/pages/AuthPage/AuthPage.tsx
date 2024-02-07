import { Image } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SignInForm from "./SignInForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

type AuthType =
  | "signIn"
  | "forgotPassword"
  | "resetPassword";

export default function AuthPage() {
  const [authType, setAuthType] = useState<AuthType>("signIn");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type") as AuthType;
    setAuthType(type || "signIn");
  }, [searchParams]);

  const form = useMemo(() => {
    switch (authType) {
      case "signIn":
        return <SignInForm />;
      case "forgotPassword":
        return <ForgotPasswordForm />;
      case "resetPassword":
        return <ResetPasswordForm />;
    }
  }, [authType]);

  return (
    <div className="flex gap-8 items-center justify-center h-dvh">
      <div className="w-1/3 p-8 pr-0 overflow-hidden h-full">
        <Image
          removeWrapper
          className="h-full w-full object-cover"
          alt="Authen image"
          src="https://live.staticflickr.com/4156/34289960150_ceeaa1fc57_b.jpg"
        />
      </div>
      <div className="w-2/3 p-8 pl-0">
        <div className="max-w-[700px] mx-auto flex flex-col gap-6">
          <div className="mx-auto pb-8">
            <Image
              removeWrapper
              width={100}
              src="/logo.png"
            />
          </div>
          {form}
        </div>
      </div>
    </div>
  );
}
