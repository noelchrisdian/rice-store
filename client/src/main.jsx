import "./index.css";
import id_ID from 'antd/locale/id_ID';
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.jsx";
import { StrictMode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Toaster position="top-right" duration={2000} richColors />
		<QueryClientProvider client={queryClient}>
			<ConfigProvider locale={id_ID} theme={{
				token: {
					colorPrimary: 'rgba(61, 111, 46, 0.6)'
				}
			}}>
				<RouterProvider router={router} />
			</ConfigProvider>
		</QueryClientProvider>
	</StrictMode>
)