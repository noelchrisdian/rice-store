import { AuthLayout } from "../layouts/auth";
import { ChangePassword } from "../pages/password/change";
import { createBrowserRouter, redirect } from "react-router-dom";
import { EmailSent } from "../pages/password/sent";
import { ForgotPassword } from "../pages/password/forgot";
import { getSession } from "../utils/axios";
import { LoginForm } from "../pages/login/form";
import { RegisterForm } from "../pages/register/form";
import { router as AdminRouter } from "./admin";
import { router as CustomerRouter } from "./customer";

const router = createBrowserRouter([
	{
		element: <AuthLayout />,
		children: [
			{
				path: "/sign-in",
				loader: () => {
					const session = getSession();
					if (session) {
						if (session.role === "admin") {
							throw redirect("/admin");
						} else {
							throw redirect("/");
						}
					}
				},
				element: <LoginForm />
			},
			{
				path: "/sign-up",
				element: <RegisterForm />
			},
			{
				path: '/forgot-password',
				element: <ForgotPassword />
			},
			{
				path: '/forgot-password/email-sent',
				element: <EmailSent />
			},
			{
				path: '/change-password',
				element: <ChangePassword />
			}
		]
	},
	...AdminRouter,
	...CustomerRouter
])

export {
    router
}