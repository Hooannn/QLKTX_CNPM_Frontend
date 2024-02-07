import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import getRouter from "./router";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={getRouter()}></RouterProvider>
      <Toaster />
    </QueryClientProvider>
  </NextUIProvider>
);
