import { CustomerCart } from "../pages/customer/cart";
import { CustomerCheckout } from "../pages/customer/checkout";
import { CustomerHome } from "../pages/customer";
import { CustomerOrders } from "../pages/customer/orders";
import { CustomerOrderDetail } from "../pages/customer/orders/detail";
import { CustomerProductDetail } from "../pages/customer/detail";
import { EditUserForm } from "../pages/admin/users/edit";
import { findOrder, getCustomerOrder } from "../services/orders";
import { getCart } from "../services/carts";
import { getCustomer } from "../services/users";
import { getGlobalProduct, getGlobalProducts } from "../services/products";
import { getSession } from "../utils/axios";
import { redirect } from "react-router-dom";
import { toast } from "sonner";
import { UserSettings } from "../pages/settings";

const router = [
	{
		index: true,
		loader: async () => {
			const products = await getGlobalProducts();
			return products.data;
		},
		element: <CustomerHome />
	},
	{
		path: "/products/:id",
		loader: async ({ params }) => {
			try {
				const product = await getGlobalProduct(params.id);
				return product.data;
			} catch (error) {
				toast.error(
					error?.response?.data?.message || "Terjadi kesalahan di sistem"
				);
				return redirect("/");
			}
		},
		element: <CustomerProductDetail />
	},
	{
		loader: async () => {
			const session = getSession();
			if (!session || session.role === "admin") {
				toast.warning("Silakan mendaftar atau masuk dengan akun Anda");
				throw redirect("/sign-in");
			}
		},
		children: [
			{
				path: "/cart",
				loader: async () => {
					const cart = await getCart();
					return cart.data;
				},
				element: <CustomerCart />
			},
			{
				path: "/account",
				loader: async () => {
					const user = await getCustomer();
					return user.data;
				},
				element: <UserSettings />
			},
			{
				path: "/account/change-profile",
				loader: async () => {
					const user = await getCustomer();
					return user.data;
				},
				element: <EditUserForm />
			},
			{
				path: "/orders",
				loader: async ({ request }) => {
					const url = new URL(request.url);
					const limit = Number(url.searchParams.get("limit") || 10);
					const page = Number(url.searchParams.get("page") || 1);
					const status = url.searchParams.get("status");
					const range = url.searchParams.get("range");

					const orders = await getCustomerOrder({
						limit,
						page,
						range,
						status
					})
					return orders.data;
				},
				element: <CustomerOrders />
			},
			{
				path: "/orders/:id",
				loader: async ({ params }) => {
					try {
						const order = await findOrder(params.id);
						return order.data;
					} catch (error) {
						toast.error(
							error?.response?.data?.message ||
								"Terjadi kesalahan di sistem"
						);
						return redirect("/orders");
					}
				},
				element: <CustomerOrderDetail />
			},
			{
				path: "/orders/confirmation",
				element: <CustomerCheckout />
			}
		]
	}
]

export {
	router
}