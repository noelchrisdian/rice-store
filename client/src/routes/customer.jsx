import { CustomerCart } from "../pages/customer/cart";
import { CustomerCheckout } from "../pages/customer/checkout";
import { CustomerHome } from "../pages/customer";
import { CustomerProductDetail } from "../pages/customer/detail";
import { EditUserForm } from "../pages/admin/users/edit";
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
			const product = await getGlobalProduct(params.id);
			return product.data;
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
                path: "/order/confirmation",
				element: <CustomerCheckout />
			}
		]
	}
]

export {
    router
}