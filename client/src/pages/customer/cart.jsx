import {
	CircleAlert,
	CircleMinus,
	CirclePlus,
	CircleQuestionMark,
	ShoppingBag
} from "lucide-react";
import { CircularLoading } from "respinner";
import { createOrder } from "../../services/orders";
import { getCart } from "../../services/carts";
import { handleCurrency } from "../../utils/price";
import { Link, useLoaderData } from "react-router-dom";
import { Modal } from "antd";
import { Navbar } from "../../components/Navbar";
import { toast } from "sonner";
import { updateItem } from "../../services/carts";
import { useEffect, useState } from "react";
import {
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";

const CustomerCart = () => {
	const initial = useLoaderData();
	const queryClient = useQueryClient();

	const { data: cart } = useQuery({
		queryKey: ["user-cart"],
		queryFn: async () => {
			const result = await getCart();
			return result.data;
		},
		initialData: initial,
		refetchInterval: 1000 * 60 * 10,
		refetchOnWindowFocus: true
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
						quantity: newQuantity,
					}
				]
			})
		} catch (error) {
			toast.error(error?.response?.data?.message);
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
						quantity: newQuantity,
					}
				]
			})
		} catch (error) {
			toast.error(error?.response?.data?.message);
		} finally {
			setLoadingItem((prev) => ({
				...prev,
				[data?.product?._id]: false,
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
		mutationFn: () => createOrder()
	})

	const handleCreateOrder = async () => {
		try {
			const result = await mutateAsync();
			window.location.href = result?.data?.snap?.redirect_url;
		} catch (error) {
			toast.error(error?.response?.data?.message)
		}
	}

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"cart"} position={"top"} />
			</section>
			<main className="bg-background text-foreground font-sans min-h-screen">
				{cartItem.length > 0 ? (
					<section className="lg:max-w-7xl lg:mx-auto">
						<div className="px-6 pt-8 pb-6 lg:pt-28">
							<div className="">
								<div className="space-y-4">
									{cartItem.map((item, index) => (
										<div
											className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm"
											key={index}>
											<div className="flex gap-4">
												<div className="w-24 h-24 rounded-xl bg-secondary overflow-hidden shrink-0">
													<img
														src={item?.product?.image?.imageURL}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="flex-1 flex flex-col">
													<div className="flex justify-between items-start mb-2">
														<div className="">
															<h3 className="font-font-heading text-lg leading-tight mb-1">
																{item?.product?.name}
															</h3>
															<p className="text-sm text-muted-foreground mb-1.5">
																{item?.product?.weightPerUnit}{" "}
																kg
															</p>
															<span className="font-bold text-primary text-md">
																{handleCurrency(
																	item?.product?.price
																)}
															</span>
														</div>
													</div>
													<div className="mt-2 flex items-center justify-end">
														<div className="flex items-center gap-3 bg-secondary rounded-lg px-1 py-1">
															<button
																disabled={
																	loadingItem[
																		item?.product?._id
																	]
																}
																className="size-8 flex items-center justify-center text-primary cursor-pointer rounded-lg transition-all active:bg-primary/10"
																onClick={() =>
																	handleRemoveQuantity(item)
																}>
																<CircleMinus className="size-5" />
															</button>
															<span className="font-semibold text-foreground min-w-5 text-center">
																{loadingItem[
																	item?.product?._id
																] ? (
																	<CircularLoading
																		color="#3D6F2E"
																		size={18}
																	/>
																) : (
																	item?.quantity
																)}
															</span>
															<button
																disabled={
																	loadingItem[
																		item?.product?._id
																	]
																}
																className="size-8 flex items-center justify-center text-primary cursor-pointer rounded-lg transition-all active:bg-primary/10"
																onClick={() =>
																	handleAddQuantity(item)
																}>
																<CirclePlus className="size-5" />
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						<div className="px-6 pb-24">
							<div className="bg-card rounded-2xl border border-border/50 pt-5 px-5 pb-2 shadow-sm sticky top-2/4">
								<h3 className="font-font-heading text-xl font-semibold mb-6">
									Rincian Pesanan
								</h3>
								<div className="space-y-4 mb-6">
									<div className="flex justify-between text-sm">
										<div className="text-muted-foreground">
											Subtotal
										</div>
										<span className="font-medium text-foreground">
											{handleCurrency(total)}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<div className="text-muted-foreground">
											Diskon
										</div>
										<span className="font-medium text-foreground">
											{handleCurrency(0)}
										</span>
									</div>
									<div className="border-t border-border pt-4 mb-6">
										<div className="flex justify-between items-baseline">
											<span className="text-foreground font-semibold">
												Total
											</span>
											<span className="font-font-heading text-3xl font-bold text-primary">
												{handleCurrency(total)}
											</span>
										</div>
									</div>
									<button disabled={isPending} onClick={() => handleCreateOrder()} className="w-3xs mx-auto bg-primary text-primary-foreground font-bold p-4 rounded-xl cursor-pointer transition-all flex items-center justify-center shadow-lg text-lg shadow-primary/20 mb-2 mt-10 active:scale-[0.98]">
										{isPending ? <CircularLoading color="#FFFFFF" size={28}/> : 'Bayar'}
									</button>
								</div>
							</div>
						</div>
					</section>
				) : (
					<section className="min-h-screen flex items-center justify-center">
						<div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
							<div className="relative mb-8 flex items-center justify-center">
								<div className="absolute size-64 rounded-full bg-secondary/30 blur-2xl" />
								<div className="absolute size-40 rounded-full bg-accent/40 blur-xl top-10 right-10" />
								<div className="relative z-10 flex flex-col items-center justify-center size-48 rounded-full bg-card shadow-[0_8px_30px_rgb(0, 0, 0, 0.04)] border border-border">
									<div className="relative">
										<ShoppingBag className="size-20 text-muted-foreground" />
										<div className="absolute -top-1 -right-1 flex items-center justify-center size-8 rounded-full bg-accent text-accent-foreground ring-4 ring-card">
											<CircleQuestionMark className="size-5 text-muted-foreground" />
										</div>
									</div>
								</div>
							</div>
							<div className="text-center space-y-3 max-w-lg mx-auto">
								<h2 className="text-3xl font-font-heading text-foreground">Keranjangmu masih kosong</h2>
								<p className="text-muted-foreground text-lg leading-relaxed">Sepertinya Anda belum memilih item favorit. Yuk, cek koleksi kami sekarang!</p>
							</div>
							<div className="max-w-lg mt-12 space-y-4">
								<Link to={'/#product'} className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">Mulai Belanja</Link>
							</div>
						</div>
					</section>
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