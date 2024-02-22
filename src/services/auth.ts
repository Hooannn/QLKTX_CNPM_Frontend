import { useMutation } from "@tanstack/react-query";
import { onError } from "../utils/error-handlers";
import { Credentials, IResponseData, IUser, Role } from "../types";
import { useNavigate } from "react-router-dom";
import { rawAxios } from "../hooks/useAxiosIns";
import { toast } from "react-hot-toast";
import useAuthStore from "../stores/auth";
const useAuth = () => {
  const navigate = useNavigate();
  const { setAccessToken, setLoggedIn, setUser } = useAuthStore();

  const saveCredentialsAndRedirect = (user: IUser, accessToken: string) => {
    let redirectPath: string | undefined;
    switch (user.role) {
      case Role.ADMIN:
        redirectPath = "/users-management";
        break;
      case Role.STUDENT:
        redirectPath = "/student";
        break;
      default:
        redirectPath = "/staff";
        break;
    }
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
      rawAxios.post<IResponseData<unknown>>(
        `/api/v1/auth/forgot-password?email=${params.email}`
      ),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (params: { token: string; newPassword: string }) =>
      rawAxios.post<IResponseData<unknown>>(
        `/api/v1/auth/reset-password?token=${params.token}&newPassword=${params.newPassword}`
      ),
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
