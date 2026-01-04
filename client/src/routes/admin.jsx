import { AddInventoryForm } from "../pages/admin/inventories/add";
import { AddProductForm } from "../pages/admin/products/add";
import { AdminDetailOrder } from "../pages/admin/orders/detail";
import { AdminDetailProduct } from "../pages/admin/products/detail";
import { AdminHome } from "../pages/admin";
import { AdminOrders } from "../pages/admin/orders";
import { AdminProducts } from "../pages/admin/products/index";
import { AdminUsers } from "../pages/admin/users";
import { EditInventoryForm } from "../pages/admin/inventories/edit";
import { EditProductForm } from "../pages/admin/products/edit";
import { EditUserForm } from "../pages/admin/users/edit";
import { FormLayout } from "../layouts/form";
import { getAdmin, getUsers } from "../services/users";
import { getInventories, getInventory } from "../services/inventories";
import { getOrder, getOrders } from "../services/orders";
import { getProduct, getProducts } from "../services/products";
import { getReviews } from "../services/reviews";
import { getSession } from "../utils/axios";
import { redirect } from "react-router-dom";
import { UserSettings } from "../pages/settings";

const router = [
	{
		path: "/admin",
		loader: () => {
			const session = getSession();
			if (!session || session.role !== "admin") {
				throw redirect("/");
			}
		},
		children: [
			{
				index: true,
				element: <AdminHome />,
			},
			{
				path: "/admin/products",
				loader: async () => {
					const products = await getProducts();
					return products.data;
				},
				element: <AdminProducts />
			},
			{
				element: <FormLayout />,
				children: [
					{
						path: "/admin/products/add-product",
						element: <AddProductForm />,
					},
					{
						path: "/admin/products/edit-product/:id",
						loader: async ({ params }) => {
							if (!params.id) {
								throw redirect("/admin/products");
							}

							const product = await getProduct(params.id);
							return product.data;
						},
						element: <EditProductForm />
					},
					{
						path: "/admin/products/:productID/inventories/add-inventory",
						loader: async ({ params }) => {
							const product = await getProduct(params.productID);
							return product.data;
						},
						element: <AddInventoryForm />
					},
					{
						path: "/admin/products/:productID/inventories/edit-inventories/:id",
						loader: async ({ params }) => {
							if (!params.id) {
								throw redirect("/admin/products");
							}

							const product = await getProduct(params.productID);
							const inventory = await getInventory(
								params.id,
								params.productID
							)
							return {
								inventory: inventory.data,
								product: product.data,
							}
						},
						element: <EditInventoryForm />
					},
					{
						path: "/admin/change-profile",
						loader: async () => {
							const user = await getAdmin();
							return user.data;
						},
						element: <EditUserForm />
					}
				]
			},
			{
				path: "/admin/products/:id",
				loader: async ({ params, request }) => {
					if (!params.id) {
						throw redirect("/admin/products");
					}

					const url = new URL(request.url);

					const inventoryLimit = Number(
						url.searchParams.get("inventoryLimit") || 10
					)
					const inventoryPage = Number(
						url.searchParams.get("inventoryPage") || 1
					)

					const reviewLimit = Number(
						url.searchParams.get("reviewLimit") || 10
					)
					const reviewPage = Number(
						url.searchParams.get("reviewPage") || 1
					)

					const [product, inventories, reviews] = await Promise.all([
						getProduct(params.id),
						getInventories(params.id, { inventoryLimit, inventoryPage }),
						getReviews(params.id, { reviewLimit, reviewPage })
					])

					return {
						product: product.data,
						inventories: inventories.data,
						reviews: reviews.data
					}
				},
				element: <AdminDetailProduct />
			},
			{
				path: "/admin/orders",
				loader: async ({ request }) => {
					const url = new URL(request.url);
					const limit = Number(url.searchParams.get("limit") || 10);
					const page = Number(url.searchParams.get("page") || 1);

					const orders = await getOrders({ limit, page });
					return orders.data;
				},
				element: <AdminOrders />
			},
			{
				path: "/admin/orders/:id",
				loader: async ({ params }) => {
					if (!params.id) {
						throw redirect("/admin/orders");
					}

					const order = await getOrder(params.id);
					return order.data;
				},
				element: <AdminDetailOrder />
			},
			{
				path: "/admin/users",
				loader: async ({ request }) => {
					const url = new URL(request.url);
					const limit = Number(url.searchParams.get("limit") || 10);
					const page = Number(url.searchParams.get("page") || 1);

					const users = await getUsers({ limit, page });
					return users.data;
				},
				element: <AdminUsers />
			},
			{
				path: "/admin/settings",
				loader: async () => {
					const user = await getAdmin();
					return user.data;
				},
				element: <UserSettings />
			}
		]
	}
]

export {
    router
}