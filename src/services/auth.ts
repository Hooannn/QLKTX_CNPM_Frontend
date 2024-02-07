import { useMutation } from "@tanstack/react-query";
import cookies from "../libs/cookies";
import { onError } from "../utils/error-handlers";
import { Credentials, IResponseData, IUser } from "../types";
import { useNavigate } from "react-router-dom";
import { rawAxios } from "../hooks/useAxiosIns";
import { toast } from "react-hot-toast";
import useAuthStore from "../stores/auth";
const useAuth = () => {
  const navigate = useNavigate();
  const { setAccessToken, setLoggedIn, setUser } = useAuthStore();

  const saveCredentialsAndRedirect = (user: IUser, accessToken: string) => {
    const redirectPath = cookies.get("redirect_path") || "/";
    setAccessToken(accessToken);
    setLoggedIn(true);
    setUser(user);
    navigate(redirectPath as string);
  };

  const signInMutation = useMutation({
    mutationFn: (params: { username: string; password: string }) => {
      return rawAxios.post<
        IResponseData<{ user: IUser; credentials: Credentials }>
      >("/api/v1/auth/authenticate", {
        username: params.username,
        password: params.password,
      });
    },

    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      saveCredentialsAndRedirect(user, accessToken);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (params: { email: string }) =>
      rawAxios.post<IResponseData<unknown>>("/api/v1/auth/forgot-password", {
        email: params.email,
      }),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (params: {
      email: string;
      newPassword: string;
      signature: string;
    }) =>
      rawAxios.post<IResponseData<unknown>>("/api/v1/auth/reset-password", {
        email: params.email,
        new_password: params.newPassword,
        signature: params.signature,
      }),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  return {
    signInMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};

export default useAuth;
