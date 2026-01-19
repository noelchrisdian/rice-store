import {
	ArrowLeft,
	Calendar,
	ClipboardCheck,
	ClipboardClock,
	ClipboardX,
	Contact,
	CreditCard,
	MapPin,
	Printer,
	Store
} from "lucide-react";
import { CircularLoading } from "respinner";
import { createReview, reviewSchema } from "../../../services/reviews";
import { findOrder } from "../../../services/orders";
import {
	Form,
	Image,
	Input,
	Modal,
	Rate
} from "antd";
import { Link, useLoaderData } from "react-router-dom";
import { handleDate } from "../../../utils/date";
import { handleCurrency } from "../../../utils/price";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";

const CustomerOrderDetail = () => {
	const initial = useLoaderData();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const [modal, setModal] = useState({
		open: false,
		data: null
	})

	const handleCloseModal = () => {
		setModal({ open: false, data: null });
		form.resetFields();
	}

	const setPaymentStatus = (data) => {
		if (["settlement", "capture"].includes(data)) {
			return "Berhasil";
		} else if (["deny", "cancel", "expire", "failure"].includes(data)) {
			return "Gagal";
		} else if (data === "pending") {
			return "Pending";
		}
	}

	const { data: order } = useQuery({
		queryKey: ['order_detail', initial?._id],
		queryFn: () => findOrder(initial?._id),
		initialData: initial
	})

	const { isPending, mutateAsync } = useMutation({
		mutationFn: ({ data, orderID, productID }) =>
			createReview(data, orderID, productID),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['order_detail', initial?._id] });
			toast.success('Ulasan Anda berhasil disimpan');
			form.resetFields();
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message);
		}
	})

	const onFinish = async (data) => {
		const result = await reviewSchema.safeParseAsync(data);
		if (!result.data) {
			const fieldErrors = result.error.flatten().fieldErrors;
			form.setFields(
				Object.entries(fieldErrors).map(([name, errors]) => ({
					name,
					errors
				}))
			)

			return;
		}

		try {
			await mutateAsync({
				data,
				orderID: order?.data?._id,
				productID: modal.data?._id
			})
		} finally {
			setModal({
				open: false,
				data: null
			})
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	return (
		<main className="bg-background font-sans text-foreground min-h-screen pt-10 pb-2">
			<Link
				to={"/orders"}
				className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5">
				<ArrowLeft className="size-6" />
			</Link>
			<section className="px-4 pt-6 space-y-6 lg:max-w-3xl lg:mx-auto">
				<div className="bg-card rounded-2xl border border-border p-4 space-y-4">
					<div className="flex items-center justify-between">
						<div className="">
							<p className="text-sm text-muted-foreground">
								Status Pesanan
							</p>
							<p className="font-semibold text-foreground mt-1">
								{setPaymentStatus(order?.data?.payment?.status)}
							</p>
						</div>
						<div className="">
							<p className="text-xs text-muted-foreground tracking-wide">
								Tanggal Pesanan
							</p>
							<p className="text-sm text-foreground mt-1">
								{handleDate(order?.createdAt)}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Item Pesanan
					</h2>
					<div className="space-y-4">
						{order.data?.products.map((product, index) => (
							<div
								className="flex items-center gap-3 pb-4 border-b border-border"
								key={index}>
								<Image
									src={product?.product?.image?.imageURL}
									height={85}
									width={85}
									className="rounded-xl! object-cover! bg-muted! border! border-border/50!"
								/>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-sm text-foreground">
										{product?.product?.name}
									</p>
									<div className="text-xs text-muted-foreground mt-1">
										Jumlah : {product?.quantity}
									</div>
									<p className="font-semibold text-foreground mt-2">
										{handleCurrency(
											product?.product?.price * product?.quantity
										)}
									</p>
									{order?.data?.status === "success" &&
										!product?.reviewed && (
											<div className="flex justify-end">
												<button
													onClick={() =>
														setModal({
															open: true,
															data: product.product
														})
													}
													className="bg-none text-xs text-primary cursor-pointer hover:underline focus:underline">
													Beri Ulasan
												</button>
											</div>
										)}
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-heading text-lg font-bold text-foreground mb-4">
						Rincian Pembayaran
					</h2>
					<div className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Subtotal</span>
							<span className="text-foreground">
								{handleCurrency(order?.data?.totalPrice)}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Diskon</span>
							<span className="text-foreground">
								{handleCurrency(0)}
							</span>
						</div>
						<div className="flex items-center justify-between pt-3 border-t border-border">
							<span className="font-semibold text-foreground">
								Total
							</span>
							<span className="text-foreground">
								{handleCurrency(order?.data?.totalPrice)}
							</span>
						</div>
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Informasi Pembayaran
					</h2>
					<div className="space-y-5">
						<div className="flex items-start gap-3">
							<CreditCard className="size-7 text-primary mt-0.5 shrink-0" />
							<div className="flex-1">
								<p className="text-xs text-muted-foreground tracking-wide mb-1">
									Metode Pembayaran
								</p>
								<p className="text-sm text-foreground">Midtrans</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							{setPaymentStatus(order?.data?.payment?.status) === "Berhasil" ? (
								<ClipboardCheck className="size-7 text-primary mt-0.5 shrink-0" />
							) : setPaymentStatus(order?.data?.payment?.status) ===
							  "Pending" ? (
								<ClipboardClock className="size-7 text-primary mt-0.5 shrink-0" />
							) : (
								<ClipboardX className="size-7 text-destructive mt-0.5 shrink-0" />
							)}
							<div className="flex-1">
								<p className="text-xs text-muted-foreground tracking-wide mb-1">
									Status Pembayaran
								</p>
								<p className="text-sm text-foreground">
									{setPaymentStatus(order?.data?.payment?.status)}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Calendar className="size-7 text-primary mt-0.5 shrink-0" />
							<div className="flex-1">
								<p className="text-xs text-muted-foreground tracking-wide mb-1">
									Tanggal Pembayaran
								</p>
								<p className="text-sm text-foreground">
									{handleDate(order?.data?.payment?.paidAt)}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Alamat Pengiriman
					</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<Contact className="size-7 text-primary mt-0.5 shrink-0" />
							<div className="flex-1 mb-2">
								<p className="text-sm text-foreground mb-1">
									{order?.data?.user?.name}
								</p>
								<p className="text-sm text-foreground mb-1">
									{order?.data?.user?.email}
								</p>
								<p className="text-sm text-foreground">
									{order?.data?.user?.phoneNumber}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<MapPin className="size-7 text-primary mt-0.5 shrink-0" />
							<div className="flex-1">
								<p className="text-sm text-foreground mb-2 lg:mt-1.5">
									{order?.data?.user?.address}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Informasi Penjual
					</h2>
					<div className="flex items-start gap-3">
						<Store className="size-7 text-primary mt-0.5 shrink-0" />
						<div className="flex-1">
							<p className="text-sm text-foreground font-semibold mb-1">
								Toko Beras AD
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Jalan Kedung Ombo A46
								<br />
								Lembah Hijau, Magelang 56172
								<br />
								Jawa Tengah, Indonesia
							</p>
						</div>
					</div>
				</div>
				<div className="px-4 pb-6 space-y-3">
					<button className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">
						<Printer className="size-6" />
					</button>
				</div>
			</section>
			<Modal
				open={modal.open}
				onCancel={handleCloseModal}
				title={null}
				centered
				footer={null}
				styles={{
					content: {
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card">
					<div className="space-y-6 p-2 max-h-[80vh] overflow-y-auto">
						<div className="flex items-center gap-3">
							<div className="size-12 bg-secondary rounded-xl overflow-hidden shrink-0">
								<img
									alt={modal.data?.name}
									src={modal.data?.image?.imageURL}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="">
								<p className="font-bold text-lg text-foreground">
									{modal.data?.name}
								</p>
								<p className="text-xs text-muted-foreground">
									Bagikan pengalaman Anda dengan produk ini
								</p>
							</div>
						</div>
						<Form form={form} onFinish={onFinish}>
							<div className="space-y-3">
								<Form.Item
									name={"rating"}
									required={false}
									className="[&_.ant-form-item-explain]:mt-2"
									rules={[
										{ required: true, message: "Rating wajib diisi" }
									]}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: "0.5rem",
										marginBlock: "0.75rem"
									}}>
									<Rate
										className="ant-rate-review"
										allowClear={false}
									/>
								</Form.Item>
							</div>
							<div className="mb-7 space-y-2">
								<label
									htmlFor="comment"
									className="text-sm font-semibold text-foreground px-1">
									Berikan ulasan Anda
								</label>
								<Form.Item
									name={"comment"}
									required={false}
									className="[&_.ant-form-item-explain]:my-2"
									rules={[
										{ required: true, message: "Ulasan wajib diisi" }
									]}>
									<Input.TextArea
										id="comment"
										className="w-full! min-h-35! bg-input/50! border-none! rounded-2xl! p-4! text-foreground! placeholder:text-muted-foreground! focus:ring-2! focus:ring-primary/50! focus:outline-none! resize-none! mt-2!"
									/>
								</Form.Item>
							</div>
							<button
								disabled={isPending}
								type="submit"
								className="w-full h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl font-bold text-base shadow-md cursor-pointer transition-all active:scale-[0.98] focus:outline-none focus:ring-primary focus:ring-2">
								{isPending ? (
									<CircularLoading color="#FFFFFF" size={30} />
								) : (
									"Kirim Ulasan"
								)}
							</button>
						</Form>
					</div>
				</div>
			</Modal>
		</main>
	)
}

export {
	CustomerOrderDetail
}