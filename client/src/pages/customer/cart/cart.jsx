import { CircleAlert } from "lucide-react";
import { createOrder } from "../../../services/orders";
import { EmptySection } from "./empty";
import { getCart } from "../../../services/carts";
import { ItemSection } from "./item";
import { Modal } from "antd";
import { Navbar } from "../../../components/navbar";
import { toast } from "sonner";
import { updateItem } from "../../../services/carts";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";

const CustomerCart = () => {
	const initial = useLoaderData();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: cart } = useQuery({
		queryKey: ["user-cart"],
		queryFn: async () => {
			const result = await getCart();
			return result.data;
		},
		initialData: initial,
		refetchInterval: 5 * 60 * 1000
	})

	const [cartItem, setCartItem] = useState(cart.products);
	const [modal, setModal] = useState({
		open: false,
		item: null
	})
	const [loadingItem, setLoadingItem] = useState({});

	useEffect(() => {
		setCartItem(cart.products);
	}, [cart.products])

	const { mutateAsync: updateCart } = useMutation({
		mutationFn: (data) => updateItem(data),
		onSuccess: () => queryClient.invalidateQueries(["user-cart"])
	})

	const handleAddQuantity = async (data) => {
		if (data?.quantity >= data?.product?.stock) {
			toast.warning(`Stok terbatas, hanya ${data?.product?.stock} item`);
			return;
		}

		const previousItem = [...cartItem];
		const newQuantity = data.quantity + 1;
		setCartItem((prev) =>
			prev.map((item) =>
				item._id === data._id ? { ...item, quantity: newQuantity } : item
			)
		)

		try {
			setLoadingItem((prev) => ({
				...prev,
				[data?.product?._id]: true
			}))
			await updateCart({
				products: [
					{
						product: data?.product._id,
						quantity: newQuantity
					}
				]
			})
		} catch (error) {
			setCartItem(previousItem);

			if (
				error?.response?.data?.message ===
				"Terlalu banyak request, silakan coba lagi nanti"
			) {
				toast.error(error?.response?.data?.message);
			} else {
				toast.error("Terjadi kesalahan di sistem");
			}
		} finally {
			setLoadingItem((prev) => ({
				...prev,
				[data?.product?._id]: false
			}))
		}
	}

	const handleRemoveQuantity = async (data) => {
		if (data.quantity === 1) {
			setModal({ open: true, item: data });
			return;
		}

		const previousItem = [...cartItem];
		const newQuantity = data.quantity - 1;
		setCartItem((prev) =>
			prev.map((item) =>
				item._id === data._id ? { ...item, quantity: newQuantity } : item
			)
		)

		try {
			setLoadingItem((prev) => ({
				...prev,
				[data?.product?._id]: true
			}))
			await updateCart({
				products: [
					{
						product: data?.product?._id,
						quantity: newQuantity
					}
				]
			})
		} catch (error) {
			setCartItem(previousItem);

			if (
				error?.response?.data?.message ===
				"Terlalu banyak request, silakan coba lagi nanti"
			) {
				toast.error(error?.response?.data?.message);
			} else {
				toast.error("Terjadi kesalahan di sistem");
			}
		} finally {
			setLoadingItem((prev) => ({
				...prev,
				[data?.product?._id]: false
			}))
		}
	}

	const handleRemoveItem = async (data) => {
		setModal({ open: true, item: data });
		setCartItem((prev) => prev.filter((item) => item._id !== data._id));
		try {
			await updateCart({
				products: [
					{
						product: data?.product?._id,
						quantity: 0
					}
				]
			})
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}

		setModal({ open: false, item: null });
	}

	const handleCloseModal = () => {
		setModal({ open: false, item: null });
	}

	const total = cartItem.reduce(
		(acc, item) => acc + item?.product?.price * item?.quantity,
		0
	)

	const { isPending, mutateAsync } = useMutation({
		mutationFn: () => createOrder(),
		onSuccess: () => {
			queryClient.invalidateQueries(["orders"]);
			queryClient.invalidateQueries(["index-products"]);
		}
	})

	const handleCreateOrder = async () => {
		try {
			const response = await mutateAsync();
			const orderID = response?.data?.orderID;
			const token = response?.data?.snap?.token;

			if (!orderID || !token) {
				toast.warning("Token pembayaran tidak valid");
			}

			window.snap.pay(token, {
				onSuccess: () =>
					navigate(`/orders/confirmation?order_id=${orderID}`),
				onPending: () =>
					navigate(`/orders/confirmation?order_id=${orderID}`),
				onError: (result) => {
					toast.error(result?.status_message);
					setTimeout(
						() => navigate(`/orders/confirmation?order_id=${orderID}`),
						3000
					)
				},
				onClose: () => navigate(`/orders/confirmation?order_id=${orderID}`)
			})
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	}

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"cart"} position={"top"} />
			</section>
			<main className="bg-background text-foreground font-sans min-h-screen">
				{cartItem.length > 0 ? (
					<ItemSection
						cartItem={cartItem}
						handleAddQuantity={handleAddQuantity}
						handleCreateOrder={handleCreateOrder}
						handleRemoveQuantity={handleRemoveQuantity}
						loadingItem={loadingItem}
						pending={isPending}
						total={total}
					/>
				) : (
					<EmptySection />
				)}
			</main>
			<Modal
				open={modal.open}
				onCancel={handleCloseModal}
				title={null}
				centered
				closeIcon={null}
				footer={null}
				styles={{
					content: {
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-4">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
							<CircleAlert className="size-10 text-destructive" />
						</div>
						<h2 className="font-font-heading font-bold text-xl text-foreground mb-2">
							Hapus {modal.item?.product?.name} dari keranjang?
						</h2>
					</div>

					<div className="space-y-3">
						<button
							className="w-full h-14 bg-destructive text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
							onClick={() => handleRemoveItem(modal.item)}>
							<span>Hapus</span>
						</button>
						<button
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-semibold text-base transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
							onClick={() => handleCloseModal()}>
							<span>Batal</span>
						</button>
					</div>
				</div>
			</Modal>
			<section className="lg:hidden">
				<Navbar active={"cart"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	CustomerCart
}