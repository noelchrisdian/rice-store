import { CustomerCart } from "../pages/customer/cart/cart";
import { CustomerCheckout } from "../pages/customer/checkout";
import { CustomerHome } from "../pages/customer/home/index";
import { CustomerOrders } from "../pages/customer/orders/index";
import { CustomerOrderDetail } from "../pages/customer/orders/detail/detail";
import { CustomerProductDetail } from "../pages/customer/product/detail";
import { EditUserForm } from "../pages/admin/users/edit";
import { findOrder, getCustomerOrder } from "../services/orders";
import { getCart } from "../services/carts";
import { getCustomer } from "../services/users";
import { getGlobalProduct, getGlobalProducts } from "../services/products";
import { getIndexReviews, getProductReview } from "../services/reviews";
import { getSession } from "../utils/axios";
import { OrderInvoice } from "../pages/customer/orders/invoice";
import { redirect } from "react-router-dom";
import { toast } from "sonner";
import { UserSettings } from "../pages/settings";

const router = [
	{
		index: true,
		loader: async () => {
			const products = await getGlobalProducts();
			const reviews = await getIndexReviews();
			return {
				initial: products.data,
				reviews: reviews.data
			}
		},
		element: <CustomerHome />
	},
	{
		path: "/products/:id",
		loader: async ({ params }) => {
			try {
				const product = await getGlobalProduct(params.id);
				const reviews = await getProductReview(params.id);

				return {
					product: product.data,
					reviews: reviews.data
				}
			} catch (error) {
				toast.error(
					error?.response?.data?.message === `Product doesn't exist`
						? "Produk tidak ditemukan"
						: "Terjadi kesalahan di sistem"
				)
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
				return redirect("/sign-in");
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
				id: "order-detail",
				loader: async ({ params }) => {
					try {
						const order = await findOrder(params.id);
						return order.data;
					} catch (error) {
						toast.error(
							error?.response?.data?.message === `Order doesn't exist`
								? "Pesanan tidak ditemukan"
								: "Terjadi kesalahan di sistem"
						)
						return redirect("/orders");
					}
				},
				children: [
					{
						path: "/orders/:id",
						element: <CustomerOrderDetail />
					},
					{
						path: "orders/:id/invoice",
						element: <OrderInvoice role={"customer"} />
					}
				]
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