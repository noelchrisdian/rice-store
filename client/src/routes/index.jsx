import { AuthLayout } from "../layouts/auth";
import { createBrowserRouter, redirect } from "react-router-dom";
import { getSession } from "../utils/axios";
import { LoginForm } from "../pages/login/form";
import { NotFound } from "../pages/404";
import { RegisterForm } from "../pages/register/form";
import { router as AdminRouter } from "./admin";
import { router as CustomerRouter } from "./customer";

const router = createBrowserRouter([
	{
		element: <AuthLayout />,
		children: [
			{
				path: "/sign-in",
				loader: async () => {
					const session = await getSession();
					if (session) throw redirect(session.role === 'admin' ? '/admin' : '/');

					return null
				},
				element: <LoginForm />
			},
			{
				path: "/sign-up",
				element: <RegisterForm />
			}
		]
	},
	...AdminRouter,
	...CustomerRouter,
	{
		path: '*',
		element: <NotFound />
	}
])

export {
    router
}