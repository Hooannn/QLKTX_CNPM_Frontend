import { useEffect } from "react";
import axios from "axios";
import useAuthStore from "../stores/auth";
import { useNavigate } from "react-router-dom";

export const rawAxios = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const useAxiosIns = () => {
  const { accessToken, reset } = useAuthStore();
  const navigate = useNavigate();
  const getAccessToken = () => accessToken;

  useEffect(() => {
    const requestIntercept = axiosIns.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"]) {
          const token = getAccessToken();
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosIns.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          reset();
          navigate("/auth?type=signIn");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosIns;
};

export default useAxiosIns;
